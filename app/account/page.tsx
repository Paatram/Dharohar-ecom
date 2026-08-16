import type { Metadata } from "next";
import Link from "next/link";
import { AccountDashboard } from "@/components/commerce/AccountDashboard";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Account", robots: { index: false, follow: true } };
export default async function AccountPage() {
  const user = await getChatGPTUser();
  if (!user) return <ContentPage eyebrow="Customer account" title="Sign in or create your Dharohar account." introduction="Keep delivery addresses, orders, saved pieces and care plans together for a faster checkout."><ContentSection title="Your account includes"><ul className="feature-list"><li>Order history and delivery tracking</li><li>Saved delivery addresses</li><li>Verified-purchase reviews and care plans</li><li>Wishlist sync across signed-in devices</li></ul></ContentSection><p><Link className="button button-wine" href={chatGPTSignInPath("/account")}>Sign in / Create account</Link></p></ContentPage>;
  return <ContentPage eyebrow="Customer account" title={`Welcome back, ${user.displayName}.`} introduction="Manage your orders, addresses, saved pieces and care plans."><p><Link className="text-link" href={chatGPTSignOutPath("/")}>Sign out</Link></p><AccountDashboard /></ContentPage>;
}
