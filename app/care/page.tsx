import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Care & Restoration", description: "Dharohar material-care principles for copper, brass and kansa objects.", alternates: { canonical: "/care" } };

export default function CarePage() {
  return <ContentPage eyebrow="Lifetime craftsmanship care" title="Use leaves a history. Care keeps it useful." introduction="Exact care varies with composition, lining, finish and intended use. Each launch object will ship with its verified instructions; this page sets the safe baseline.">
    <ContentSection title="Daily care"><p>Use a soft cloth and non-abrasive cleaning method. Dry metal objects promptly. Avoid assuming a single cleaner is suitable across copper, brass, kansa, lacquered and antique finishes.</p></ContentSection>
    <ContentSection title="Natural change"><p>Patina and tonal variation are expected in unlacquered metal. Product documentation will explain what is natural and what should be reported for inspection.</p></ContentSection>
    <ContentSection title="Restoration"><p>The restoration service will open only after intake, assessment, quotation, transport responsibility and achievable-finish standards are operationally defined.</p></ContentSection>
  </ContentPage>;
}
