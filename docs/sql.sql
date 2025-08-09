create extension if not exists pgcrypto;
create extension if not exists uuid-ossp;

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  country text,
  city text,
  payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  user_id text primary key,
  status text not null check (status in ('active','trialing','past_due','canceled','paused')),
  plan text not null,
  interval text not null check (interval in ('month','quarter','semiannual','year')),
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

alter table plans enable row level security;
alter table subscriptions enable row level security;

drop policy if exists "deny all plans" on plans;
create policy "deny all plans" on plans for all using (false) with check (false);

drop policy if exists "deny all subscriptions" on subscriptions;
create policy "deny all subscriptions" on subscriptions for all using (false) with check (false);
