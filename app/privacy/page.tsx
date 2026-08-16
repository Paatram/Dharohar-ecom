import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Privacy", description: "How the Dharohar online store uses customer data.", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return <ContentPage eyebrow="Privacy" title="Data is collected for clear customer actions." introduction="This notice explains the information used to provide accounts, checkout, fulfilment and customer support.">
    <ContentSection title="What the store can save"><p>When you submit or sign in, the store may save account identity, contact details, delivery addresses, enquiry content and consent time, wishlist, care preferences, orders, payment references, fulfilment events, returns and verified-purchase reviews. Dharohar does not store your full card details.</p></ContentSection>
    <ContentSection title="Purpose and control"><p>Data is used to answer enquiries, calculate and fulfil orders, provide customer service, prevent duplicate operations, honour legal and tax duties, and maintain an audit trail. Enquiry and reminder consent is explicit. Optional analytics accepts only allowlisted events and only after consent.</p></ContentSection>
    <ContentSection title="Service providers"><p>Account identity, managed storage, payment and fulfilment services process only the information needed for their role. Provider credentials remain server-side and are not exposed to the browser.</p></ContentSection>
  </ContentPage>;
}
