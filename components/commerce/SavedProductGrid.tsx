"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/storefront/ProductCard";
import { findProduct, formatInr, products } from "@/lib/catalog";
import { materialLabels, productUse } from "@/lib/merchandising";
import { useStore } from "./StoreProvider";

export function WishlistGrid() {
  const { wishlist } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.slug));
  return saved.length ? <div className="product-grid product-grid-light">{saved.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="empty-state saved-empty"><strong>No saved pieces yet.</strong><p>Use the heart on any product to build a private shortlist on this device.</p><Link href="/collections/all">Explore all products</Link></div>;
}

export function ComparisonTable() {
  const { compare, toggleCompare } = useStore();
  const selected = products.filter((product) => compare.includes(product.slug));
  if (!selected.length) return <div className="empty-state saved-empty"><strong>Your comparison is empty.</strong><p>Add up to three pieces using the compare control on product cards.</p><Link href="/collections/all">Choose products</Link></div>;
  const rows = [
    ["Material", (slug: string) => {
      const product = products.find((item) => item.slug === slug)!;
      return product.materialDetail ?? materialLabels[product.material];
    }],
    ["Finish", (slug: string) => products.find((product) => product.slug === slug)!.finish],
    ["Use", (slug: string) => productUse(products.find((product) => product.slug === slug)!).join(", ")],
    ["Price", (slug: string) => formatInr(products.find((product) => product.slug === slug)!.sellingPricePaise)],
  ] as const;
  return <div className="comparison-wrap"><table className="comparison-table"><thead><tr><th>Compare</th>{selected.map((product) => <th key={product.slug}><Link href={`/products/${product.slug}`}>{product.name}</Link><button type="button" onClick={() => toggleCompare(product.slug)}>Remove</button></th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><th>{label}</th>{selected.map((product) => <td key={product.slug}>{value(product.slug)}</td>)}</tr>)}</tbody></table></div>;
}

export function BagPage() {
  const { cart, setQuantity, removeFromCart } = useStore();
  const lines = cart.map((line) => ({ ...line, product: findProduct(line.slug) })).filter((line): line is typeof line & { product: NonNullable<typeof line.product> } => Boolean(line.product));
  const subtotal = lines.reduce((total, line) => total + line.product.sellingPricePaise * line.quantity, 0);
  const tax = Math.round(subtotal * .05);
  if (!lines.length) return <div className="empty-state saved-empty"><strong>Your selection bag is empty.</strong><p>Add products to plan a purchase or enquiry on this device.</p><Link href="/collections/all">Explore all products</Link></div>;
  return <div className="bag-page"><section>{lines.map(({ product, quantity }) => <article key={product.slug}><Image src={product.image} alt="" width={130} height={150} /><div><p className="eyebrow">{product.finish}</p><h2><Link href={`/products/${product.slug}`}>{product.name}</Link></h2><strong>{formatInr(product.sellingPricePaise)}</strong><div className="quantity-control"><button type="button" onClick={() => setQuantity(product.slug, quantity - 1)}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(product.slug, quantity + 1)}>+</button><button type="button" onClick={() => removeFromCart(product.slug)}>Remove</button></div></div></article>)}</section><aside><p className="eyebrow">Order summary</p><div><span>Products</span><strong>{formatInr(subtotal)}</strong></div><div><span>GST (5%)</span><strong>{formatInr(tax)}</strong></div><div><span>Before delivery</span><strong>{formatInr(subtotal + tax)}</strong></div><p>Delivery is calculated from your address at checkout.</p><Link className="button button-wine" href="/checkout">Continue to checkout</Link></aside></div>;
}
