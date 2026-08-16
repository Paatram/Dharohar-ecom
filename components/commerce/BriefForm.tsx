"use client";

import { FileDown } from "lucide-react";
import { useState } from "react";

const serviceLabels: Record<string, string> = {
  hospitality: "Hotels & hospitality",
  restaurants: "Restaurants",
  offices: "Offices & institutions",
  "interior-designers": "Interior design projects",
  "corporate-gifting": "Corporate gifting",
  weddings: "Wedding gifting",
};

function createReference(prefix: string) {
  const now = new Date();
  return `${prefix}-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${now.getTime().toString().slice(-5)}`;
}

function downloadDraft(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function formatDraft(title: string, reference: string, form: HTMLFormElement) {
  const values = new FormData(form);
  const lines = Array.from(values.entries())
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}: ${String(value).trim()}`);
  return [`DHAROHAR — ${title}`, `Reference: ${reference}`, `Prepared: ${new Date().toLocaleString("en-IN")}`, "", ...lines, "", "This is a customer-prepared draft. It has not been transmitted to Dharohar."].join("\n");
}

export function BriefForm({ initialService = "hospitality" }: { initialService?: string }) {
  const [ready, setReady] = useState(false);
  const [reference, setReference] = useState("");
  const [draft, setDraft] = useState("");
  const [service, setService] = useState(serviceLabels[initialService] ? initialService : "hospitality");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [stored, setStored] = useState(false);
  return <form className="brief-form" onSubmit={async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const localReference = createReference("DH-BRIEF");
    setDraft(formatDraft("PROJECT BRIEF", localReference, form));
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/commerce/enquiries", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify({ kind: "trade", name: values.name, email: values.email, subject: `${serviceLabels[service]} project brief`, payload: values, consent: true }) });
      const result = await response.json() as { reference?: string };
      if (!response.ok) throw new Error();
      setReference(result.reference ?? localReference); setStored(true);
    } catch { setReference(localReference); setStored(false); }
    setReady(true);
  }}>
    <div className="form-grid">
      <label>Project type<select name="service" value={service} onChange={(event) => setService(event.target.value)}>{Object.entries(serviceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Organisation<input name="organisation" autoComplete="organization" placeholder="Company or studio name" required /></label>
      <label>Contact name<input name="name" autoComplete="name" required /></label>
      <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>GSTIN, if applicable<input name="gstin" inputMode="text" pattern="[0-9A-Z]{15}" placeholder="15-character GSTIN" /></label>
      <label>Approximate quantity<input name="quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label>
      <label>Required by<input name="requiredDate" type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
      <label>Delivery city / pincode<input name="destination" required /></label>
      <label>Budget range<select name="budget"><option>To be discussed</option><option>Under ₹50,000</option><option>₹50,000–₹2,00,000</option><option>₹2,00,000–₹5,00,000</option><option>Above ₹5,00,000</option></select></label>
    </div>
    <label>Products, finish, presentation or customisation brief<textarea name="brief" rows={6} placeholder="Tell us what is being sourced, how it will be used, and any packaging or engraving requirements." required /></label>
    <label>Reference link (optional)<input name="reference" placeholder="Paste a shared moodboard or reference link" /></label>
    <label className="consent-field"><input type="checkbox" required /><span>I consent to Dharohar storing this brief to respond to my project enquiry, subject to the Privacy Notice.</span></label>
    <button className="button button-wine" type="submit">Submit project brief</button>
    {ready ? <div className="form-success" role="status"><strong>{stored ? "Brief received" : "Brief could not be submitted"} · {reference}</strong><p>{stored ? "Thank you. Keep this reference for your conversation with Dharohar." : "Download your draft and try again later."}</p><button className="button button-outline draft-download" type="button" onClick={() => downloadDraft(`${reference}.txt`, draft)}><FileDown size={16} aria-hidden="true" /> Download brief</button></div> : null}
  </form>;
}

export function TrackingForm() {
  const [message, setMessage] = useState("");
  return <form className="tracking-form" onSubmit={async (event) => { event.preventDefault(); const values = new FormData(event.currentTarget); try { const response = await fetch("/api/commerce/orders/track", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderNumber: values.get("order"), email: values.get("email") }) }); const result = await response.json() as { message?: string; order?: { status: string; fulfillment_status: string }; shipment?: { courier?: string; status?: string } }; setMessage(response.ok ? `Order ${result.order?.status.replaceAll("_", " ")} · Fulfilment ${result.order?.fulfillment_status.replaceAll("_", " ")}${result.shipment?.courier ? ` · ${result.shipment.courier}: ${result.shipment.status}` : ""}` : result.message ?? "No order matched those details."); } catch { setMessage("Secure order lookup is temporarily unavailable."); } }}><label htmlFor="order-number">Order number</label><div><input id="order-number" name="order" placeholder="DH-20260814-AB12CD34" required /><input name="email" type="email" autoComplete="email" placeholder="Order email" aria-label="Order email" required /><button className="button button-wine" type="submit">Find order</button></div>{message ? <p role="status">{message}</p> : null}</form>;
}

export function ContactForm({ subject }: { subject?: string }) {
  const [complete, setComplete] = useState(false);
  const [reference, setReference] = useState("");
  const [draft, setDraft] = useState("");
  const [stored, setStored] = useState(false);
  return <form className="brief-form compact-form" onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const localReference = createReference("DH-ENQUIRY"); setDraft(formatDraft("CUSTOMER ENQUIRY", localReference, form)); const values = Object.fromEntries(new FormData(form).entries()); try { const response = await fetch("/api/commerce/enquiries", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify({ kind: "retail", name: values.name, email: values.email, subject: values.subject, payload: { message: values.message }, consent: true }) }); const result = await response.json() as { reference?: string }; if (!response.ok) throw new Error(); setReference(result.reference ?? localReference); setStored(true); } catch { setReference(localReference); setStored(false); } setComplete(true); }}>
    <div className="form-grid"><label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label></div>
    <label>Subject<input name="subject" defaultValue={subject} required /></label>
    <label>Question or enquiry<textarea name="message" rows={6} required /></label>
    <label className="consent-field"><input type="checkbox" required /><span>I consent to Dharohar storing this enquiry to respond, subject to the Privacy Notice.</span></label>
    <button className="button button-wine" type="submit">Submit enquiry</button>
    {complete ? <div className="form-success" role="status"><strong>{stored ? "Enquiry received" : "Enquiry could not be submitted"} · {reference}</strong><p>{stored ? "Thank you. Keep this reference if you need to follow up." : "Download your draft and try again later."}</p><button className="button button-outline draft-download" type="button" onClick={() => downloadDraft(`${reference}.txt`, draft)}><FileDown size={16} aria-hidden="true" /> Download enquiry</button></div> : null}
  </form>;
}
