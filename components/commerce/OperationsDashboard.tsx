"use client";

import { useEffect, useMemo, useState } from "react";

type InventoryRow = { slug: string; name: string; category: string; inventory_on_hand: number; inventory_reserved: number; commerce_status: string; [key: string]: string | number };
type Summary = { providers: Record<string, boolean>; inventory: InventoryRow[]; orders: Array<Record<string, string | number>>; enquiries: Array<Record<string, string | number>>; returns: Array<Record<string, string | number>>; outbox: Array<Record<string, string | number>> };
const verificationKeys = ["exact_images_verified", "composition_verified", "dimensions_verified", "packed_weight_verified", "tax_verified", "care_verified", "compatibility_verified", "return_policy_verified", "dispatch_sla_verified"];

export function OperationsDashboard() {
  const [data, setData] = useState<Summary | null>(null);
  const [message, setMessage] = useState("Loading the operations ledger…");
  async function load() {
    const response = await fetch("/api/commerce/admin/summary", { cache: "no-store" });
    const result = await response.json() as Summary & { message?: string };
    if (!response.ok) { setMessage(result.message ?? "Operations access is unavailable."); return; }
    setData(result); setMessage("");
  }
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);
  const active = useMemo(() => data?.inventory.filter((row) => row.commerce_status === "active").length ?? 0, [data]);
  async function adjust(productSlug: string, quantity: number) {
    const reason = window.prompt(`Reason for ${quantity > 0 ? "adding" : "removing"} ${Math.abs(quantity)} unit(s):`);
    if (!reason) return;
    const response = await fetch("/api/commerce/admin/inventory", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify({ productSlug, quantity, reason }) });
    const result = await response.json() as { message?: string };
    setMessage(response.ok ? `Inventory updated for ${productSlug}.` : result.message ?? "Inventory was not changed.");
    if (response.ok) await load();
  }
  if (!data) return <div className="account-loading" role="status">{message}</div>;
  return <div className="operations-dashboard">
    {message ? <p className="form-success" role="status">{message}</p> : null}
    <section className="ops-stat-grid"><article><span>Active SKUs</span><strong>{active}/{data.inventory.length}</strong></article><article><span>Orders</span><strong>{data.orders.length}</strong></article><article><span>Open enquiries</span><strong>{data.enquiries.length}</strong></article><article><span>Returns</span><strong>{data.returns.length}</strong></article></section>
    <section><p className="eyebrow">Integration health</p><div className="provider-grid">{Object.entries(data.providers).map(([provider, ready]) => <article key={provider} className={ready ? "provider-ready" : "provider-blocked"}><strong>{provider}</strong><span>{ready ? "Configured" : "Activation blocked"}</span></article>)}</div></section>
    <section><div className="account-section-head"><div><p className="eyebrow">Inventory & SKU gates</p><h2>Nothing sells without complete evidence.</h2></div></div><div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Product</th><th>Available</th><th>Verification</th><th>Status</th><th>Adjust</th></tr></thead><tbody>{data.inventory.map((row) => { const verified = verificationKeys.filter((key) => Boolean(row[key])).length; return <tr key={row.slug}><td><strong>{row.name}</strong><small>{row.category}</small></td><td>{row.inventory_on_hand - row.inventory_reserved}<small>{row.inventory_reserved} reserved</small></td><td>{verified}/9</td><td><span className={`ops-status ops-${row.commerce_status}`}>{row.commerce_status.replaceAll("_", " ")}</span></td><td><button type="button" onClick={() => void adjust(row.slug, 1)}>+1</button><button type="button" onClick={() => void adjust(row.slug, -1)}>−1</button></td></tr>; })}</tbody></table></div></section>
    <section><p className="eyebrow">Recent enquiries</p>{data.enquiries.length ? <div className="ops-list">{data.enquiries.map((entry) => <article key={String(entry.reference)}><strong>{String(entry.reference)}</strong><span>{String(entry.kind)}</span><p>{String(entry.subject)}</p><small>{String(entry.status)}</small></article>)}</div> : <p className="empty-state">No enquiries yet.</p>}</section>
  </div>;
}
