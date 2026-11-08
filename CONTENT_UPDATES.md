# Updating public property content

Public listings are stored in [`src/data/listings.ts`](src/data/listings.ts). They are version-controlled and included in the static website build.

Before adding or changing a listing:

1. Confirm the property identity, location, type, public description, availability, price, dimensions, photographs, and enquiry details with the business.
2. Record only information approved for public display. Keep seller records, customer information, deeds, signatures, raw FMB sketches, and internal notes out of public files.
3. Mark approvals as `seller_provided`, `under_review`, or `verified` according to the evidence actually reviewed. Do not use `verified` without documented confirmation.
4. Add photographs under `public/` only when they are actual property photographs approved for publication. Do not use generated or generic images as property photographs.
5. Set `published: true` only after the listing is ready for public viewing. Set `lastAvailabilityConfirmed` to the confirmation date.
6. Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` before deployment.
7. Review the generated page and send a new deployment. Static content changes become public only after the new deployment succeeds.

The initial repository contains no published listings because verified Punnampattu details, prices, photographs, and availability have not yet been supplied.
