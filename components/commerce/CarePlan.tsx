"use client";

import { BellRing, CalendarCheck, Check, HeartHandshake, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Material = "copper" | "peetal" | "kansa" | "mixed";
type Cadence = "monthly" | "quarterly" | "seasonal";
type CarePlan = { material: Material; cadence: Cadence; lastReviewed: string; nextReview: string };

const storageKey = "dharohar-care-circle-v1";
const materialNames: Record<Material, string> = { copper: "Copper", peetal: "Peetal", kansa: "Kansa", mixed: "A mixed collection" };
const cadenceMonths: Record<Cadence, number> = { monthly: 1, quarterly: 3, seasonal: 6 };

function nextReviewDate(cadence: Cadence) {
  const date = new Date();
  date.setMonth(date.getMonth() + cadenceMonths[cadence]);
  return date.toISOString().slice(0, 10);
}

export function CarePlanBuilder() {
  const [material, setMaterial] = useState<Material>("peetal");
  const [cadence, setCadence] = useState<Cadence>("quarterly");
  const [plan, setPlan] = useState<CarePlan | null>(null);
  const [savedPulse, setSavedPulse] = useState(false);
  const [email, setEmail] = useState("");
  const [reminderConsent, setReminderConsent] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null") as CarePlan | null;
        if (stored?.material && stored?.cadence && stored?.nextReview) setPlan(stored);
      } catch { /* A malformed local plan is safely ignored. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const formattedDate = useMemo(() => plan ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${plan.nextReview}T00:00:00`)) : "", [plan]);

  const save = async () => {
    const now = new Date().toISOString().slice(0, 10);
    const next: CarePlan = { material, cadence, lastReviewed: now, nextReview: nextReviewDate(cadence) };
    localStorage.setItem(storageKey, JSON.stringify(next));
    setPlan(next);
    setSavedPulse(true);
    window.setTimeout(() => setSavedPulse(false), 1000);
    try {
      const response = await fetch("/api/commerce/care", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, plan: cadence, material, reminderConsent }) });
      const result = await response.json() as { message?: string };
      setSyncMessage(response.ok ? "Your care preference is also saved to Dharohar’s private ledger." : result.message ?? "The plan remains saved on this device only.");
    } catch { setSyncMessage("The plan remains saved on this device only."); }
  };
  const remove = () => { localStorage.removeItem(storageKey); setPlan(null); };

  return <section className="care-plan-builder" id="care-plan" aria-labelledby="care-plan-title">
    <div className="care-plan-intro">
      <p className="eyebrow eyebrow-gold">Dharohar Care Circle</p>
      <h2 id="care-plan-title">Keep care close to the object.</h2>
      <p>Create a private care rhythm for your metalware. The plan stays on this device—no account, email address or unverified reminder promise required.</p>
      <ul><li><ShieldCheck size={18} aria-hidden="true" /> Finish-aware guidance</li><li><BellRing size={18} aria-hidden="true" /> A clear next review date</li><li><HeartHandshake size={18} aria-hidden="true" /> Restoration pathway readiness</li></ul>
    </div>
    <div className="care-plan-panel">
      {plan ? <div className={`saved-care-plan ${savedPulse ? "saved-pulse" : ""}`}>
        <div className="care-plan-success-icon"><Check size={25} aria-hidden="true" /></div>
        <p className="eyebrow">Your care rhythm is saved</p>
        <h3>{materialNames[plan.material]}</h3>
        <dl><div><dt>Review rhythm</dt><dd>{plan.cadence}</dd></div><div><dt>Next care review</dt><dd>{formattedDate}</dd></div></dl>
        <p>This is a care review plan, not a claim that every object needs treatment on this date. Always follow the exact product care card.</p>
        {syncMessage ? <p role="status">{syncMessage}</p> : null}
        <div><button type="button" onClick={() => setPlan(null)}><RotateCcw size={15} aria-hidden="true" /> Adjust plan</button><button type="button" onClick={remove}><Trash2 size={15} aria-hidden="true" /> Remove</button></div>
      </div> : <form onSubmit={(event) => { event.preventDefault(); save(); }}>
        <label>What do you care for?<select value={material} onChange={(event) => setMaterial(event.target.value as Material)}><option value="copper">Copper</option><option value="peetal">Peetal</option><option value="kansa">Kansa</option><option value="mixed">A mixed collection</option></select></label>
        <fieldset>
          <legend>Choose a review rhythm</legend>
          <label htmlFor="care-monthly"><input id="care-monthly" type="radio" name="cadence" value="monthly" checked={cadence === "monthly"} onChange={() => setCadence("monthly")} />Monthly<span><small>For frequently handled pieces</small></span></label>
          <label htmlFor="care-quarterly"><input id="care-quarterly" type="radio" name="cadence" value="quarterly" checked={cadence === "quarterly"} onChange={() => setCadence("quarterly")} />Quarterly<span><small>A balanced household rhythm</small></span></label>
          <label htmlFor="care-seasonal"><input id="care-seasonal" type="radio" name="cadence" value="seasonal" checked={cadence === "seasonal"} onChange={() => setCadence("seasonal")} />Twice yearly<span><small>For occasional or ceremonial pieces</small></span></label>
        </fieldset>
        <label>Email for account-safe care continuity<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="care-reminder-consent"><input type="checkbox" checked={reminderConsent} onChange={(event) => setReminderConsent(event.target.checked)} /> Send care reminders only after Dharohar activates a verified messaging provider.</label>
        <button className="button button-gold care-plan-submit" type="submit"><CalendarCheck size={17} aria-hidden="true" /> Save my care plan</button>
        <small>The plan is always saved locally. Server sync is attempted securely; reminders remain disabled without explicit consent and a verified messaging service.</small>
      </form>}
    </div>
  </section>;
}
