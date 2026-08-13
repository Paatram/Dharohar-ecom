import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import { CarePlanBuilder } from "@/components/commerce/CarePlan";

export const metadata: Metadata = { title: "Care Circle & Restoration", description: "Build a private Dharohar care plan and understand care principles for copper, peetal and kansa objects.", alternates: { canonical: "/care" } };

export default function CarePage() {
  return <ContentPage eyebrow="Dharohar Care Circle" title="Use leaves a history. Care keeps it useful." introduction="Build a private care rhythm now, then follow exact composition, lining and finish instructions when your verified product care card arrives.">
    <CarePlanBuilder />
    <ContentSection title="Daily care"><p>Use a soft cloth and non-abrasive cleaning method. Dry metal objects promptly. Avoid assuming a single cleaner is suitable across copper, brass, kansa, lacquered and antique finishes.</p></ContentSection>
    <ContentSection title="Natural change"><p>Patina and tonal variation are expected in unlacquered metal. Product documentation will explain what is natural and what should be reported for inspection.</p></ContentSection>
    <ContentSection title="Restoration"><p>The restoration service will open only after intake, assessment, quotation, transport responsibility and achievable-finish standards are operationally defined.</p></ContentSection>
  </ContentPage>;
}
