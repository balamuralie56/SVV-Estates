-- SVV Estates: leads capture
-- Run this in the Supabase SQL editor after 0001_listings.sql.
-- Safe to re-run: every statement is guarded.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  phone text not null,
  email text,

  -- Where the enquiry came from and what it was about.
  source text not null default 'book_visit'
    check (source in ('book_visit', 'listing_enquiry', 'general')),
  listing_slug text,
  listing_title text,

  -- Free-text snapshot of what they asked for (preferred date/time,
  -- pickup details, etc). Not shown publicly, admin-only.
  message text,

  -- Explicit opt-in captured at the moment of enquiry. Only leads with
  -- this set to true should ever receive a follow-up/marketing message.
  marketing_opt_in boolean not null default false,

  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),

  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- Visitors can submit a lead, but can never read leads back (write-only
-- from the public side -- this is deliberate, not an oversight).
drop policy if exists "public can submit leads" on public.leads;
create policy "public can submit leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admin full access to leads" on public.leads;
create policy "admin full access to leads"
  on public.leads for all
  to authenticated
  using (true)
  with check (true);
