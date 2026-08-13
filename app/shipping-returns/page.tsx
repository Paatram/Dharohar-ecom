import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Shipping & Returns", description: "The launch-stage status of Dharohar shipping, inspection, damage and return policies.", robots: { index: false, follow: true } };

export default function ShippingReturnsPage() {
  return <ContentPage eyebrow="Policy readiness" title="Shipping terms will open with purchasing—not before." introduction="Rates and timelines depend on verified packed weight, dimensions, serviceable postcodes and carrier contracts. Those inputs are not yet complete, so no unsupported delivery promise is shown.">
    <ContentSection title="Before orders open"><p>Each SKU must pass packaging trials, volumetric-weight capture, dispatch inspection and serviceability checks. High-value and fragile sets require an explicit damage-evidence process.</p></ContentSection>
    <ContentSection title="Returns policy gate"><p>The final policy must state the return window, eligible condition, non-returnable personalised items, reverse logistics, refund timing and who bears each shipping cost.</p></ContentSection>
    <aside className="content-notice"><strong>Current status</strong><p>No customer can place or pay for an order in this verification build.</p></aside>
  </ContentPage>;
}
