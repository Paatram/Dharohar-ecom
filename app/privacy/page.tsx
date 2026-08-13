import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Privacy", description: "Privacy status for the Dharohar verification storefront.", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return <ContentPage eyebrow="Privacy" title="No customer data collection is active in this preview." introduction="The current storefront is a browse-only verification build. Newsletter, customer account, payment and order capture are intentionally disabled.">
    <ContentSection title="Before launch"><p>The production notice will identify the legal entity, contact route, information collected, purpose and lawful basis, processors, retention, security, cookies, customer rights and grievance process.</p></ContentSection>
    <ContentSection title="Third parties"><p>Payment, shipping, analytics and communication providers will be named only after contracts and data flows are finalised.</p></ContentSection>
  </ContentPage>;
}
