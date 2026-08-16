import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/commerce/CheckoutFlow";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";

export const metadata: Metadata = { title: "Secure Checkout", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return <><SiteHeader /><main className="checkout-page shell"><div className="checkout-page-heading"><p className="eyebrow">Secure checkout</p><h1>Complete your order</h1></div><CheckoutFlow /></main><SiteFooter /></>;
}
