import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Materials",
  description: "An introduction to Dharohar copper, peetal and kansa objects and their care.",
  alternates: { canonical: "/materials" },
};

export default function MaterialsPage() {
  return <ContentPage eyebrow="Material library" title="Know the metal before you choose the object." introduction="Traditional metals are expressive, useful and naturally variable. Choose by use, finish and the care rhythm that suits you.">
    <ContentSection title="Tamra · Copper"><p>Copper has a luminous surface that naturally changes with touch, air and use. Lacquered finishes are intended to preserve their appearance for longer; always follow the care guidance supplied with the piece.</p><p><Link className="text-link" href="/collections/all?material=copper">Shop copper <span aria-hidden="true">→</span></Link></p></ContentSection>
    <ContentSection title="Peetal · Brass"><p>Peetal brings warmth and visual weight to cookware, tools and serveware. Plain, hammered and antique finishes age differently, so gentle cleaning and prompt drying are important.</p><p><Link className="text-link" href="/collections/all?material=brass">Shop peetal <span aria-hidden="true">→</span></Link></p></ContentSection>
    <ContentSection title="Kansa · Bronze"><p>Kansa has a grounded tone and calm table presence. Use non-abrasive cleaning, dry promptly and store in a dry place to care for the finish.</p><p><Link className="text-link" href="/collections/all?material=kansa">Shop kansa <span aria-hidden="true">→</span></Link></p></ContentSection>
    <aside className="content-notice"><strong>Practical guidance</strong><p>Use the product’s stated intended use and care information. Dharohar does not make unsupported therapeutic or medical claims.</p></aside>
  </ContentPage>;
}
