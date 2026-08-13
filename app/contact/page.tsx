import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import { findProduct } from "@/lib/catalog";

export const metadata: Metadata = { title: "Enquiries", description: "Launch-stage purchase and project enquiry information for Dharohar.", robots: { index: false, follow: true } };

type ContactPageProps = { searchParams: Promise<{ product?: string }> };

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { product: slug } = await searchParams;
  const product = slug ? findProduct(slug) : undefined;
  return <ContentPage eyebrow="Enquiries" title={product ? `Interest in ${product.name}` : "Begin a Dharohar conversation."} introduction="We have not published a placeholder phone number, inbox or lead form: customer contact details must route to an owned, monitored and privacy-compliant channel.">
    {product ? <aside className="content-notice"><strong>Selected piece</strong><p>{product.name} · {product.finish}. This page does not claim that interest has been submitted or stored.</p></aside> : null}
    <ContentSection title="Retail interest"><p>Product enquiry capture will activate after the verified business email and data-retention notice are supplied.</p></ContentSection>
    <ContentSection title="Trade, hospitality and gifting"><p>The production form will collect organisation, project type, quantity range, destination, required date and personalisation brief—never payment information.</p></ContentSection>
    <p><Link className="button button-wine" href="/collections/all">Continue browsing</Link></p>
  </ContentPage>;
}
