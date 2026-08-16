import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Terms", description: "Terms for using the Dharohar online store.", robots: { index: false, follow: false } };

export default function TermsPage() {
  return <ContentPage eyebrow="Terms" title="Terms of using the Dharohar store." introduction="These terms apply when you browse, create an account, submit an enquiry or place an order through Dharohar.">
    <ContentSection title="Orders and payment"><p>Your order summary shows products, GST, delivery charge and total before payment. An order is accepted after payment is confirmed and an order confirmation is issued. If an item becomes unavailable before confirmation, no charge is completed for that order.</p></ContentSection>
    <ContentSection title="Product information"><p>We aim to present product names, materials, finishes and prices accurately. Hand-finished metalware may show natural tonal or surface variation. Images may appear slightly different across screens.</p></ContentSection>
    <ContentSection title="Accounts and acceptable use"><p>You are responsible for the delivery and contact information supplied with an order. Do not misuse the service, interfere with checkout, or submit unlawful or misleading content.</p></ContentSection>
    <ContentSection title="Support"><p>Questions about an order, product or these terms can be submitted through the contact page with the relevant order or product reference.</p></ContentSection>
  </ContentPage>;
}
