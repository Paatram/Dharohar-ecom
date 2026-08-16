"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/catalog";
import { useStore } from "@/components/commerce/StoreProvider";

type ApiState = { kind: "idle" | "loading" | "ready" | "blocked" | "error"; message?: string; blockers?: Array<{ slug: string; name: string; missing: string[] }>; quote?: { subtotalPaise: number; taxPaise: number; shippingPaise: number; totalPaise: number } };
type SavedAddress = { id: string; label: string; recipient_name: string; phone: string; line1: string; line2: string | null; city: string; state: string; pincode: string; is_default: number };

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
function formatMoney(paise: number) { return money.format(paise / 100); }

async function loadRazorpay() {
  if ((window as Window & { Razorpay?: unknown }).Razorpay) return true;
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function CheckoutFlow() {
  const store = useStore();
  const [state, setState] = useState<ApiState>({ kind: "idle" });
  const [details, setDetails] = useState<Record<string, string>>({});
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [accountReady, setAccountReady] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState("");
  const lastPincode = useRef("");
  const lines = useMemo(() => store.cart.map((line) => ({ ...line, product: products.find((product) => product.slug === line.slug) })).filter((line) => line.product), [store.cart]);
  const indicativeTotal = lines.reduce((sum, line) => sum + line.product!.sellingPricePaise * line.quantity, 0);
  const indicativeTax = Math.round(indicativeTotal * .05);

  useEffect(() => {
    void fetch("/api/commerce/account", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) return;
      const result = await response.json() as { profile?: { email?: string; fullName?: string | null }; addresses?: SavedAddress[] };
      const saved = result.addresses ?? [];
      setAddresses(saved);
      setDetails((current) => ({ ...current, email: current.email || result.profile?.email || "", recipientName: current.recipientName || result.profile?.fullName || "" }));
      const preferred = saved.find((address) => Boolean(address.is_default)) ?? saved[0];
      if (preferred) selectAddress(preferred);
    }).catch(() => undefined).finally(() => setAccountReady(true));
  }, []);

  useEffect(() => {
    const pincode = details.pincode ?? "";
    if (!/^\d{6}$/.test(pincode) || lastPincode.current === pincode) return;
    lastPincode.current = pincode;
    setPincodeStatus("Finding city and state…");
    void fetch(`/api/commerce/postcode?pincode=${pincode}`).then(async (response) => {
      const result = await response.json() as { city?: string; state?: string; message?: string };
      if (!response.ok || !result.city || !result.state) { setPincodeStatus(result.message ?? "Enter city and state manually."); return; }
      setDetails((current) => ({ ...current, city: result.city!, state: result.state! }));
      setPincodeStatus(`${result.city}, ${result.state} selected`);
    }).catch(() => setPincodeStatus("Enter city and state manually."));
  }, [details.pincode]);

  function selectAddress(address: SavedAddress) {
    lastPincode.current = address.pincode;
    setDetails((current) => ({ ...current, recipientName: address.recipient_name, phone: address.phone, line1: address.line1, line2: address.line2 ?? "", city: address.city, state: address.state, pincode: address.pincode }));
    setPincodeStatus(`${address.city}, ${address.state} selected`);
  }
  const payload = () => ({
    items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
    pincode: details.pincode,
    giftWrap: store.giftWrap,
    giftMessage: store.giftMessage || undefined,
  });

  async function review() {
    setState({ kind: "loading", message: "Checking stock and delivery options…" });
    try {
      const response = await fetch("/api/commerce/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload()) });
      const result = await response.json() as { ok: boolean; message?: string; details?: { blockers?: ApiState["blockers"] }; blockers?: ApiState["blockers"]; quote?: ApiState["quote"] };
      if (!response.ok) {
        setState({ kind: response.status === 409 ? "blocked" : "error", message: response.status === 409 ? "One or more items are currently unavailable. Please update your bag and try again." : result.message ?? "Checkout review could not complete." });
        return;
      }
      setState({ kind: "ready", message: "Your delivery and order total are ready.", quote: result.quote });
    } catch {
      setState({ kind: "error", message: "Secure checkout services are temporarily unavailable." });
    }
  }

  async function startPayment() {
    if (state.kind !== "ready") return;
    setState((current) => ({ ...current, kind: "loading", message: "Creating a secure payment order…" }));
    const idempotencyKey = crypto.randomUUID();
    try {
      const response = await fetch("/api/commerce/orders/start", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
        body: JSON.stringify({ ...payload(), email: details.email, address: {
          label: "Home", recipientName: details.recipientName, phone: details.phone, line1: details.line1,
          line2: details.line2 || undefined, city: details.city, state: details.state, pincode: details.pincode, isDefault: false,
        } }),
      });
      const result = await response.json() as { ok: boolean; message?: string; providerOrderId?: string; amountPaise?: number; currency?: string; keyId?: string; orderNumber?: string };
      if (!response.ok || !result.providerOrderId || !result.keyId) { setState({ kind: "error", message: result.message ?? "Payment could not be started. No payment was taken." }); return; }
      if (!(await loadRazorpay())) { setState({ kind: "error", message: "The payment window could not load. No payment was taken." }); return; }
      const Razorpay = (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      new Razorpay({
        key: result.keyId, amount: result.amountPaise, currency: result.currency, order_id: result.providerOrderId,
        name: "Dharohar", description: `Order ${result.orderNumber}`,
        prefill: { name: details.recipientName, email: details.email, contact: details.phone },
        handler: () => setState({ kind: "ready", message: `Payment submitted for ${result.orderNumber}. We are confirming your order.`, quote: state.quote }),
        modal: { ondismiss: () => setState({ kind: "ready", message: "Payment window closed. The reservation will expire automatically if unpaid.", quote: state.quote }) },
        theme: { color: "#6f2436" },
      }).open();
    } catch { setState({ kind: "error", message: "Payment could not be started safely. No payment was taken." }); }
  }

  if (!lines.length) return <div className="checkout-empty"><p>Your selection bag is empty.</p><Link className="button button-wine" href="/collections/all">Browse all pieces</Link></div>;
  return <div className="checkout-layout">
    <form className="brief-form checkout-form" onSubmit={(event) => { event.preventDefault(); void review(); }}>
      <div className="checkout-step"><span>01</span><div><strong>Delivery address</strong><small>Choose a saved address or enter a new one.</small></div></div>
      {addresses.length ? <div className="saved-address-choice" aria-label="Saved delivery addresses">{addresses.map((address) => <button type="button" key={address.id} onClick={() => selectAddress(address)}><strong>{address.label}{address.is_default ? " · Default" : ""}</strong><span>{address.recipient_name}</span><small>{address.line1}, {address.city} {address.pincode}</small></button>)}</div> : accountReady ? <p className="checkout-account-note"><Link href="/account">Sign in or create an account</Link> to use saved addresses and see your orders.</p> : null}
      <div className="form-grid">
        <label>Full name<input required autoComplete="name" value={details.recipientName ?? ""} onChange={(event) => setDetails({ ...details, recipientName: event.target.value })} /></label>
        <label>Email<input required type="email" autoComplete="email" value={details.email ?? ""} onChange={(event) => setDetails({ ...details, email: event.target.value })} /></label>
        <label>Phone<input required type="tel" autoComplete="tel" pattern="[+]?[0-9\s-]{10,16}" value={details.phone ?? ""} onChange={(event) => setDetails({ ...details, phone: event.target.value })} /></label>
        <label>Address line 1<input required autoComplete="address-line1" value={details.line1 ?? ""} onChange={(event) => setDetails({ ...details, line1: event.target.value })} /></label>
        <label>Apartment, floor or landmark (optional)<input autoComplete="address-line2" value={details.line2 ?? ""} onChange={(event) => setDetails({ ...details, line2: event.target.value })} /></label>
        <label>Pincode<input required inputMode="numeric" maxLength={6} pattern="[0-9]{6}" autoComplete="postal-code" value={details.pincode ?? ""} onChange={(event) => setDetails({ ...details, pincode: event.target.value.replace(/\D/g, "") })} />{pincodeStatus ? <small className="field-status">{pincodeStatus}</small> : null}</label>
        <label>City<input required autoComplete="address-level2" value={details.city ?? ""} onChange={(event) => setDetails({ ...details, city: event.target.value })} /></label>
        <label>State<input required autoComplete="address-level1" value={details.state ?? ""} onChange={(event) => setDetails({ ...details, state: event.target.value })} /></label>
      </div>
      <label className="consent-field"><input type="checkbox" required /><span>I agree to the Terms, Privacy Notice and published Shipping & Returns policy. I understand the payable total is calculated by the server.</span></label>
      <button className="button button-wine" disabled={state.kind === "loading"} type="submit"><LockKeyhole size={16} /> Review secure checkout</button>
    </form>
    <aside className="checkout-summary">
      <p className="eyebrow">Order review</p>
      <ul>{lines.map((line) => <li key={line.slug}><span>{line.product!.name} × {line.quantity}</span><strong>{formatMoney(line.product!.sellingPricePaise * line.quantity)}</strong></li>)}</ul>
      <dl className="checkout-totals checkout-preview-totals"><div><dt>Products</dt><dd>{formatMoney(indicativeTotal)}</dd></div><div><dt>GST (5%)</dt><dd>{formatMoney(indicativeTax)}</dd></div><div><dt>Before delivery</dt><dd>{formatMoney(indicativeTotal + indicativeTax)}</dd></div></dl>
      <small>Delivery charges are calculated for your pincode before payment.</small>
      {state.message ? <div className={`checkout-status checkout-${state.kind}`} role="status">{state.kind === "blocked" || state.kind === "error" ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}<p>{state.message}</p></div> : null}
      {state.quote ? <dl className="checkout-totals"><div><dt>Products</dt><dd>{formatMoney(state.quote.subtotalPaise)}</dd></div><div><dt>GST</dt><dd>{formatMoney(state.quote.taxPaise)}</dd></div><div><dt>Shipping</dt><dd>{formatMoney(state.quote.shippingPaise)}</dd></div><div><dt>Total</dt><dd>{formatMoney(state.quote.totalPaise)}</dd></div></dl> : null}
      {state.kind === "ready" && state.quote ? <button className="button button-wine" type="button" onClick={() => void startPayment()}>Continue to secure payment</button> : null}
    </aside>
  </div>;
}
