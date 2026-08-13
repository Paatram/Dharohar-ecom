# Risk register

| Risk | Current control | Exit condition |
| --- | --- | --- |
| Prices may not include final GST/fees | Checkout disabled; no Offer availability schema | Finance-approved price, HSN/GST and margin table per SKU |
| DLP images are not exact photos for all 34 SKUs | Product pages label final photography as pending | Exact multi-angle images mapped and approved per SKU |
| Shipping cannot be quoted accurately | No delivery promise or order capture | Packed dimensions/weight and Shiprocket serviceability tests |
| Contact/privacy ownership is unknown | No form or newsletter stores personal data | Owned monitored channel, privacy notice and retention policy |
| Payment/webhook mistakes could create false paid orders | Payment integration not activated | Signed, idempotent, replay-tested webhook reconciliation |
| Thin opening margins (~14.1% before overhead) | Catalog totals covered by invariants | Approved unit economics including GST, payment, shipping, returns and packaging |
| Upstream `vinext` depends on vulnerable `image-size@2.0.2` | Images are trusted repository assets; no user image upload or parsing path | Upgrade when compatible patched `vinext/image-size` is released; block untrusted image ingestion |
| Mobile app parity may drift | API-first commerce boundary and stable product/order IDs | Versioned API contract and shared integration tests before native app work |
