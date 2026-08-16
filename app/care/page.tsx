import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import { CarePlanBuilder } from "@/components/commerce/CarePlan";

export const metadata: Metadata = { title: "Care Circle & Restoration", description: "Build a private Dharohar care plan and understand care principles for copper, peetal and kansa objects.", alternates: { canonical: "/care" } };

export default function CarePage() {
  return <ContentPage eyebrow="Dharohar Care Circle" title="Use leaves a history. Care keeps it useful." introduction="Build a personal care rhythm for your copper, peetal and kansa pieces, or speak with us about collection support.">
    <section className="care-plans" id="plans" aria-labelledby="care-plans-title">
      <div className="care-plans-heading"><div><p className="eyebrow">Care support</p><h2 id="care-plans-title">Choose how closely we stay involved.</h2></div><p>Start with complimentary care notes or speak with Dharohar about ongoing support for a larger collection.</p></div>
      <div className="care-plan-grid">
        <article><p className="care-plan-label">Self-guided</p><h3>Care Notes</h3><strong>Complimentary</strong><p>For owners who want a clear, private rhythm without a subscription.</p><ul><li>Device-saved care schedule</li><li>Material care library</li><li>Care notes by material and finish</li></ul><Link className="button button-outline" href="#care-plan">Start free care plan</Link></article>
        <article className="care-plan-featured"><p className="care-plan-label">Ongoing support</p><h3>Care Circle</h3><p>For households who want reminders and a direct route for care questions.</p><ul><li>Everything in Care Notes</li><li>Opt-in care reminders</li><li>Priority care assessment route</li></ul><Link className="button button-gold" href="/contact?subject=Care%20Circle%20support">Discuss Care Circle</Link></article>
        <article><p className="care-plan-label">Collection support</p><h3>Collector Care</h3><strong>Custom plan</strong><p>For larger household, hospitality or curated metalware collections.</p><ul><li>Collection-level care brief</li><li>Consolidated object records</li><li>Assessment-led restoration planning</li></ul><Link className="button button-outline" href="/contact?subject=Collector%20Care%20plan">Discuss my collection</Link></article>
      </div>
    </section>
    <CarePlanBuilder />
    <ContentSection title="Daily care"><p>Use a soft cloth and non-abrasive cleaning method. Dry metal objects promptly. Avoid assuming a single cleaner is suitable across copper, brass, kansa, lacquered and antique finishes.</p></ContentSection>
    <ContentSection title="Natural change"><p>Patina and tonal variation are expected in unlacquered metal. Product documentation will explain what is natural and what should be reported for inspection.</p></ContentSection>
    <ContentSection title="Care support"><p>For a damaged finish or a larger collection, share clear photographs and the product or order reference. The team will review the piece before recommending next steps.</p></ContentSection>
  </ContentPage>;
}
