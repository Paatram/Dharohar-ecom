# Dharohar Ecommerce

Premium, DLP-themed commerce storefront for Dharohar's copper, peetal and kansa collection.

The current milestone is an accuracy-gated catalog preview: 34 supplied SKUs and 216 launch units are browsable, while checkout remains intentionally disabled until product, tax, fulfilment and policy data is verified. The intended production commerce core is Medusa + PostgreSQL with Razorpay and Shiprocket integrations.

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

`npm run check` runs lint, strict TypeScript, a production build, catalog invariants and server-rendered route tests.

## Architecture records

- [Architecture](docs/ARCHITECTURE.md)
- [Execution sequence](docs/EXECUTION_SEQUENCE.md)
- [Risk register](docs/RISK_REGISTER.md)

## Asset status

Images under `public/images/dharohar` are sourced from the existing DLP project, except the clearly conceptual social-sharing tableau. Reused images are development references and must be replaced or explicitly approved against each exact product before commerce activation.

## Environment policy

- Never expose Medusa admin, Razorpay secret, webhook secret, Shiprocket credentials or database URLs through `NEXT_PUBLIC_*` variables.
- `.env*` files are ignored by git.
- Production `NEXT_PUBLIC_SITE_URL` must be the final canonical HTTPS origin.
