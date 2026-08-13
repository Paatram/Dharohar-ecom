"use client";

import { FileDown } from "lucide-react";
import { useMemo, useState } from "react";

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
  const readiness = useMemo(() => quantity && date ? "The quantity and required date are ready for feasibility review." : "Add quantity and date so fulfilment feasibility can be assessed.", [quantity, date]);
  return <form className="brief-form" onSubmit={(event) => { event.preventDefault(); const nextReference = createReference("DH-BRIEF"); setReference(nextReference); setDraft(formatDraft("PROJECT BRIEF", nextReference, event.currentTarget)); setReady(true); }}>
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
      <label>Indicative budget<select name="budget"><option>To be discussed</option><option>Under ₹50,000</option><option>₹50,000–₹2,00,000</option><option>₹2,00,000–₹5,00,000</option><option>Above ₹5,00,000</option></select></label>
    </div>
    <label>Products, finish, presentation or customisation brief<textarea name="brief" rows={6} placeholder="Tell us what is being sourced, how it will be used, and any packaging or engraving requirements." required /></label>
    <label>Reference filename or shared-drive link<input name="reference" placeholder="Uploads activate with secure lead storage" /></label>
    <p className="form-readiness">{readiness}</p>
    <label className="consent-field"><input type="checkbox" required /><span>I understand this preview validates the brief in my browser but does not transmit personal data until Dharohar activates its owned, privacy-compliant enquiry channel.</span></label>
    <button className="button button-wine" type="submit">Validate project brief</button>
    {ready ? <div className="form-success" role="status"><strong>Your brief is ready · {reference}</strong><p>No data was transmitted. Download the validated brief and keep it ready for the monitored business channel.</p><button className="button button-outline draft-download" type="button" onClick={() => downloadDraft(`${reference}.txt`, draft)}><FileDown size={16} aria-hidden="true" /> Download brief</button></div> : null}
  </form>;
}

export function TrackingForm() {
  const [message, setMessage] = useState("");
  return <form className="tracking-form" onSubmit={(event) => { event.preventDefault(); setMessage("No live order lookup is connected in this preview. Tracking activates with authenticated order and carrier data."); }}><label htmlFor="order-number">Order number</label><div><input id="order-number" name="order" placeholder="DH-000000" required /><button className="button button-wine" type="submit">Find order</button></div>{message ? <p role="status">{message}</p> : null}</form>;
}

export function ContactForm({ subject }: { subject?: string }) {
  const [complete, setComplete] = useState(false);
  const [reference, setReference] = useState("");
  const [draft, setDraft] = useState("");
  return <form className="brief-form compact-form" onSubmit={(event) => { event.preventDefault(); const nextReference = createReference("DH-ENQUIRY"); setReference(nextReference); setDraft(formatDraft("CUSTOMER ENQUIRY", nextReference, event.currentTarget)); setComplete(true); }}>
    <div className="form-grid"><label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label></div>
    <label>Subject<input name="subject" defaultValue={subject} required /></label>
    <label>Question or enquiry<textarea name="message" rows={6} required /></label>
    <label className="consent-field"><input type="checkbox" required /><span>I understand this preview validates the enquiry in my browser but does not transmit it until Dharohar activates its monitored contact channel.</span></label>
    <button className="button button-wine" type="submit">Validate enquiry</button>
    {complete ? <div className="form-success" role="status"><strong>Your enquiry draft is ready · {reference}</strong><p>It has not been sent. Download it now; live transmission still requires a verified business inbox and privacy-controlled lead endpoint.</p><button className="button button-outline draft-download" type="button" onClick={() => downloadDraft(`${reference}.txt`, draft)}><FileDown size={16} aria-hidden="true" /> Download enquiry</button></div> : null}
  </form>;
}
