import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Our Craft", description: "How Dharohar will document sourcing, making, finishing and quality inspection.", alternates: { canonical: "/our-craft" } };

export default function CraftPage() {
  return <ContentPage eyebrow="Visible making" title="Craft should be documented, not romanticised." introduction="Dharohar is building a traceable account of who makes each family of objects, how the metal is formed, and which variations are natural rather than defects.">
    <ContentSection title="Source"><p>Supplier identity, production location, alloy declaration and batch references belong in the internal product record before stock is accepted.</p></ContentSection>
    <ContentSection title="Form and finish"><p>Hammering, turning, polishing, lacquering, embossing and mixed-material assembly will be described only when confirmed for the exact SKU.</p></ContentSection>
    <ContentSection title="Inspect"><p>Every dispatch checklist will cover dimensions, weight tolerance, balance, edges, handles, lids, surface finish, packaging and product-to-order match.</p></ContentSection>
  </ContentPage>;
}
