"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { ProductGalleryImage } from "@/lib/catalog";

export function ProductGallery({ images, productName }: { images: ProductGalleryImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const active = images[activeIndex] ?? images[0];
  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + images.length) % images.length);
  };

  return <div className="product-gallery" aria-label={`${productName} image gallery`}>
    <div
      className="product-main-image"
      role="group"
      aria-label={`${active.label}, image ${activeIndex + 1} of ${images.length}`}
    >
      <button
        className="product-image-swipe-surface"
        type="button"
        aria-label={`View next ${productName} image`}
        onClick={() => move(1)}
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(distance) < 40) return;
          event.preventDefault();
          move(distance > 0 ? -1 : 1);
        }}
      >
        <Image key={active.src} src={active.src} alt={active.alt} fill priority sizes="(max-width: 900px) 100vw, 58vw" />
      </button>
      {images.length > 1 ? <>
        <button className="product-gallery-nav previous" type="button" onClick={() => move(-1)} aria-label={`Previous ${productName} image`}>
          <ChevronLeft aria-hidden="true" size={24} strokeWidth={1.7} />
        </button>
        <button className="product-gallery-nav next" type="button" onClick={() => move(1)} aria-label={`Next ${productName} image`}>
          <ChevronRight aria-hidden="true" size={24} strokeWidth={1.7} />
        </button>
      </> : null}
      <span className="product-image-counter">{activeIndex + 1} / {images.length}</span>
    </div>
    <div className="product-thumbnails" role="list">
      {images.map((image, index) => <button
        key={`${image.src}-${index}`}
        className={index === activeIndex ? "active" : ""}
        type="button"
        onClick={() => setActiveIndex(index)}
        aria-label={`View ${image.label}`}
        aria-pressed={index === activeIndex}
      >
        <Image src={image.src} alt="" fill sizes="120px" />
        <span>{image.label}</span>
      </button>)}
    </div>
  </div>;
}
