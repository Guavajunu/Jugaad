# Jugaad Advisory website

Multi-page, search-engine-friendly website. Every page is a real HTML file generated at build time, so all content is in the initial HTML without JavaScript. JavaScript is used only for the mobile menu toggle and contact form validation.

## Routes
/ · /about · /approach · /practice-areas · /practice-areas/{business, creative, production, legal-resolution, realty, connect-industry, earth-agriculture} · /international-connect · /insights · /contact · /privacy-policy · /terms (+ 404 page)

## Structure
- `src/config.ts` contact details, email switch, social links, analytics token, form endpoint (edit here only)
- `src/content.ts` the seven practice areas
- `src/pages.ts` page content templates (approved wording)
- `src/routes.ts` URLs, titles, meta descriptions
- `src/layout.ts` header, footer, SEO tags, structured data
- `src/build.ts` generates `dist/` (pages, sitemap.xml, robots.txt, _headers, 404)
- `public/` CSS, JS, images, favicon, og-image
- `tests/verify.mjs` full verification suite
- `wrangler.jsonc` Cloudflare deployment config
- `dist/` the built site, committed so Cloudflare can deploy without a build step

## Commands
    npm install        # once
    npm run build      # regenerates dist/
    npm run typecheck
    npm test           # builds nothing; tests dist/ (needs Playwright's Chromium)

## Deploy (Cloudflare)
The project in Cloudflare is a Worker named `jugaad`. `wrangler.jsonc` points it at `dist/` with clean URLs and a 404 page. Deploy command: `npx wrangler deploy`. Build command: none required (dist is committed), or `npm install && npm run build`.

## Before launch
- Confirm inquiry@jugaadadvisory.com receives mail (else set `publicEmailLive: false`)
- Have Privacy Policy and Terms reviewed by a professional
- Replace dashed image slots with real photographs; consider a professional founder photo
- Add social links to `CFG.social` when supplied; connect a form service via `CFG.formEndpoint` if wanted
- Trigger preview deployment
