# SVV Estates project status

Last verified: 2026-10-13

## Verified architecture

- Next.js `16.2.10` App Router with React `19.2.4`, TypeScript, Tailwind CSS 4, Lucide icons, and the React Compiler.
- Source is organized under `src/app`, `src/components`, `src/data`, and `src/lib`.
- Public routes are `/`, `/about`, `/projects`, `/projects/[id]`, `/book-visit`, `/landing/[campaign]`, `/privacy`, and `/terms`.
- `src/data/listings.ts` is the public listing source. It is typed and currently contains no published listings.
- Public case-study structure exists in `src/data/case-studies.ts` and currently contains no records because no reviewed material was supplied.
- `src/lib/supabase.ts` is a browser localStorage mock, not a Supabase client. It remains only as prototype code for future backend work.
- There are no API routes, server actions, middleware authorization checks, database migrations, authentication, or test files.
- `next.config.ts` uses `output: 'export'` and unoptimized images for static hosting. The generated deployment directory is `out/`.
- `/projects/[id]` generates the real published listing paths and a truthful empty-catalogue path when no listing exists. `/landing/[campaign]` currently generates the approved `property-enquiry` campaign path; new campaign slugs require a source update and rebuild.

## Static-first changes verified

- Removed the root `next/font/google` dependency and replaced it with a system font stack, so builds do not depend on fetching Google Fonts.
- Public pages no longer read projects, leads, bookings, or enquiries from browser localStorage.
- Property and site-visit actions open direct phone or WhatsApp conversations with clear wording that opening WhatsApp does not confirm delivery, storage, or an appointment.
- The public catalogue and project detail page show a professional empty state when no published listing exists.
- The public navbar no longer exposes admin tools.
- The unauthenticated admin/localStorage prototype is disabled by the static admin layout. Its source remains for a later authenticated backend task, but the generated admin routes display an offline notice.
- Added truthful metadata, canonical configuration, Open Graph/Twitter metadata, static sitemap, robots rules, privacy page, terms page, and content-update guidance.
- No property, price, approval, amenity, photograph, sales figure, testimonial, notification, or customer record was invented or published.

## Verified problems and severity

### Critical for a shared management system

- The retained admin prototype has no authentication or authorization and its data layer is browser-localStorage. It is not suitable for customer, seller, lead, or property records.
- There is no shared persistence, server validation, notification delivery, audit trail, backup process, or role-based access control.

### High before publishing real inventory

- The public catalogue is intentionally empty until confirmed listing details and approved real photographs are supplied.
- Enquiry and site-visit actions are handoff links to phone or WhatsApp. They do not save leads, reserve times, or confirm visits.
- Public verification status, pricing, availability, documents, and photographs still require a documented review process before publication.
- The static export only includes campaign slugs listed in `src/app/landing/[campaign]/page.tsx`.

### Medium

- The old prototype files still contain mock CRM, booking, CMS, and notification code, although the production customer journey does not expose those screens as working tools.
- There is no automated test suite or browser-level regression coverage.
- The deployment host must serve the contents of `out/` as static files and support client-side asset paths.

## Existing functionality worth preserving

- SVV Estates logo assets, charcoal/gold visual identity, responsive layout, light/dark mode, and English/Tamil translation structure.
- Public home, about, projects, project-detail, site-visit, privacy, terms, and campaign page foundations.
- EMI calculator and interactive plot-grid UI components.
- Direct phone and WhatsApp enquiry paths.
- Prototype admin lead pipeline, property controls, and land-acquisition screens as future design references only.

## Validation results

Commands run from the project root on 2026-10-13:

- `npx tsc --noEmit` — passed.
- `npm run lint` — passed with no reported errors or warnings.
- `npm run build` — passed. Next generated the static export and reported 18 static pages/routes, including legal pages, sitemap, robots, the empty listing path, and the approved campaign path.
- Generated output inspection — passed. `out/` contains `index.html`, public route HTML files, `_next/` assets, `robots.txt`, `sitemap.xml`, logo assets, and the static empty-catalogue route.
- No test script or test files were found.

## Recommended implementation order

1. Confirm public business contact details and supply the first verified listings and approved photographs.
2. Publish only confirmed listing records through `src/data/listings.ts`, then rebuild and inspect the generated pages.
3. Validate contact links and the manual phone/WhatsApp handling process with the father before launch.
4. After demand is validated, choose a low-cost backend and implement authentication, server-side validation, RLS/authorization, shared listings, and a genuine enquiry workflow in a separately approved task.
5. Add reviewed experience and anonymised historical case studies only after permission and privacy review.
6. Add automated and browser-level tests before expanding the professional network or adding payments/subscriptions.

## Unresolved business decisions

- Which verified listings, prices, availability, locations, photos, documents, and contact details are approved for launch?
- Which verification labels and public document policy have been reviewed by the business and an appropriate professional?
- Which notification and follow-up process will be used before a backend exists?
- Which backend, hosting provider, free-tier limits, administrator, and access roles are acceptable within the approximately ₹1,000 monthly budget?
- Which historical projects may be described publicly after permission and privacy review?
- Which campaign slugs should be generated for future landing pages?

## Manual steps before deployment

- Review the privacy and terms wording with an appropriate professional before treating it as final legal policy.
- Confirm the production domain, HTTPS, static-host configuration, and SPA/asset handling with the chosen host.
- Add only confirmed details and approved actual photographs to `src/data/listings.ts` and `public/`, following `CONTENT_UPDATES.md`.
- Test phone and WhatsApp links on the actual target devices. Confirm that the recipient understands that the website does not record or confirm the enquiry.
- Keep the current admin paths unavailable or protected at the hosting layer until an approved authentication and backend implementation exists.

## Current deployment conclusion

The website is technically deployable as a static-first site with no published listings. It is not yet a live property catalogue, shared CRM, authenticated management system, or confirmed booking system. Real inventory, contact-process testing, legal review, and hosting verification remain before public launch.
