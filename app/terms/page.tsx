import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Terms", description: "Terms status for the Dharohar verification storefront.", robots: { index: false, follow: false } };

export default function TermsPage() {
  return <ContentPage eyebrow="Terms" title="Browsing is open; commercial terms are not yet active." introduction="Prices and planned stock are shown for launch preparation. They do not currently form an offer to sell because checkout and payment are disabled.">
    <ContentSection title="Production terms gate"><p>Before orders open, terms will cover seller identity, pricing and tax, acceptance and cancellation, payment, shipping, inspection, returns, warranty, personalised work, B2B orders, liability and dispute handling.</p></ContentSection>
    <ContentSection title="Product information"><p>Natural variation will be explained clearly, but it will never be used to excuse a material mismatch, unsafe construction or failure to meet the published specification.</p></ContentSection>
  </ContentPage>;
}
