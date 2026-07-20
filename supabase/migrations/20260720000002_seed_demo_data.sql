-- Seed ~30 days of realistic historical transactions so the charts have
-- real shape on first load. Dates are relative to whenever this migration
-- runs, so the demo always looks "current".

with new_accounts as (
  insert into accounts (name, type, balance, currency, last_four) values
    ('Everyday Checking', 'checking', 0, 'USD', '4821'),
    ('High-Yield Savings', 'savings', 8300, 'USD', '0092'),
    ('Rewards Credit Card', 'credit', 0, 'USD', '7890')
  returning id, name
),
chk as (select id from new_accounts where name = 'Everyday Checking'),
crd as (select id from new_accounts where name = 'Rewards Credit Card'),
raw_tx(day_offset, hour, description, merchant, category, amount, acct) as (
  values
  (29,  9, 'Payroll deposit',        'Acme Corp Payroll',        'Income',          3200.00, 'chk'),
  (29, 10, 'Rent payment',           'Parkview Apartments',      'Housing',         -1450.00,'chk'),
  (28, 12, 'Groceries',              'Trader Joe''s',             'Food',            -64.20,  'chk'),
  (28, 18, 'Streaming subscription', 'Netflix',                  'Other',           -15.49,  'crd'),
  (27,  8, 'Gas station',            'Shell',                    'Transportation',  -41.80,  'chk'),
  (27, 13, 'Coffee',                 'Blue Bottle Coffee',       'Food',            -6.25,   'crd'),
  (26,  9, 'Auto-invest transfer',   'Vanguard Auto-Invest',     'Investments',     -300.00, 'chk'),
  (26, 19, 'Dinner',                 'Local Bistro',             'Food',            -54.00,  'crd'),
  (25, 11, 'Pharmacy',               'CVS Pharmacy',             'Healthcare',      -23.75,  'chk'),
  (25, 17, 'Rideshare',              'Uber',                     'Transportation',  -18.40,  'crd'),
  (24, 10, 'Utilities',              'City Power & Water',       'Housing',         -95.10,  'chk'),
  (24, 14, 'Groceries',              'Whole Foods Market',       'Food',            -88.30,  'chk'),
  (23,  9, 'Loan payment',           'Sallie Mae Loan Services', 'Debt payments',   -220.00, 'chk'),
  (23, 20, 'Takeout',                'DoorDash',                 'Food',            -31.60,  'crd'),
  (22, 15, 'Gym membership',         'Equinox',                  'Other',           -85.00,  'chk'),
  (22, 18, 'Music subscription',     'Spotify',                  'Other',           -10.99,  'crd'),
  (21,  8, 'Transit pass',           'Metro Transit',            'Transportation',  -75.00,  'chk'),
  (21, 12, 'Lunch',                  'Chipotle',                 'Food',            -13.85,  'crd'),
  (20, 11, 'Online shopping',        'Amazon',                   'Other',           -47.20,  'chk'),
  (20, 16, 'Copay',                  'Kaiser Permanente',        'Healthcare',      -40.00,  'chk'),
  (19,  9, 'Card payment',           'Chase Card Payment',       'Debt payments',   -150.00, 'chk'),
  (19, 13, 'Groceries',              'Trader Joe''s',             'Food',            -58.90,  'chk'),
  (18, 17, 'Rideshare',              'Uber',                     'Transportation',  -22.10,  'crd'),
  (17, 12, 'Coffee',                 'Blue Bottle Coffee',       'Food',            -6.75,   'crd'),
  (17, 19, 'Dinner',                 'Local Bistro',             'Food',            -61.20,  'crd'),
  (16, 10, 'Retail',                 'Target',                   'Other',           -58.40,  'chk'),
  (15,  9, 'Payroll deposit',        'Acme Corp Payroll',        'Income',          3200.00, 'chk'),
  (15, 14, 'Auto parts',             'AutoZone',                 'Transportation',  -64.50,  'chk'),
  (14, 11, 'Groceries',              'Whole Foods Market',       'Food',            -91.15,  'chk'),
  (14, 18, 'Takeout',                'DoorDash',                 'Food',            -28.90,  'crd'),
  (13,  9, 'Auto-invest transfer',   'Vanguard Auto-Invest',     'Investments',     -300.00, 'chk'),
  (13, 15, 'Pharmacy',               'CVS Pharmacy',             'Healthcare',      -19.60,  'chk'),
  (12,  8, 'Gas station',            'Shell',                    'Transportation',  -39.75,  'chk'),
  (12, 12, 'Lunch',                  'Chipotle',                 'Food',            -15.20,  'crd'),
  (11, 17, 'Retail',                 'Amazon',                   'Other',           -36.90,  'chk'),
  (10, 10, 'Utilities',              'City Power & Water',       'Housing',         -98.40,  'chk'),
  (10, 19, 'Dinner',                 'Local Bistro',             'Food',            -47.60,  'crd'),
  (9,   9, 'Loan payment',           'Sallie Mae Loan Services', 'Debt payments',   -220.00, 'chk'),
  (9,  13, 'Groceries',              'Trader Joe''s',             'Food',            -66.10,  'chk'),
  (8,  18, 'Streaming subscription', 'Spotify',                  'Other',           -10.99,  'crd'),
  (7,  12, 'Coffee',                 'Blue Bottle Coffee',       'Food',            -7.10,   'crd'),
  (7,  15, 'Rideshare',              'Uber',                     'Transportation',  -20.30,  'crd'),
  (6,  10, 'Groceries',              'Whole Foods Market',       'Food',            -84.75,  'chk'),
  (5,   9, 'Retail',                 'Target',                   'Other',           -63.20,  'chk'),
  (4,  14, 'Copay',                  'Kaiser Permanente',        'Healthcare',      -35.00,  'chk'),
  (3,   9, 'Auto-invest transfer',   'Vanguard Auto-Invest',     'Investments',     -300.00, 'chk'),
  (3,  19, 'Dinner',                 'Local Bistro',             'Food',            -58.40,  'crd'),
  (2,   9, 'Payroll deposit',        'Acme Corp Payroll',        'Income',          3200.00, 'chk'),
  (2,  12, 'Lunch',                  'Chipotle',                 'Food',            -14.60,  'crd'),
  (1,  10, 'Gas station',            'Shell',                    'Transportation',  -43.20,  'chk'),
  (1,  18, 'Takeout',                'DoorDash',                 'Food',            -29.75,  'crd'),
  (0,   9, 'Groceries',              'Trader Joe''s',             'Food',            -52.30,  'chk')
)
insert into transactions (account_id, occurred_at, description, merchant, category, amount, status)
select
  case acct when 'chk' then (select id from chk) else (select id from crd) end,
  (current_date - (day_offset || ' days')::interval) + (hour || ' hours')::interval,
  description, merchant, category::transaction_category, amount, 'completed'::transaction_status
