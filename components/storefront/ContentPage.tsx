import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
};

export function ContentPage({ eyebrow, title, introduction, children }: ContentPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <header className="content-hero">
          <div className="shell">
            <p className="eyebrow eyebrow-gold">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{introduction}</p>
          </div>
        </header>
        <div className="shell content-body">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="content-section"><h2>{title}</h2><div>{children}</div></section>;
}
