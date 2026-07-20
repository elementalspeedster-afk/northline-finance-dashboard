# Northline — Real-Time Finance Dashboard

A real-time personal finance dashboard: balance overview, spending by category,
budgets, goals, and a live transaction feed. Built as a portfolio piece to
demonstrate a genuine full-stack, real-time architecture — not a mock.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS v4, charts with Recharts
- **Backend**: Supabase (Postgres, Row Level Security, Realtime, Edge Functions, pg_cron)

## How the "real-time" part actually works

There is no client-side `setInterval` faking data. Instead:

1. Four tables live in Postgres — `accounts`, `transactions`, `budgets`, `goals`
   — with Row Level Security enabled. The `anon` key used by the browser can
   only `SELECT`; it has no write access.
2. A Supabase **Edge Function** (`supabase/functions/simulate-activity`) inserts
   one randomized transaction and updates the relevant account balance, using
   the service-role key server-side.
3. That function is invoked two ways:
   - **Automatically**, every 2 minutes, via `pg_cron` + `pg_net` (see the
     `schedule_activity_simulation` / `recalibrate_budgets_and_reseed`
     migrations) — so the dashboard stays alive on its own.
   - **On demand**, from the "Simulate transaction" button in the top bar,
     which calls the same function through `supabase.functions.invoke(...)`.
4. The frontend subscribes to Postgres changes on `transactions` and
   `accounts` via `supabase-js` Realtime channels
   (`src/hooks/useRealtimeTable.ts`) — inserts stream straight into React
   state and animate into the UI. Open the dashboard in two tabs to see the
   same change land in both at once.

The income/expense probabilities in `simulate-activity` are calibrated so the
simulated activity trends mildly positive over time (rather than perpetually
blowing through the budgets on a long-lived deployment).

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in your own Supabase project's
URL and anon/publishable key (find them under Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

### Setting up your own Supabase backend

The schema, seed data, and cron schedule live as SQL migrations under
`supabase/migrations/`, and the edge function source is at
`supabase/functions/simulate-activity/index.ts`. Using the
[Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
against your own project:

```bash
supabase link --project-ref your-project-ref
supabase db push                                  # runs the migrations
supabase functions deploy simulate-activity        # deploys the edge function
```

Before running the third migration (`..._schedule_activity_simulation.sql`),
replace `<project-ref>` and `<anon-key>` in that file with your own project's
values — it schedules `pg_cron` to call the deployed function every 2 minutes.

## Deploying

This is a standard Vite app — deploy to Vercel (or any static host):

```bash
npm run build
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables
in your hosting provider's dashboard, matching `.env.example`.

## Project structure

```
src/
  components/       Dashboard widgets (chart, stat cards, goal tracker, etc.)
  hooks/            useRealtimeTable (generic realtime subscription),
                    useDashboardData (composes + derives all metrics)
  lib/               supabaseClient, metrics (pure derivation functions),
                    categories (color mapping), format (currency/date helpers)
  types.ts          Shared types mirroring the Postgres schema
supabase/
  functions/simulate-activity/   Edge function that generates live activity
```
