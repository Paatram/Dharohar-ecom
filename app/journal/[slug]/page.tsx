import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
import { findGuide, guides } from "@/lib/guides";
export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = findGuide((await params).slug); return guide ? { title: guide.title, description: guide.excerpt, alternates: { canonical: `/journal/${guide.slug}` } } : {}; }
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) { const guide = findGuide((await params).slug); if (!guide) notFound(); return <ContentPage eyebrow="Dharohar journal" title={guide.title} introduction={guide.excerpt}>{guide.sections.map((section) => <ContentSection title={section.title} key={section.title}><p>{section.body}</p></ContentSection>)}<aside className="content-notice"><strong>Exact product facts prevail</strong><p>This guide is general decision support. Follow the verified material, compatibility and care information supplied with the exact product.</p></aside><p><Link className="button button-wine" href="/collections/all">Explore products</Link> <Link className="button button-outline" href="/journal">All guides</Link></p></ContentPage>; }
