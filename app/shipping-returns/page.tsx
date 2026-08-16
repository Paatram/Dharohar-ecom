import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Shipping & Returns", description: "Delivery and return support for Dharohar orders.", robots: { index: false, follow: true } };

export default function ShippingReturnsPage() {
  return <ContentPage eyebrow="Shipping & returns" title="Delivery information for your order." introduction="Delivery options and charges are calculated from your pincode and shown in checkout before payment.">
    <ContentSection title="Delivery"><p>Use a complete address and reachable phone number. Once your order is dispatched, tracking information appears against the order and can also be checked with the order number and email.</p></ContentSection>
    <ContentSection title="Order issues"><p>If an item arrives damaged or does not match your order, contact Dharohar promptly with the order number and clear photographs of the item and packaging so the team can review it.</p></ContentSection>
    <ContentSection title="Return requests"><p>Start a return request from your account or contact us with the order number. Eligibility, collection method and any applicable cost follow the terms shown with that order.</p></ContentSection>
  </ContentPage>;
}
