import type { Metadata } from "next";
import { WishlistGrid } from "@/components/commerce/SavedProductGrid";
import { ContentPage } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Saved Pieces", robots: { index: false, follow: true } };
export default function WishlistPage() { return <ContentPage eyebrow="Your shortlist" title="Saved pieces." introduction="A private shortlist stored on this device; no account or personal information is required."><WishlistGrid /></ContentPage>; }
