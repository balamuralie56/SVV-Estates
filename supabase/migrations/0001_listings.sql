-- SVV Estates: listings data layer
-- Run this in the Supabase SQL editor (or via `supabase db push`) against the
-- project referenced by NEXT_PUBLIC_SUPABASE_URL. Safe to re-run: every
-- statement is guarded with IF NOT EXISTS / CREATE OR REPLACE.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ta text not null,
  description_en text not null default '',
  description_ta text not null default '',
  location_en text not null,
  location_ta text not null,
  map_url text,

  -- Canonical unit is sqft. Cents/acres are derived for display only
  -- (1 cent = 435.6 sqft, 1 acre = 43560 sqft) -- do not store duplicate units.
  plot_size_sqft numeric,

  price_per_sqft numeric,
  price_total numeric,
  price_on_request boolean not null default true,

  status text not null default 'available'
    check (status in ('available', 'booked', 'sold')),

  -- Nullable on purpose: patta/EC documents are not collected yet and will
  -- be added later without a schema change.
  patta_status text,
  ec_status text,

  notes text,

  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_published_idx on public.listings (published);
create index if not exists listings_slug_idx on public.listings (slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- listing_media
-- ---------------------------------------------------------------------------
create table if not exists public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  kind text not null check (kind in ('photo', 'video')),
  source text not null check (source in ('owner_provided', 'street_view')),
  url text not null,
  caption_en text,
  caption_ta text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists listing_media_listing_id_idx on public.listing_media (listing_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.listings enable row level security;
alter table public.listing_media enable row level security;

drop policy if exists "public read published listings" on public.listings;
create policy "public read published listings"
  on public.listings for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admin full access to listings" on public.listings;
create policy "admin full access to listings"
  on public.listings for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "public read media of published listings" on public.listing_media;
create policy "public read media of published listings"
  on public.listing_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_media.listing_id
        and l.published = true
    )
  );

drop policy if exists "admin full access to listing media" on public.listing_media;
create policy "admin full access to listing media"
  on public.listing_media for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for owner-provided photos/videos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('listing-media', 'listing-media', true)
on conflict (id) do nothing;

drop policy if exists "public read listing-media bucket" on storage.objects;
create policy "public read listing-media bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'listing-media');

drop policy if exists "admin write listing-media bucket" on storage.objects;
create policy "admin write listing-media bucket"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'listing-media')
  with check (bucket_id = 'listing-media');

-- ---------------------------------------------------------------------------
-- Admin users: create via Supabase Auth (Dashboard -> Authentication -> Add
-- user, or `supabase auth users create`). Any authenticated user can write
-- to listings/listing_media/storage above -- only create accounts for
-- trusted admins. There is deliberately no public sign-up flow in the app.
-- ---------------------------------------------------------------------------
