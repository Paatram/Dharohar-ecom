"use client";

import { useMemo, useState } from "react";

const serviceLabels: Record<string, string> = {
  hospitality: "Hotels & hospitality",
  restaurants: "Restaurants",
  offices: "Offices & institutions",
  "interior-designers": "Interior design projects",
  "corporate-gifting": "Corporate gifting",
  weddings: "Wedding gifting",
};

export function BriefForm({ initialService = "hospitality" }: { initialService?: string }) {
  const [ready, setReady] = useState(false);
  const [service, setService] = useState(serviceLabels[initialService] ? initialService : "hospitality");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const readiness = useMemo(() => quantity && date ? "The quantity and required date are ready for feasibility review." : "Add quantity and date so fulfilment feasibility can be assessed.", [quantity, date]);
  return <form className="brief-form" onSubmit={(event) => { event.preventDefault(); setReady(true); }}>
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
    {ready ? <div className="form-success" role="status"><strong>Your brief is complete.</strong><p>No data was transmitted. When the monitored business channel is connected, this same form will submit securely and issue a reference number.</p></div> : null}
  </form>;
}

export function TrackingForm() {
  const [message, setMessage] = useState("");
  return <form className="tracking-form" onSubmit={(event) => { event.preventDefault(); setMessage("No live order lookup is connected in this preview. Tracking activates with authenticated order and carrier data."); }}><label htmlFor="order-number">Order number</label><div><input id="order-number" name="order" placeholder="DH-000000" required /><button className="button button-wine" type="submit">Find order</button></div>{message ? <p role="status">{message}</p> : null}</form>;
}

export function ContactForm({ subject }: { subject?: string }) {
  const [complete, setComplete] = useState(false);
  return <form className="brief-form compact-form" onSubmit={(event) => { event.preventDefault(); setComplete(true); }}>
    <div className="form-grid"><label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label></div>
    <label>Subject<input name="subject" defaultValue={subject} required /></label>
    <label>Question or enquiry<textarea name="message" rows={6} required /></label>
    <label className="consent-field"><input type="checkbox" required /><span>I understand this preview validates the enquiry in my browser but does not transmit it until Dharohar activates its monitored contact channel.</span></label>
    <button className="button button-wine" type="submit">Validate enquiry</button>
    {complete ? <div className="form-success" role="status"><strong>Your enquiry is complete but has not been sent.</strong><p>A verified business inbox and privacy-controlled lead endpoint are still required for transmission.</p></div> : null}
  </form>;
}
