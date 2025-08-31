-- create DAO (group) tables with public read and server-side write model
create extension if not exists "pgcrypto";

create table if not exists public.daos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.dao_members (
  dao_id uuid not null references public.daos(id) on delete cascade,
  member_email text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  primary key (dao_id, member_email)
);

-- Link table between DAOs and datasets
create table if not exists public.dao_datasets (
  dao_id uuid not null references public.daos(id) on delete cascade,
  dataset_id uuid not null references public.datasets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (dao_id, dataset_id)
);

-- Enable RLS and public read where appropriate
alter table public.daos enable row level security;
alter table public.dao_members enable row level security;
alter table public.dao_datasets enable row level security;

drop policy if exists "daos_public_read" on public.daos;
create policy "daos_public_read" on public.daos for select to anon using (true);

drop policy if exists "dao_members_public_read" on public.dao_members;
create policy "dao_members_public_read" on public.dao_members for select to anon using (true);

drop policy if exists "dao_datasets_public_read" on public.dao_datasets;
create policy "dao_datasets_public_read" on public.dao_datasets for select to anon using (true);

-- Writes will be performed by server-side using service role; no public write policies needed for now.
