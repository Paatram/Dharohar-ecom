"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductGalleryImage } from "@/lib/catalog";

export function ProductGallery({ images, productName }: { images: ProductGalleryImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return <div className="product-gallery" aria-label={`${productName} image gallery`}>
    <div className="product-main-image">
      <Image key={active.src} src={active.src} alt={`${productName} — ${active.label}`} fill priority sizes="(max-width: 900px) 100vw, 58vw" />
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
