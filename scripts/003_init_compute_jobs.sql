-- Create compute_jobs table with public read and service-role writes.
create extension if not exists pgcrypto;

create table if not exists public.compute_jobs (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null,
  job_name text not null,
  params jsonb not null default '{}'::jsonb,
  status text not null default 'queued', -- queued | running | succeeded | failed | canceled
  result_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FK to datasets if it exists
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'datasets'
  ) then
    alter table public.compute_jobs
      add constraint compute_jobs_dataset_fk
      foreign key (dataset_id) references public.datasets(id) on delete cascade;
  end if;
exception
  when duplicate_object then null;
end $$;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
begin
  create trigger trg_compute_jobs_updated
    before update on public.compute_jobs
    for each row execute procedure public.set_updated_at();
exception
  when duplicate_object then null;
end $$;

alter table public.compute_jobs enable row level security;

do $$
begin
  create policy "Public read compute_jobs"
    on public.compute_jobs
    for select
    using (true);
exception
  when duplicate_object then null;
end $$;
