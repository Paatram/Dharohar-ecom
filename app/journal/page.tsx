import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/storefront/ContentPage";
import { guides } from "@/lib/guides";
export const metadata: Metadata = { title: "Material & Care Journal", description: "Practical Dharohar guides to choosing, using and caring for traditional metalware.", alternates: { canonical: "/journal" } };
export default function JournalPage() { return <ContentPage eyebrow="Material & care journal" title="Useful knowledge, kept close to the object." introduction="Buying guides, care principles and project notes written to support decisions—not to manufacture unsupported claims."><div className="journal-grid">{guides.map((guide, index) => <article key={guide.slug}><span>0{index + 1}</span><h2><Link href={`/journal/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.excerpt}</p><Link className="text-link" href={`/journal/${guide.slug}`}>Read guide <span aria-hidden="true">→</span></Link></article>)}</div></ContentPage>; }
