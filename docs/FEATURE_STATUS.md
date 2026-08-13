# Commerce feature status

This file separates implemented customer experience from capabilities that require real operational inputs. A visible screen is not considered a live commerce feature unless its source of truth and failure paths are connected.

## Implemented in the storefront

- Hover-based desktop mega-navigation and clickable mobile accordion drawer.
- Category, subcategory, audience, material and use navigation.
- Typo-tolerant predictive search and results page.
- Material, use, maximum-price and launch-stock filters; featured, name and price sorting.
- Device-persistent wishlist, three-product comparison and non-authoritative selection bag.
- Product breadcrumbs, image, description, supplied price, finish, launch quantity, readiness labels, care/material disclosures, pincode input validation, related products and curated ritual bundles.
- Gifting by occasion and supplied-price budget, gifting service explanation and project route.
- Trade brief validation for offices, restaurants, hotels, designers, hospitality and gifting.
- Account, tracking, return and checkout-readiness surfaces with explicit activation gates.
- FAQ, material library and four decision-support guides.
- Product, breadcrumb, organisation and FAQ structured data without false Offer, AggregateRating or Review data.
- Sitemap coverage for product, collection, subcategory, audience, gifting, trade and editorial routes.

## Implemented as safe previews, not live services

- Selection bag totals use the supplied indicative price for planning. They are not authoritative checkout totals.
- Pincode fields validate format but do not promise serviceability or a delivery date.
- Enquiry and trade forms validate completeness in-browser but do not transmit personal data.
- Account and order-tracking pages explain the intended flow but do not create identity or query invented orders.
- Gift presentation, engraving, bundles and scheduled delivery are described but not priced or promised.
- Reviews and Q&A surfaces explain verification policy; no seeded customer content is shown.

## Required to activate commerce

1. Approve exact SKU images, composition, lining, dimensions, capacity, net/packed weight, compatibility, care, HSN/GST, stock, dispatch SLA and return eligibility.
2. Supply the owned customer-service identity, grievance contact, legal entity, GSTIN, policy decisions and retention periods.
3. Provision Medusa and PostgreSQL environments with migrations, backups, restore rehearsal, admin roles and verified catalogue import.
4. Connect server-authoritative pricing, promotion, stock reservation, addresses, GST invoices, order state and returns.
5. Connect Razorpay Orders, signature verification, replay-safe webhooks, reconciliation, cancellation and refund paths.
6. Connect Shiprocket serviceability, rates, shipment creation, labels, tracking, non-delivery and reverse pickup.
7. Connect a consent-aware transactional email/WhatsApp provider, monitored lead endpoint and upload storage.
8. Add verified-purchase reviews, product Q&A moderation and back-in-stock consent after customer identity exists.
9. Add analytics only with an approved consent model and documented events for search zero-results, discovery, bag, checkout and purchase funnels.
10. Complete browser/device, accessibility, payment, webhook, load, security, restore and operational acceptance tests in staging before controlled production traffic.

## Intentionally deferred until evidence exists

- Bestseller/popularity labels and personalised recommendations require behavioural or sales data.
- Loyalty and referrals require a measured repeat-purchase case and accounting rules.
- International currency/shipping requires duties, returns, payments and carrier operations.
- Store locator requires verified physical stores.
- Health, Ayurvedic, therapeutic, certification, impact and warranty claims require appropriate evidence and operational support.
