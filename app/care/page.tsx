import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import { CarePlanBuilder } from "@/components/commerce/CarePlan";

export const metadata: Metadata = { title: "Care Circle & Restoration", description: "Build a private Dharohar care plan and understand care principles for copper, peetal and kansa objects.", alternates: { canonical: "/care" } };

export default function CarePage() {
  return <ContentPage eyebrow="Dharohar Care Circle" title="Use leaves a history. Care keeps it useful." introduction="Build a private care rhythm now, then follow exact composition, lining and finish instructions when your verified product care card arrives.">
    <section className="care-plans" id="plans" aria-labelledby="care-plans-title">
      <div className="care-plans-heading"><div><p className="eyebrow">Care subscriptions</p><h2 id="care-plans-title">Choose how closely we stay involved.</h2></div><p>Plans are shown before activation so the scope is clear. No recurring payment is taken today, and launch pricing will be confirmed before you consent.</p></div>
      <div className="care-plan-grid">
        <article><p className="care-plan-label">Self-guided</p><h3>Care Notes</h3><strong>Complimentary</strong><p>For owners who want a clear, private rhythm without a subscription.</p><ul><li>Device-saved care schedule</li><li>Material care library</li><li>Product-specific care cards when verified</li></ul><Link className="button button-outline" href="#care-plan">Start free care plan</Link></article>
        <article className="care-plan-featured"><p className="care-plan-label">Annual membership</p><h3>Care Circle</h3><strong>Launch pricing pending</strong><p>For households who want consent-based reminders and a defined support route.</p><ul><li>Everything in Care Notes</li><li>Planned opt-in care reminders</li><li>Priority care and restoration assessment route</li></ul><Link className="button button-gold" href="/contact?subject=Care%20Circle%20annual%20membership">Register interest</Link></article>
        <article><p className="care-plan-label">Collection support</p><h3>Collector Care</h3><strong>Custom plan</strong><p>For larger household, hospitality or curated metalware collections.</p><ul><li>Collection-level care brief</li><li>Consolidated object records</li><li>Assessment-led restoration planning</li></ul><Link className="button button-outline" href="/contact?subject=Collector%20Care%20plan">Discuss my collection</Link></article>
      </div>
      <p className="care-plan-disclosure">Subscription billing, automated reminders and restoration intake remain inactive until pricing, consent, service levels and fulfilment are verified.</p>
    </section>
    <CarePlanBuilder />
    <ContentSection title="Daily care"><p>Use a soft cloth and non-abrasive cleaning method. Dry metal objects promptly. Avoid assuming a single cleaner is suitable across copper, brass, kansa, lacquered and antique finishes.</p></ContentSection>
    <ContentSection title="Natural change"><p>Patina and tonal variation are expected in unlacquered metal. Product documentation will explain what is natural and what should be reported for inspection.</p></ContentSection>
    <ContentSection title="Restoration"><p>The restoration service will open only after intake, assessment, quotation, transport responsibility and achievable-finish standards are operationally defined.</p></ContentSection>
  </ContentPage>;
}
