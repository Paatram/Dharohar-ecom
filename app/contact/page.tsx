import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import { findProduct } from "@/lib/catalog";
import { ContactForm } from "@/components/commerce/BriefForm";

export const metadata: Metadata = { title: "Enquiries", description: "Launch-stage purchase and project enquiry information for Dharohar.", robots: { index: false, follow: true } };

type ContactPageProps = { searchParams: Promise<{ product?: string; service?: string; subject?: string }> };

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { product: slug, service, subject } = await searchParams;
  const product = slug ? findProduct(slug) : undefined;
  const initialSubject = product ? `Question about ${product.name}` : subject?.slice(0, 120);
  return <ContentPage eyebrow="Enquiries" title={product ? `Interest in ${product.name}` : "Begin a Dharohar conversation."} introduction="Prepare a complete retail enquiry without sending personal data to an unverified inbox. Secure transmission activates only through an owned, monitored and privacy-compliant channel.">
    {product ? <aside className="content-notice"><strong>Selected piece</strong><p>{product.name} · {product.finish}. This page does not claim that interest has been submitted or stored.</p></aside> : null}
    {!product && initialSubject ? <aside className="content-notice"><strong>Selected enquiry</strong><p>{initialSubject}. This selection prepares the form but does not submit or store your details.</p></aside> : null}
    <ContentSection title="Retail interest"><ContactForm subject={initialSubject} /></ContentSection>
    <ContentSection title="Trade, hospitality and gifting"><p>The project route collects organisation, project type, quantity, destination, required date and personalisation context—never payment information.</p><p><Link className="text-link" href={`/trade${service ? `?service=${encodeURIComponent(service)}` : ""}`}>Prepare a project brief <span aria-hidden="true">→</span></Link></p></ContentSection>
    <p><Link className="button button-wine" href="/collections/all">Continue browsing</Link></p>
  </ContentPage>;
}
