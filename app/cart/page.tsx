import type { Metadata } from "next";
import { BagPage } from "@/components/commerce/SavedProductGrid";
import { ContentPage } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Selection Bag", robots: { index: false, follow: true } };
export default function CartPage() { return <ContentPage eyebrow="Your selection" title="A considered group of objects." introduction="Review quantities and the supplied indicative product total. This device-saved bag is not a server-authoritative cart until commerce activation."><BagPage /></ContentPage>; }
