-- Mood Tracker — Supabase setup
-- =============================================================================
-- Run this ONCE in the Supabase project you want to use (the same project
-- kitchenMagic uses is fine — Mood keeps its own tables and won't touch the
-- recipe tables):  Dashboard → SQL Editor → New query → paste all of this → Run.
--
-- DESIGN NOTE (intentional): Mood has NO login. It is a single shared dataset
-- so the same entries show up on every device. The policies below therefore
-- grant the public (anon) role full access. This is deliberate for a personal
-- single-user tracker — it is NOT per-account isolation, and anyone with the
-- app's public anon key could read this data.
-- =============================================================================

-- 1) One row per day -----------------------------------------------------------
create table if not exists public.mood_days (
  date        text primary key,          -- 'YYYY-MM-DD' (local date)
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.mood_days enable row level security;

drop policy if exists "public read mood_days"   on public.mood_days;
drop policy if exists "public write mood_days"  on public.mood_days;
drop policy if exists "public update mood_days" on public.mood_days;
drop policy if exists "public delete mood_days" on public.mood_days;

create policy "public read mood_days"   on public.mood_days for select using (true);
create policy "public write mood_days"  on public.mood_days for insert with check (true);
create policy "public update mood_days" on public.mood_days for update using (true) with check (true);
create policy "public delete mood_days" on public.mood_days for delete using (true);

-- 2) App settings (e.g. the editable "Mood overall" option list) ---------------
create table if not exists public.mood_settings (
  key         text primary key,
  value       jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.mood_settings enable row level security;

drop policy if exists "public read mood_settings"   on public.mood_settings;
drop policy if exists "public write mood_settings"  on public.mood_settings;
drop policy if exists "public update mood_settings" on public.mood_settings;

create policy "public read mood_settings"   on public.mood_settings for select using (true);
create policy "public write mood_settings"  on public.mood_settings for insert with check (true);
create policy "public update mood_settings" on public.mood_settings for update using (true) with check (true);

-- 3) Enable realtime so edits on one device show up live on the others ---------
alter publication supabase_realtime add table public.mood_days;
alter publication supabase_realtime add table public.mood_settings;
