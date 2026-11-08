<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## SVV Estates project conventions

- Preserve the existing Next.js App Router, TypeScript, Tailwind CSS, branding, responsive behaviour, and English/Tamil support unless a change is necessary for the approved task.
- Do not invent listings, prices, approvals, amenities, testimonials, reviews, sales figures, legal clearances, or property photographs. Use only information supplied or verified by the business.
- Treat customer, seller, unpublished listing, and internal CRM data as sensitive. Do not expose secrets or private records in reports, logs, commits, or client bundles.
- Do not treat client-side state or localStorage as secure persistence or authorization. Any production data mutation must be validated and authorized on the server.
- Do not claim that an email, WhatsApp message, webhook, reminder, or automation was sent unless the integration actually ran successfully.
- Work incrementally. Inspect the current implementation, make the smallest coherent change for the approved scope, and preserve unrelated user work.
- Before implementation, read the relevant Next.js documentation under `node_modules/next/dist/docs/` and follow current APIs and deprecation guidance.
- After implementation, run targeted checks followed by type-checking, lint, and build where feasible. Report the actual results.
