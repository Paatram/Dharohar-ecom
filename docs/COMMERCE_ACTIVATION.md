# Dharohar commerce activation runbook

The storefront and commerce workflows fail closed. Catalogue visibility does not mean a SKU can be purchased.

## 1. Product evidence

For every SKU, operations must submit exact product images, composition, dimensions/capacity, packed weight and package dimensions, HSN/GST treatment, price tax treatment, care instructions, heat-source compatibility, return policy and dispatch SLA through the authenticated product-verification endpoint. The endpoint activates the SKU and writes an audit event only when every field validates.

Do not copy specifications from visually similar web products. Supplier evidence and a physical packing check are required.

## 2. Legal and customer-service approval

Replace the pre-launch policy notices with business-approved seller identity, grievance details, retention periods, terms, cancellation rules, return windows, warranty, refund timing and B2B/personalisation provisions. Verify that the published product-level return and dispatch text agrees with these policies.

## 3. Provider configuration

Set secrets only in the hosting platform. Configure Razorpay order creation and the raw-body webhook at `/api/webhooks/razorpay`. Configure Shiprocket credentials, pickup pincode and the exact pickup-location label. Leave `NOTIFICATION_PROVIDER` unset until a monitored email/SMS/WhatsApp adapter and suppression workflow exists.

Vercel builds the storefront but has no Cloudflare D1 binding; its commerce APIs therefore return a controlled `database_unavailable` response. The Sites deployment is the managed D1 commerce runtime unless the data layer is deliberately migrated to another production database.

## 4. Verification matrix

- Run `npm run check` and `npm run build:vercel`.
- Run `npm run db:migrate:local` before local commerce-flow testing; production migrations are applied from `drizzle/` by the hosting workflow.
- Apply and inspect every migration in `drizzle/`; confirm the inventory reservation triggers exist.
- Test two simultaneous attempts for the final unit of a SKU; only one reservation may succeed.
- Test webhook retries, duplicate payment events, wrong signatures, wrong amounts and payment arriving after reservation expiry.
- Test serviceable and unserviceable pincodes, measured package shipment creation, AWB assignment and tracking refresh.
- Test authenticated ownership on account, addresses, wishlist, returns and reviews; test non-admin denial on operations endpoints.
- Test payment failure, abandoned checkout, full and partial refunds, return pickup and inventory disposition using provider test modes.
- Run keyboard, screen-reader, reduced-motion, mobile Safari/Chrome, desktop Safari/Chrome/Firefox, performance and structured-data checks.

## 5. Public release gate

Keep the site private and the products in `verification_required` until the entire matrix has evidence. Public access and real provider credentials are separate, explicit release decisions.
