import type { Metadata } from "next";
import { TrackingForm } from "@/components/commerce/BriefForm";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Track Order", robots: { index: false, follow: true } };
export default function TrackOrderPage() { return <ContentPage eyebrow="Order tracking" title="One clear order timeline." introduction="Use the order number and purchase email to check payment, fulfilment and carrier updates."><ContentSection title="Find an order"><TrackingForm /></ContentSection><ContentSection title="Returns"><p>Sign in to review an order or contact Dharohar with the order number to start a return request.</p></ContentSection></ContentPage>; }
