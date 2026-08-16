import type { Metadata } from "next";
import { BriefForm } from "@/components/commerce/BriefForm";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Trade & Projects", description: "Prepare a Dharohar sourcing brief for hotels, restaurants, offices, designers and institutional gifting.", alternates: { canonical: "/trade" } };
export default async function TradePage({ searchParams }: { searchParams: Promise<{ service?: string }> }) { const { service } = await searchParams; return <ContentPage eyebrow="Trade & projects" title="A collection, supported like a project." introduction="A structured route for hospitality, restaurants, workplaces, interior studios and gifting briefs—kept separate from consumer checkout so quantity, timing and customisation can be properly assessed.">
  <section className="trade-steps"><article><span>01</span><h2>Brief</h2><p>Context, quantity, destination, budget and required date.</p></article><article><span>02</span><h2>Feasibility</h2><p>Availability, production, finish, packaging and delivery review.</p></article><article><span>03</span><h2>Approval</h2><p>Written quotation, sample or proof, GST and promised date.</p></article><article><span>04</span><h2>Fulfilment</h2><p>Milestone updates, inspection and coordinated dispatch.</p></article></section>
  <ContentSection title="Prepare your brief"><BriefForm initialService={service} /></ContentSection>
  <aside className="content-notice"><strong>Commercial clarity</strong><p>Quantity, pricing, lead time, customisation and delivery are confirmed in your project quotation.</p></aside>
  </ContentPage>; }
