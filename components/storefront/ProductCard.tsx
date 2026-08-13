import Image from "next/image";
import Link from "next/link";
import { CatalogProduct, categoryContent, formatInr } from "@/lib/catalog";
import { ProductCardActions } from "@/components/commerce/ProductActions";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="product-card">
      <Link className="product-image" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 620px) 88vw, (max-width: 1024px) 45vw, 25vw"
        />
        <span>{product.material === "brass" ? "Peetal" : product.material === "copper" ? "Tamra" : product.material === "kansa" ? "Kansa" : "Mixed metal"}</span>
      </Link>
      <ProductCardActions slug={product.slug} />
      <div className="product-card-copy">
        <small>{categoryContent[product.category].name} · {product.finish}</small>
        <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
        <p>{product.description}</p>
        <div>
          <strong>{formatInr(product.sellingPricePaise)}</strong>
          <Link href={`/products/${product.slug}`}>View piece <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
