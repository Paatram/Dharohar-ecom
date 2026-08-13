import type { Metadata } from "next";
import { TrackingForm } from "@/components/commerce/BriefForm";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Track Order", robots: { index: false, follow: true } };
export default function TrackOrderPage() { return <ContentPage eyebrow="Order tracking" title="One honest order timeline." introduction="Once commerce opens, confirmed orders will reconcile payment, fulfilment and carrier events into one customer-visible history."><ContentSection title="Find an order"><TrackingForm /></ContentSection><ContentSection title="Returns"><p>Eligible orders will start a return or exchange from the authenticated order record, preserving item, reason, pickup and refund state without requesting payment information.</p></ContentSection></ContentPage>; }
