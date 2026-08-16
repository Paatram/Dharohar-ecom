"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";

const slides = [
  {
    eyebrow: "The Dharohar collection",
    title: <>The Heritage Kitchen, <em>Reimagined.</em></>,
    description: "Metalware chosen for how you cook, host, work and gift—presented with the clarity a modern purchase deserves.",
    image: "/images/dharohar/brand/dharohar-hero-tableau.webp",
    alt: "A considered Dharohar table setting with brass and copper vessels",
    position: "center 54%",
    primary: { label: "Shop the collection", href: "#shop-collection" },
    secondary: { label: "Choose by space", href: "#shop-by-space" },
  },
  {
    eyebrow: "Made for households",
    title: <>Objects for the <em>family table.</em></>,
    description: "Everyday cookware, serveware and drinking vessels selected to become part of the rituals that make a home.",
    image: "/images/dharohar/commissions/homes-collectors.webp",
    alt: "Dharohar metalware arranged for a warm household setting",
    position: "center 52%",
    primary: { label: "Shop for households", href: "/shop-for/households" },
    secondary: { label: "Explore care plans", href: "/care#plans" },
  },
  {
    eyebrow: "For restaurants & hotels",
    title: <>Hospitality with <em>material memory.</em></>,
    description: "Distinctive service pieces for tables, suites and shared spaces—with quantities and requirements handled as a project.",
    image: "/images/dharohar/commissions/restaurants-hotels.webp",
    alt: "Heritage metalware styled for a premium hospitality setting",
    position: "center 49%",
    primary: { label: "Explore hospitality", href: "/shop-for/hotels" },
    secondary: { label: "Prepare a trade brief", href: "/trade" },
  },
  {
    eyebrow: "Personal & corporate gifting",
    title: <>Gifts that enter <em>daily life.</em></>,
    description: "Considered objects for weddings, teams and institutions, with coordinated presentation, personalisation and fulfilment.",
    image: "/images/dharohar/commissions/weddings-gifting.webp",
    alt: "Dharohar heritage pieces prepared as meaningful gifts",
    position: "center 55%",
    primary: { label: "Explore gifting", href: "/shop-for/gifting" },
    secondary: { label: "Corporate gifting", href: "/gifting" },
  },
] as const;

const quickLinks = [
  ["Made for", "Homes & families", "/shop-for/households"],
  ["For work", "Offices & teams", "/shop-for/offices"],
  ["For service", "Restaurants & hotels", "/shop-for/restaurants"],
  ["For projects", "Designers & gifting", "/shop-for/interior-designers"],
] as const;

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const move = useCallback((direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section
      className="hero storefront-hero hero-carousel"
      aria-label="Dharohar featured collections"
      aria-roledescription="carousel"
    >
      <div
        className="storefront-hero-slide"
        key={slide.image}
        role="group"
        aria-label={`${activeSlide + 1} of ${slides.length}`}
        aria-roledescription="slide"
      >
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          priority={activeSlide === 0}
          sizes="100vw"
          style={{ objectPosition: slide.position }}
        />
        <div className="hero-shade" />
        <div className="shell storefront-hero-layout">
          <div className="storefront-hero-content">
            <p className="eyebrow eyebrow-gold">{slide.eyebrow}</p>
            <h1 id="storefront-hero-title">{slide.title}</h1>
            <p className="hero-intro">{slide.description}</p>
            <div className="hero-actions">
              <Link className="button button-gold" href={slide.primary.href}>{slide.primary.label}</Link>
              <Link className="button button-ghost" href={slide.secondary.href}>{slide.secondary.label}</Link>
            </div>
          </div>
        </div>
      </div>

      <button className="hero-carousel-arrow hero-carousel-previous" type="button" aria-label="Previous featured collection" onClick={() => move(-1)} onKeyDown={(event) => { if (event.key === "ArrowRight") move(1); }}>
        <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.6} />
      </button>
      <button className="hero-carousel-arrow hero-carousel-next" type="button" aria-label="Next featured collection" onClick={() => move(1)} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); }}>
        <ArrowRight aria-hidden="true" size={20} strokeWidth={1.6} />
      </button>

      <div className="hero-carousel-progress" aria-label="Choose a featured collection">
        <span>{String(activeSlide + 1).padStart(2, "0")}</span>
        <div>
          {slides.map((item, index) => (
            <button
              className={index === activeSlide ? "is-active" : ""}
              type="button"
              key={item.eyebrow}
              aria-current={index === activeSlide ? "true" : undefined}
              aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      <nav className="shell hero-shop-finder" aria-label="Quick ways to shop">
        {quickLinks.map(([eyebrow, label, href]) => (
          <Link href={href} key={label}><small>{eyebrow}</small><strong>{label}</strong></Link>
        ))}
        <Link className="hero-shop-finder-go" href="#shop-by-space" aria-label="Explore all spaces"><span aria-hidden="true">→</span></Link>
      </nav>
    </section>
  );
}
