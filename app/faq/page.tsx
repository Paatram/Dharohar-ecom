import type { Metadata } from "next";
import { ContentPage } from "@/components/storefront/ContentPage";
const faqs = [
  ["How is GST calculated?", "A 5% GST is added to the product subtotal and shown separately in your order summary before payment."],
  ["How is delivery calculated?", "Enter a six-digit pincode at checkout. Available courier options and delivery charges are calculated for that address before payment."],
  ["Can I save more than one address?", "Yes. Sign in to save home, office and other delivery addresses, then choose one during checkout."],
  ["How do I know which metal to choose?", "Start with how the object will be used and how much care you prefer. Our material guide and product details can help you compare copper, peetal and kansa."],
  ["Will every product look identical?", "Hand-finished metalware can show subtle tonal and surface variation. This is part of the character of traditionally finished metal."],
  ["Do you support hotels, restaurants and designers?", "Yes. Share quantity, destination, required date and customisation needs through the trade enquiry route."],
  ["How can I write a review?", "Signed-in customers can review an item after their paid order has been delivered. Reviews are moderated before publication."],
  ["Do you make health claims about traditional metals?", "No unsupported therapeutic or medical claims are used. Dharohar focuses on material, intended use and care."],
] as const;
export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers about Dharohar products, delivery, accounts, gifting, trade and care.", alternates: { canonical: "/faq" } };
export default function FaqPage() { const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }; return <ContentPage eyebrow="Questions, answered plainly" title="How can we help?" introduction="Clear answers about products, checkout, delivery, accounts and care."><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></ContentPage>; }
