import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import { findProduct } from "@/lib/catalog";
import { ContactForm } from "@/components/commerce/BriefForm";

export const metadata: Metadata = { title: "Contact Dharohar", description: "Product, order, gifting and trade support from Dharohar.", robots: { index: false, follow: true } };

type ContactPageProps = { searchParams: Promise<{ product?: string; service?: string; subject?: string }> };

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { product: slug, service, subject } = await searchParams;
  const product = slug ? findProduct(slug) : undefined;
  const initialSubject = product ? `Question about ${product.name}` : subject?.slice(0, 120);
  return <ContentPage eyebrow="Contact Dharohar" title={product ? `Ask about ${product.name}` : "How can we help?"} introduction="Send a product, order, gifting or project question to the Dharohar team.">
    {product ? <aside className="content-notice"><strong>Selected piece</strong><p>{product.name} · {product.finish}</p></aside> : null}
    {!product && initialSubject ? <aside className="content-notice"><strong>Selected enquiry</strong><p>{initialSubject}</p></aside> : null}
    <ContentSection title="Your enquiry"><ContactForm subject={initialSubject} /></ContentSection>
    <ContentSection title="Trade, hospitality and gifting"><p>The project route collects organisation, project type, quantity, destination, required date and personalisation context—never payment information.</p><p><Link className="text-link" href={`/trade${service ? `?service=${encodeURIComponent(service)}` : ""}`}>Prepare a project brief <span aria-hidden="true">→</span></Link></p></ContentSection>
    <p><Link className="button button-wine" href="/collections/all">Continue shopping</Link></p>
  </ContentPage>;
}
