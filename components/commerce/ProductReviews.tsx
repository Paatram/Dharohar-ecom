"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Review = { id: string; rating: number; title: string; body: string; reviewerName: string; createdAt: number };
type ReviewResponse = { ok: boolean; reviews?: Review[]; summary?: { average: number; count: number }; canReview?: boolean; message?: string };

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const [data, setData] = useState<ReviewResponse>({ ok: true, reviews: [], summary: { average: 0, count: 0 } });
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/commerce/reviews?product=${encodeURIComponent(productSlug)}`, { cache: "no-store" });
      const result = await response.json() as ReviewResponse;
      if (response.ok) setData(result);
    } finally { setLoading(false); }
  }, [productSlug]);

  useEffect(() => { void load(); }, [load]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting your review…");
    const response = await fetch("/api/commerce/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productSlug, rating, title, body }),
    });
    const result = await response.json() as { message?: string };
    if (!response.ok) {
      setStatus(response.status === 401 ? "Please sign in to review a delivered purchase." : result.message ?? "Your review could not be submitted.");
      return;
    }
    setTitle(""); setBody(""); setStatus("Thank you. Your verified-purchase review is now published.");
    await load();
  }

  const reviews = data.reviews ?? [];
  const summary = data.summary ?? { average: 0, count: 0 };
  return <section className="product-reviews shell" aria-labelledby="reviews-heading">
    <div className="reviews-heading">
      <div><p className="eyebrow">Customer reviews</p><h2 id="reviews-heading">What owners say</h2></div>
      <div className="review-summary" aria-label={`${summary.average} out of 5 from ${summary.count} reviews`}>
        <strong>{summary.count ? summary.average.toFixed(1) : "—"}</strong>
        <span><Star size={16} fill="currentColor" aria-hidden="true" /> {summary.count} {summary.count === 1 ? "review" : "reviews"}</span>
      </div>
    </div>
    <div className="reviews-layout">
      <div className="review-list">
        {loading ? <p>Loading reviews…</p> : reviews.length ? reviews.map((review) => <article key={review.id}>
          <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"} aria-hidden="true" />)}</div>
          <h3>{review.title}</h3><p>{review.body}</p><small>{review.reviewerName} · Verified buyer · {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</small>
        </article>) : <div className="review-empty"><h3>No reviews yet</h3><p>Be the first verified buyer to share an experience with this piece.</p></div>}
      </div>
      <form className="review-form" onSubmit={submit}>
        <h3>Write a review</h3>
        <p>Reviews are available to signed-in customers after delivery.</p>
        <fieldset><legend>Your rating</legend><div className="rating-input">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}><Star size={22} fill={value <= rating ? "currentColor" : "none"} /></button>)}</div></fieldset>
        <label>Review title<input required minLength={3} maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>Your review<textarea required minLength={20} maxLength={1200} rows={5} value={body} onChange={(event) => setBody(event.target.value)} /></label>
        <button className="button button-wine" type="submit">Submit review</button>
        <Link href="/account">Sign in or view your orders</Link>
        {status ? <p role="status">{status}</p> : null}
      </form>
    </div>
  </section>;
}
