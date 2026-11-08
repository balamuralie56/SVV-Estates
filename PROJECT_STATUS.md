# SVV Estates project status

Last verified: 2026-11-08

## Verified architecture

- Next.js `16.2.10` App Router with React `19.2.4`, TypeScript, Tailwind CSS 4, Lucide icons, and the React Compiler.
- Source is organized under `src/app`, `src/components`, `src/data`, and `src/lib`.
- Public routes are `/`, `/about`, `/projects`, `/projects/listing?slug=...`, `/book-visit`, `/landing/[campaign]`, `/privacy`, and `/terms`.
- `/admin` is now a real, Supabase-Auth-gated listings admin (see below) — it is no longer the disabled static placeholder.
- `next.config.ts` still uses `output: 'export'` and unoptimized images for static hosting. The generated deployment directory is `out/`.

## Data layer: Supabase (real client, no custom backend)

- `src/lib/supabase.ts` is now a real `@supabase/supabase-js` client (the old localStorage mock is gone). It reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.local`; both are currently set.
- Schema: `supabase/migrations/0001_listings.sql` defines `public.listings`, `public.listing_media`, Row Level Security policies (public read of published listings only; full read/write for authenticated users), and the `listing-media` Storage bucket.
  - **This migration has not been applied to the live Supabase project yet** — this sandbox has no outbound network access, so it could not run the SQL. Apply it via the Supabase SQL editor or `supabase db push` before anything in the admin panel or on the public site will show real data.
  - `listings` fields match the brief: title (en/ta), general locality/area (en/ta, no exact address or GPS — deliberate), `plot_size_sqft` (canonical unit; cents/acres are derived for display in `src/lib/units.ts`), `price_per_sqft`, `price_total`, `price_on_request`, `status` (available/booked/sold), nullable `patta_status` / `ec_status` (intentionally empty until that work is done, no future migration needed to start filling them in), and an admin-only `notes` field.
  - `listing_media` supports multiple photos/videos per listing with a `source` of `owner_provided` or `street_view`.
- Media policy (implemented in `src/lib/listings.ts`): a listing with owner-provided media shows that media as primary. A listing with none falls back to a Google Street View static image of its general locality, labeled in both languages as an area reference — never presented as an actual property photo. The fallback requires `NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY`, **which is not currently set** — until it is, listings without uploaded media show no image (not a broken request).
- All data access is client-side through the Supabase client with RLS; there are no custom API routes, consistent with the "no separate backend" requirement.

## Admin panel (listings only)

- `/admin` requires Supabase Auth sign-in (email/password). Admin accounts must be created directly in the Supabase dashboard (Authentication → Users) — **no admin account exists yet**, so no one can sign in until one is created there.
- Once signed in: add/edit/delete listings, toggle status and published state, and upload/remove owner-provided photos/videos per listing (stored in the `listing-media` Storage bucket).
- The previous localStorage-based CRM prototype (leads, bookings, land acquisition, CMS screens) has been deleted. It was already unreachable behind the old disabled admin layout, and it depended entirely on the mock `db` API that `src/lib/supabase.ts` no longer provides. No ad-campaign / Meta / Google / Instagram admin functionality was built — that remains explicitly out of scope for this task.

## Static-export tradeoff: listing detail routing

- `output: 'export'` requires every dynamic App Router segment to be fully resolved at build time. A per-listing dynamic route (`/projects/[slug]`) would mean a rebuild every time a listing is added or edited in the admin panel — defeating the point of a live database.
- Instead, listing detail is a **static** route, `/projects/listing`, that reads the slug from a query string (`?slug=...`) and fetches that listing client-side at runtime. This keeps `output: 'export'` unchanged and listings fully live (no rebuild needed to add/edit a listing), at the cost of a less conventional URL shape than `/projects/<slug>`. All internal links (home, projects grid, book-visit, sitemap) were updated to this shape.
- `sitemap.xml` still fetches listings at build time (same as the rest of the static export), so it reflects published listings as of the last deploy, not live.

## Visual redesign

- Added a lightweight, pure-CSS 3D hero element (`src/components/HeroScene.tsx` — layered cards with `perspective`/`rotateX`/`translateZ`, no canvas/WebGL) and a subtle pointer-based 3D tilt on listing cards (`src/components/TiltCard.tsx`, mouse/trackpad only — skipped on touch via `pointer: coarse`).
- Deliberately CSS-only rather than Three.js, to keep the bundle light for mobile visitors on average Indian mobile connections, per the brief.
- English/Tamil toggle and light/dark mode are unchanged and still work (verified in-browser).

## Verified problems and severity

### Must do before this is usable

- Apply `supabase/migrations/0001_listings.sql` to the live Supabase project.
- Create at least one admin user in Supabase Auth.
- Decide on and set `NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY` (or accept no-image placeholders until then).
- Add the first real, reviewed listing through `/admin` — the public catalogue is intentionally empty until then.

### High before publishing real inventory

- Public verification status, pricing, availability, documents, and photographs still require a documented review process before publication, same as before.
- Enquiry and site-visit actions remain phone/WhatsApp handoff links; they do not save leads or confirm appointments.
- The static export only includes campaign slugs listed in `src/app/landing/[campaign]/page.tsx`.

### Medium

- No automated test suite or browser-level regression coverage.
- This sandbox had no outbound network access, so the Supabase connection, the admin login flow, and the live listing fetch could only be verified to fail gracefully (clear console errors, correct empty/loading states) — not verified end-to-end against the real project. Re-verify once the migration and an admin user exist.
- `npm audit` currently reports pre-existing vulnerabilities in `create-next-app`'s base dependency tree (unrelated to this task's changes); not addressed here.

## Validation results

Commands run from the project root on 2026-11-08:

- `npx tsc --noEmit` — passed.
- `npm run lint` — passed with no errors or warnings.
- `npm run build` — passed. Generated the static export; the build-time listings fetch for `sitemap.xml` failed gracefully (no network in this sandbox) and fell back to zero listing URLs, same behavior it will have before the first listing is published.
- Manually exercised in-browser (`next dev`, since Supabase can't be reached from this sandbox): home page with 3D hero, Tamil toggle, dark mode toggle, mobile viewport on `/projects`, and the `/admin` login screen — all rendered correctly; the "no listings" and "not signed in" paths both resolved to the correct UI rather than crashing.

## Recommended implementation order

1. Apply the Supabase migration and create an admin user.
2. Add the first verified listing (and its real photos) through `/admin`; confirm it shows correctly on `/`, `/projects`, and `/projects/listing?slug=...`.
3. Decide on the Street View API key, or accept the no-image placeholder in the meantime.
4. Validate contact links and the manual phone/WhatsApp handling process with the father before launch.
5. Add reviewed experience and anonymised historical case studies only after permission and privacy review.
6. Add automated and browser-level tests before expanding further.

## Unresolved business decisions

- Which verified listings, prices, availability, locations, photos, documents, and contact details are approved for launch?
- Which verification labels and public document policy have been reviewed by the business and an appropriate professional?
- Who are the trusted admin users, and who creates/rotates their Supabase Auth credentials?
- Is a Google Maps Street View Static API key approved for use (billing implications), or should listings without owner photos show no image instead?
- Which historical projects may be described publicly after permission and privacy review?
- Which campaign slugs should be generated for future landing pages?

## Manual steps before deployment

- Run `supabase/migrations/0001_listings.sql` against the production Supabase project.
- Create admin user(s) in Supabase Auth; do not reuse personal passwords.
- Confirm the production domain, HTTPS, static-host configuration, and SPA/asset handling with the chosen host.
- Test phone and WhatsApp links on the actual target devices.
- Review the privacy and terms wording with an appropriate professional before treating it as final legal policy.

## Current deployment conclusion

The website is technically deployable as a static-first site backed by a real Supabase data layer with RLS, but it is not yet live-ready: the SQL migration has not been applied to the production project, no admin account exists, and no real listings have been entered. Once those three things are done, the admin panel becomes the live way to manage listings without a rebuild for every edit (only a redeploy is skipped — the static shell itself is unaffected).
