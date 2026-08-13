import type { Metadata } from "next";
import { ContentPage } from "@/components/storefront/ContentPage";
const faqs = [
  ["Can I buy from the preview?", "Not yet. You can save, compare and place products in a device-saved selection bag. Payment activates only after every launch gate is verified."],
  ["Are the displayed prices final?", "They are the supplied indicative selling prices. GST treatment, shipping and commercial activation are still under review."],
  ["How do I know which metal to choose?", "Begin with the intended use and care commitment, then check the exact product composition, lining, dimensions and compatibility once verified."],
  ["Will every product look identical?", "Hand-finished metalware naturally varies. Exact tolerances and the difference between expected variation and a quality issue will be documented before sale."],
  ["Do you support hotels, restaurants and designers?", "Yes. The trade route collects quantity, destination, deadline, GST and customisation context for a feasibility-led quotation."],
  ["Can gifts be personalised?", "Messages, packaging and engraving are planned, but each option, cost, proof and lead time must be confirmed before it is promised."],
  ["How will returns work?", "Return eligibility will be specific to the product and order. The final policy will explain windows, exclusions, inspection, reverse pickup and refund timing before checkout opens."],
  ["Do you make health claims about traditional metals?", "No unsupported therapeutic or medical claims are used. Dharohar focuses on verified composition, intended use and care."],
] as const;
export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers about Dharohar products, materials, launch readiness, gifting, trade and care.", alternates: { canonical: "/faq" } };
export default function FaqPage() { const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }; return <ContentPage eyebrow="Questions, answered plainly" title="What to know before Dharohar commerce opens." introduction="Clear answers about the preview, products, gifting, trade and the standards that govern launch."><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></ContentPage>; }
