import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Our Craft", description: "Dharohar’s approach to sourcing, making, finishing and quality inspection.", alternates: { canonical: "/our-craft" } };

export default function CraftPage() {
  return <ContentPage eyebrow="Visible making" title="Craft should be documented, not romanticised." introduction="Dharohar is building a traceable account of who makes each family of objects, how the metal is formed, and which variations are natural rather than defects.">
    <ContentSection title="Source"><p>Supplier identity, production location, alloy declaration and batch references belong in the internal product record before stock is accepted.</p></ContentSection>
    <ContentSection title="Form and finish"><p>Hammering, turning, polishing, lacquering and embossing give each metal object its character. Product pages identify the material and finish offered.</p></ContentSection>
    <ContentSection title="Inspect"><p>Dispatch checks cover balance, edges, handles, lids, surface finish, protective packaging and product-to-order match.</p></ContentSection>
  </ContentPage>;
}
