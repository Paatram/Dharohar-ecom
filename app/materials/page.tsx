import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = {
  title: "Materials",
  description: "An honest introduction to Dharohar copper, peetal and kansa, including the product facts still under verification.",
  alternates: { canonical: "/materials" },
};

export default function MaterialsPage() {
  return <ContentPage eyebrow="Material library" title="Know the metal before you choose the object." introduction="Traditional metals are expressive and variable. Dharohar will publish composition, construction, lining, use compatibility and care at exact-SKU level before purchases open.">
    <ContentSection title="Tamra · Copper"><p>Copper is responsive, luminous and naturally changes with touch, air and use. The launch data gate requires verified composition, internal treatment and intended-use guidance for every copper SKU.</p></ContentSection>
    <ContentSection title="Peetal · Brass"><p>Peetal brings warmth, weight and familiarity to cookware, tools and serveware. Product pages will distinguish solid brass, mixed-material parts, finishes and any food-contact lining.</p></ContentSection>
    <ContentSection title="Kansa · Bronze"><p>Kansa has a grounded tone and calm table presence. Alloy information, dimensions, weight and care instructions will be attached to each verified thali, katori and dinner set.</p></ContentSection>
    <aside className="content-notice"><strong>Accuracy gate</strong><p>No therapeutic, medical or universal cooktop-compatibility claims will be published without appropriate evidence.</p></aside>
  </ContentPage>;
}
