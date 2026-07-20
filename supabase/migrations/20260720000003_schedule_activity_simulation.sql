-- Schedules the simulate-activity edge function to run automatically so the
-- dashboard has live activity even with nobody clicking "Simulate
-- transaction". Replace <project-ref> and <anon-key> with your own project's
-- values (the anon/publishable key is safe to embed here — it is the same
-- key already shipped to the browser, with read-only RLS behind it).

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select
  cron.schedule(
    'simulate-activity-every-2min',
    '*/2 * * * *',
    $$
    select net.http_post(
      url := 'https://<project-ref>.supabase.co/functions/v1/simulate-activity',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer <anon-key>',
        'apikey', '<anon-key>'
      ),
      body := '{}'::jsonb
    );
    $$
  );
