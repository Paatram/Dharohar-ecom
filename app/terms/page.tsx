import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Terms", description: "Terms status for the Dharohar verification storefront.", robots: { index: false, follow: false } };

export default function TermsPage() {
  return <ContentPage eyebrow="Terms" title="Commercial terms remain an activation gate." introduction="The secure order workflow is implemented but cannot accept payment until every SKU and provider passes verification. Indicative catalogue prices and planned stock do not yet form an offer to sell.">
    <ContentSection title="Production terms gate"><p>Before orders open, Dharohar must approve and publish seller identity, pricing and tax treatment, order acceptance and cancellation, payment, shipping, inspection, returns, warranty, personalised work, B2B orders, liability, grievance contact and dispute handling.</p></ContentSection>
    <ContentSection title="Order integrity"><p>Payable totals, availability and delivery serviceability are calculated by the server. A customer-side amount is never trusted. Payment is confirmed only by a signature-verified, idempotently processed provider webhook.</p></ContentSection>
    <ContentSection title="Product information"><p>Natural variation will be explained clearly, but it will never be used to excuse a material mismatch, unsafe construction or failure to meet the published specification.</p></ContentSection>
  </ContentPage>;
}
