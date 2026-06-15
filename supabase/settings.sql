-- Home-page CMS settings + media storage bucket. Run in Supabase → SQL Editor.

-- Single-row settings table (id is always 1).
create table if not exists public.site_settings (
  id         int primary key default 1,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

insert into public.site_settings (id, data) values (1, '{}') on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Anyone can read settings (needed to render the home page); writes go through
-- the service-role key on the server, which bypasses RLS.
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);

-- Public storage bucket for hero/banner images & videos.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