from raw_tx;

-- Budget limits are calibrated with headroom above the seeded spend so the
-- dashboard starts in a healthy state (see simulate-activity's calibration
-- notes for why this matters on a long-lived deployment).
insert into budgets (category, monthly_limit, period) values
  ('Housing', 1900, date_trunc('month', now())::date),
  ('Food', 850, date_trunc('month', now())::date),
  ('Transportation', 500, date_trunc('month', now())::date),
  ('Healthcare', 320, date_trunc('month', now())::date),
  ('Debt payments', 550, date_trunc('month', now())::date),
  ('Investments', 850, date_trunc('month', now())::date),
  ('Other', 600, date_trunc('month', now())::date);

insert into goals (name, icon, target_amount, current_amount, term, target_date) values
  ('Emergency reserve', 'shield', 10000, 7000, 'short', current_date + interval '4 months'),
  ('Trip to Japan', 'plane', 4000, 2500, 'short', current_date + interval '3 months'),
  ('New car', 'car', 20000, 1600, 'long', current_date + interval '3 years'),
  ('Down payment', 'home', 70000, 8300, 'long', current_date + interval '5 years');

update accounts a
set balance = 4200 + coalesce((
  select sum(t.amount) from transactions t where t.account_id = a.id
), 0)
where a.name = 'Everyday Checking';

update accounts a
set balance = -coalesce((
  select sum(t.amount) from transactions t where t.account_id = a.id
), 0)
where a.name = 'Rewards Credit Card';
