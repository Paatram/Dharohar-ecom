# Dharohar Ecommerce

Premium, DLP-themed commerce storefront for Dharohar's copper, peetal and kansa collection.

The current milestone is an accuracy-gated commerce experience: 34 supplied SKUs and 216 launch units are browsable with predictive search, filters, wishlist, comparison, selection bag, gifting, trade briefs, account/tracking readiness, product education and technical SEO. Checkout remains intentionally disabled until product, tax, fulfilment and policy data is verified. The intended production commerce core is Medusa + PostgreSQL with Razorpay and Shiprocket integrations.

## Implemented customer journeys

- Hover-driven desktop mega-navigation and a clickable mobile drawer
- Category, subcategory, material, use, price and audience discovery
- Typo-tolerant predictive search and dedicated search results
- Device-persistent wishlist, product comparison and selection bag
- Enriched product pages with delivery-readiness checks, honest pending-data labels, care, related objects and curated ritual bundles
- Gifting by occasion and budget, with presentation/personalisation readiness
- Structured trade briefs for hospitality, restaurants, offices, designers and gifting
- Account, order tracking, returns and checkout readiness surfaces
- Material/care journal, FAQ structured data, breadcrumbs, sitemap and product structured data without unverified offers or reviews

Browser persistence is for non-authoritative discovery state only. Price, stock, tax, payment and order state remain server-owned in the production architecture.

## Requirements

- Node.js `>=22.13.0`
- npm

## Local development

```bash
npm install
npm run dev
```

Set the canonical public origin when testing production SEO output:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

## Verification

```bash
npm run check
npm audit --omit=dev
```

## Deployment targets

- OpenAI Sites/Cloudflare uses `npm run build` and the native Worker output in `dist/`.
- Vercel uses the committed `vercel.json` build override and Nitro’s Vercel Build Output API bundle in `.vercel/output/`.
- Node is pinned to the Vercel-supported `22.x` major for reproducible builds.

To reproduce the Vercel compilation locally, run `npm run build:vercel`.

`npm run check` runs lint, strict TypeScript, a production build, catalog invariants and server-rendered route tests.

## Architecture records

- [Architecture](docs/ARCHITECTURE.md)
- [Execution sequence](docs/EXECUTION_SEQUENCE.md)
- [Risk register](docs/RISK_REGISTER.md)
- [Commerce feature status and activation gates](docs/FEATURE_STATUS.md)

## Asset status

Images under `public/images/dharohar` are sourced from the existing DLP project, except the clearly conceptual social-sharing tableau. Reused images are development references and must be replaced or explicitly approved against each exact product before commerce activation.

## Environment policy

- Never expose Medusa admin, Razorpay secret, webhook secret, Shiprocket credentials or database URLs through `NEXT_PUBLIC_*` variables.
- `.env*` files are ignored by git.
- Production `NEXT_PUBLIC_SITE_URL` must be the final canonical HTTPS origin.
