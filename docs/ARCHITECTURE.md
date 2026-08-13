# Dharohar ecommerce architecture

## Decided stack

- Storefront: server-rendered React app using the Next.js-compatible `vinext` runtime on Cloudflare Sites.
- Commerce core: Medusa with PostgreSQL, deployed independently from the storefront.
- Payments: Razorpay Orders API and server-verified webhooks.
- Shipping: Shiprocket serviceability, shipment, label and tracking APIs.
- Product media: object storage/CDN; current DLP assets are development references, not exact-SKU proof.
- Mobile: responsive PWA first. A later React Native app can reuse the same commerce API, catalog identifiers and order model.

## Boundary rule

The storefront is not the source of truth for payments, stock or order status. Medusa/PostgreSQL owns commercial state. Browser code may display a quotation from the commerce API but must never calculate an authoritative payment amount or mark an order paid.

## Order state sequence

1. Customer selects a verified variant and quantity.
2. Commerce API reserves or rechecks inventory and creates a cart.
3. Server calculates discounts, GST, shipping and payable total.
4. Server creates a Razorpay order using that total and an idempotency key.
5. Customer completes the hosted payment flow.
6. Server verifies the payment signature; webhook processing independently confirms final payment state.
7. A paid order triggers stock commitment, invoice generation and Shiprocket fulfilment creation.
8. Carrier webhooks update shipment milestones; customer notifications are derived from recorded state transitions.
9. Cancellation, return, replacement and refund remain explicit workflows with an append-only audit trail.

## Failure and security requirements

- All write APIs require schema validation, rate limits and authenticated server-to-server credentials.
- Razorpay and Shiprocket webhooks require raw-body signature verification, event deduplication and replay-safe handlers.
- Cart/order/payment/shipment mutations require idempotency keys.
- Inventory is revalidated at checkout; no browser-provided price is trusted.
- Personally identifiable data is encrypted in transit, access-controlled, minimised and retained under a published policy.
- Secrets never use `NEXT_PUBLIC_` and never enter git, browser bundles or logs.
- Observability must correlate cart, order, payment and shipment IDs without logging full addresses or payment data.

## Launch gates

Checkout remains disabled until every active SKU has verified material composition, dimensions, weight, packed dimensions, capacity where relevant, tax code/rate, dispatch SLA, care instructions, exact images, return eligibility and stock reconciliation.
