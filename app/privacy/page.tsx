import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Privacy", description: "Dharohar commerce privacy and activation notice.", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return <ContentPage eyebrow="Privacy" title="Data is collected only for a clear customer action." introduction="This pre-launch notice describes the implemented data flows. Dharohar must add its final legal entity, grievance contact and approved retention schedule before public commerce activation.">
    <ContentSection title="What the platform can store"><p>When you submit or sign in, the private commerce ledger may store platform identity, contact details, addresses and GSTIN, enquiry content and consent time, wishlist, care preferences, orders, payment references, fulfilment events, returns and verified-purchase reviews. Card details are never stored by Dharohar.</p></ContentSection>
    <ContentSection title="Purpose and control"><p>Data is used to answer enquiries, calculate and fulfil orders, provide customer service, prevent duplicate operations, honour legal and tax duties, and maintain an audit trail. Enquiry and reminder consent is explicit. Optional analytics accepts only allowlisted events and only after consent.</p></ContentSection>
    <ContentSection title="Processors and retention"><p>Platform identity, managed database, Razorpay payment and Shiprocket fulfilment adapters are separated by server-side credentials. External providers remain disabled until contracts and production data flows are approved. Final retention periods and the customer-rights contact must be published before orders open.</p></ContentSection>
  </ContentPage>;
}
