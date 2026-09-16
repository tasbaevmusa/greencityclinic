import React, { useEffect, useMemo, useState } from "react";
import { TWO_GIS_REVIEWS_URL, useReviews } from "../data/ReviewsContext";
import "../Styles/Reviews.css";
import { useLanguage } from "../i18n/LanguageContext";

function Reviews() {
  const { reviews } = useReviews();
  const { t } = useLanguage();
  const positiveReviews = useMemo(() => reviews.filter((item) => Number(item.rating) >= 4), [reviews]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (positiveReviews.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % positiveReviews.length), 5000);
    return () => window.clearInterval(timer);
  }, [positiveReviews.length]);

  useEffect(() => { if (index >= positiveReviews.length) setIndex(0); }, [index, positiveReviews.length]);
  if (!positiveReviews.length) return null;

  const review = positiveReviews[index];
  const move = (direction) => setIndex((current) => (current + direction + positiveReviews.length) % positiveReviews.length);

  return <section className="review-section" id="reviews">
    <div className="rw-text-content">
      <div className="rw-heading"><div><p className="rw-kicker">{t.reviewsSection.label}</p><h2>{t.reviewsSection.title}</h2></div><a href={TWO_GIS_REVIEWS_URL} target="_blank" rel="noreferrer">{t.reviewsSection.all}</a></div>
      <article className="rw-card" key={review.id}>
        <div className="rw-stars" aria-label={`${review.rating} ${t.reviewsSection.stars}`}>{"★".repeat(review.rating)}<span>{"★".repeat(5 - review.rating)}</span></div>
        <blockquote>«{review.message}»</blockquote>
        <footer><div><strong>{review.name}</strong><small>{review.date} · {t.reviewsSection.source}</small></div><div className="rw-btns"><button type="button" onClick={() => move(-1)} aria-label={t.reviewsSection.previous}>←</button><button type="button" onClick={() => move(1)} aria-label={t.reviewsSection.next}>→</button></div></footer>
      </article>
      <div className="rw-dots" aria-hidden="true">{positiveReviews.map((item, dotIndex) => <span key={item.id} className={dotIndex === index ? "active" : ""} />)}</div>
    </div>
  </section>;
}

export default Reviews;
