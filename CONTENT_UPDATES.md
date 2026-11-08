# Updating public property content

Listings now live in Supabase (`listings` + `listing_media` tables), not in a
source file. The schema is defined in
[`supabase/migrations/0001_listings.sql`](supabase/migrations/0001_listings.sql).

## Adding or changing a listing

1. Sign in at `/admin` with an admin account (created in the Supabase
   dashboard under Authentication → Users — there is no public sign-up).
2. Use "Add listing" / the edit (pencil) button to set the title, location
   (general area only — no exact address or GPS coordinates, by design),
   plot size in sqft, price, status, and the optional `patta_status` /
   `ec_status` fields. Leave `patta_status` / `ec_status` blank until that
   information is actually confirmed — they're nullable specifically so they
   can be added later without a schema change.
3. Use the "Media" button on a listing to upload owner-provided photos or
   videos. These are stored in the `listing-media` Supabase Storage bucket
   and marked `source = owner_provided`.
4. Leave "Published" unchecked until the listing is ready for public
   viewing. Only published listings are visible to anonymous visitors
   (enforced by Row Level Security, not just the UI).

## Photo/video policy (owner-provided vs. Street View)

- A listing with owner-provided media shows that media as the primary
  image(s)/video(s) on the public site.
- A listing with **no** owner-provided media falls back to a Google Street
  View static image of its general locality, labeled in both languages as
  "Area reference (Google Street View)" / "பகுதி குறிப்பு (Google Street
  View)" — so it is never mistaken for an actual photograph of the plot.
- The Street View fallback requires `NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY` in
  `.env.local`. Without it, listings with no uploaded media simply show no
  image rather than a broken request.
- Once owner-provided photos/videos exist for a listing, Street View is no
  longer shown for that listing at all (owner-provided media takes over as
  primary; see `src/lib/listings.ts`).

## Internal-only fields

Do not put seller records, customer information, deeds, signatures, raw FMB
sketches, or other internal notes into the public-facing fields. The
`notes` field on a listing is for the admin's own reference; it is not
rendered on the public site, but it is not encrypted either — do not use it
for sensitive data.

Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` before
deployment, same as before.
