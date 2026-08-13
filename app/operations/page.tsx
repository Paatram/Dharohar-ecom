import type { Metadata } from "next";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { OperationsDashboard } from "@/components/commerce/OperationsDashboard";
import { ContentPage } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Commerce Operations", robots: { index: false, follow: false } };

export default async function OperationsPage() {
  await requireChatGPTUser("/operations");
  return <ContentPage eyebrow="Private operations" title="One ledger for readiness, orders and service." introduction="Product activation, stock movements and customer operations are authenticated, auditable and fail closed."><OperationsDashboard /></ContentPage>;
}
