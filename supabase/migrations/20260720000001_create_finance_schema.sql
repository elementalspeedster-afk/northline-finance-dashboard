create extension if not exists pgcrypto;

create type account_type as enum ('checking','savings','credit');
create type transaction_category as enum (
  'Income','Housing','Debt payments','Food','Transportation','Healthcare','Investments','Other'
);
create type transaction_status as enum ('completed','pending');
create type goal_term as enum ('short','long');

create table accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type account_type not null,
  balance numeric(12,2) not null default 0,
  currency text not null default 'USD',
  last_four text,
  created_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  description text not null,
  merchant text not null,
  category transaction_category not null,
  amount numeric(12,2) not null,
  status transaction_status not null default 'completed',
  created_at timestamptz not null default now()
);
create index transactions_occurred_at_idx on transactions (occurred_at desc);
create index transactions_account_id_idx on transactions (account_id);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  category transaction_category not null,
  monthly_limit numeric(12,2) not null,
  period date not null default date_trunc('month', now())::date
);
create unique index budgets_category_period_idx on budgets(category, period);

create table goals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null default 'target',
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  term goal_term not null default 'short',
  target_date date,
  created_at timestamptz not null default now()
);

alter table accounts enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table goals enable row level security;

-- Read-only public access: the anon/publishable key can SELECT but never
-- write. All writes go through the simulate-activity edge function using
-- the service-role key server-side.
create policy "public read accounts" on accounts for select using (true);
create policy "public read transactions" on transactions for select using (true);
create policy "public read budgets" on budgets for select using (true);
create policy "public read goals" on goals for select using (true);

alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table accounts;
