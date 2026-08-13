"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AccountData = {
  profile: { email: string; fullName: string | null };
  addresses: Array<Record<string, string | number | null>>;
  orders: Array<{ order_number: string; status: string; payment_status: string; fulfillment_status: string; total_paise: number; created_at: number }>;
  care: Array<{ id: string; plan: string; status: string }>;
  wishlist: Array<{ product_slug: string }>;
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export function AccountDashboard() {
  const [data, setData] = useState<AccountData | null>(null);
  const [message, setMessage] = useState("Loading your private account…");
  const [showAddress, setShowAddress] = useState(false);
  async function load() {
    const response = await fetch("/api/commerce/account", { cache: "no-store" });
    const result = await response.json() as AccountData & { message?: string };
    if (!response.ok) { setMessage(result.message ?? "Account data is unavailable on this deployment."); return; }
    setData(result); setMessage("");
  }
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);
  async function saveAddress(form: HTMLFormElement) {
    const values = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/commerce/addresses", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      label: values.label, recipientName: values.recipientName, phone: values.phone, line1: values.line1, line2: values.line2 || undefined,
      city: values.city, state: values.state, pincode: values.pincode, gstin: values.gstin || undefined, isDefault: values.isDefault === "on",
    }) });
    const result = await response.json() as { message?: string };
    if (!response.ok) { setMessage(result.message ?? "Address could not be saved."); return; }
    setShowAddress(false); setMessage("Address saved securely."); await load();
  }
  if (!data) return <div className="account-loading" role="status">{message}</div>;
  return <div className="account-dashboard">
    {message ? <p className="form-success" role="status">{message}</p> : null}
    <section><div className="account-section-head"><div><p className="eyebrow">Orders</p><h2>Your order history</h2></div><Link className="text-link" href="/track-order">Track an order →</Link></div>
      {data.orders.length ? <div className="account-orders">{data.orders.map((order) => <article key={order.order_number}><strong>{order.order_number}</strong><span>{new Date(order.created_at).toLocaleDateString("en-IN")}</span><span>{order.fulfillment_status.replaceAll("_", " ")}</span><b>{money.format(order.total_paise / 100)}</b></article>)}</div> : <p className="empty-state">No orders are linked to this account yet.</p>}
    </section>
    <section><div className="account-section-head"><div><p className="eyebrow">Addresses</p><h2>Saved delivery details</h2></div><button className="button button-outline" type="button" onClick={() => setShowAddress(!showAddress)}>Add address</button></div>
      {showAddress ? <form className="brief-form compact-form" onSubmit={(event) => { event.preventDefault(); void saveAddress(event.currentTarget); }}><div className="form-grid"><label>Label<input name="label" defaultValue="Home" required /></label><label>Recipient<input name="recipientName" autoComplete="name" required /></label><label>Phone<input name="phone" autoComplete="tel" required /></label><label>Address<input name="line1" autoComplete="address-line1" required /></label><label>Address line 2<input name="line2" autoComplete="address-line2" /></label><label>City<input name="city" required /></label><label>State<input name="state" required /></label><label>Pincode<input name="pincode" pattern="[0-9]{6}" inputMode="numeric" required /></label><label>GSTIN<input name="gstin" /></label></div><label className="consent-field"><input name="isDefault" type="checkbox" /><span>Use as my default address</span></label><button className="button button-wine" type="submit">Save address</button></form> : null}
      <div className="address-grid">{data.addresses.map((address) => <article key={String(address.id)}><strong>{String(address.label)}</strong><p>{String(address.recipient_name)}<br />{String(address.line1)}{address.line2 ? <><br />{String(address.line2)}</> : null}<br />{String(address.city)}, {String(address.state)} {String(address.pincode)}</p></article>)}</div>
    </section>
    <section className="account-stat-grid"><article><span>Saved pieces</span><strong>{data.wishlist.length}</strong><Link href="/wishlist">Open wishlist</Link></article><article><span>Care plans</span><strong>{data.care.length}</strong><Link href="/care">Manage care</Link></article></section>
  </div>;
}
