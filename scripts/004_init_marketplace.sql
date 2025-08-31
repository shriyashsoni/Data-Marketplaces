-- create marketplace_offers with RLS (public read), used for listing and stub checkout
create extension if not exists pgcrypto;

create table if not exists public.marketplace_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  dataset_id uuid, -- optional: link to a dataset
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- optional FK if datasets exists
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'datasets'
  ) then
    alter table public.marketplace_offers
      add constraint marketplace_offers_dataset_fk
      foreign key (dataset_id) references public.datasets(id) on delete set null;
  end if;
exception when duplicate_object then null;
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
  create trigger trg_marketplace_offers_updated
    before update on public.marketplace_offers
    for each row execute procedure public.set_updated_at();
exception when duplicate_object then null;
end $$;

alter table public.marketplace_offers enable row level security;

-- public read
do $$
begin
  create policy "Public read marketplace_offers"
    on public.marketplace_offers
    for select using (true);
exception when duplicate_object then null;
end $$;
