-- initial schema for datasets with RLS
create extension if not exists "pgcrypto";

create table if not exists public.datasets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  blob_url text not null,
  content_type text,
  size bigint,
  owner_email text,
  created_at timestamptz not null default now()
);

alter table public.datasets enable row level security;

-- Public read access (marketplace-like visibility). Writes happen via server with service role.
drop policy if exists "datasets_public_read" on public.datasets;
create policy "datasets_public_read"
  on public.datasets
  for select
  to anon
  using (true);
