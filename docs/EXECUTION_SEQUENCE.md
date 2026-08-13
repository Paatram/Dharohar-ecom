# Execution sequence

## 1. Foundation and data contract

Lock identifiers, environments, secrets policy, observability, deployment topology and catalog schema. Import the 34 supplied launch SKUs only after source rows reconcile to the inventory totals in automated tests.

## 2. Product-data verification

Collect and approve exact product photography, material composition, finish, dimensions, weight, packed dimensions, capacity, tax classification, care, compatibility, supplier batch, quality checklist and sellable stock. This is the critical path to checkout.

## 3. Commerce backend and PostgreSQL

Provision development/staging/production databases, configure Medusa, model variants and audience collections, import verified catalog data, implement inventory/reservation, customer, cart, pricing, promotion, order, return and admin roles. Add migrations, seed data, backups and restore drills.

## 4. Payment integration

Implement Razorpay order creation on the server, checkout initiation in the storefront, signature verification, webhook reconciliation, idempotency, payment-failure recovery, cancellation and refunds. Test successful, failed, abandoned, duplicated and delayed-webhook paths.

## 5. Shipping and fulfilment

Implement postcode serviceability, packed-weight rates, shipment creation, labels, pickup, tracking webhooks, non-delivery handling, cancellations, reverse pickup and reconciliation with the order timeline.

## 6. Storefront commerce activation

Connect catalog/search/filtering, cart persistence, address and GST fields, shipping quote, coupon handling, checkout, order confirmation, account/orders, tracking and support. Keep server rendering, metadata, structured data, semantic HTML and accessible interactions.

## 7. Audience and B2B workflows

Activate households, offices, restaurants, hotels, interior designers and gifting as curated discovery journeys. Add quote requests, project quantities, promised-date validation, personalisation proofs and approval-based pricing without mixing them into the consumer checkout path.

## 8. Operational readiness

Create order dashboards, stock adjustment controls, supplier receiving, quality inspection, packing checklist, invoice/refund workflow, customer-service playbooks, consented notifications and role-based access.

## 9. Verification and release

Run unit, integration, webhook, end-to-end, accessibility, cross-device, SEO, performance, security and load tests. Rehearse payment outage, duplicate webhook, oversell, carrier failure, refund and database restore. Launch through staging, controlled production traffic and monitored rollback gates.
