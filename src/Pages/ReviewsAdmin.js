import React, { useState } from "react";
import { TWO_GIS_REVIEWS_URL, useReviews } from "../data/ReviewsContext";
import "../Styles/ReviewsAdmin.css";

const initialForm = { name: "", date: "", rating: 5, message: "", source: "2ГИС" };

function ReviewsAdmin() {
  const { reviews, saveReview, deleteReview } = useReviews();
  const [form, setForm] = useState(initialForm);
  const change = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: name === "rating" ? Number(value) : value }));
  const submit = (event) => { event.preventDefault(); saveReview(form); setForm(initialForm); };

  return <section className="admin-page">
    <header className="admin-heading"><div><p>УПРАВЛЕНИЕ КОНТЕНТОМ</p><h1>Отзывы</h1></div><a href={TWO_GIS_REVIEWS_URL} target="_blank" rel="noreferrer">Открыть отзывы в 2ГИС ↗</a></header>
    <div className="reviews-admin-grid">
      <form onSubmit={submit} className="review-admin-form">
        <h2>{form.id ? "Редактировать отзыв" : "Добавить отзыв из 2ГИС"}</h2>
        <label>Имя автора<input name="name" value={form.name} onChange={change} required /></label>
        <label>Дата<input name="date" value={form.date} onChange={change} placeholder="Например, 9 июля 2026" /></label>
        <label>Оценка<select name="rating" value={form.rating} onChange={change}><option value="5">5 звёзд</option><option value="4">4 звезды</option><option value="3">3 звезды</option><option value="2">2 звезды</option><option value="1">1 звезда</option></select></label>
        <label>Текст отзыва<textarea name="message" value={form.message} onChange={change} rows="6" required /></label>
        <p className="review-admin-hint">На сайте показываются только отзывы с оценкой 4 или 5.</p>
        <div className="form-actions"><button type="submit">Сохранить</button>{form.id && <button type="button" className="cancel" onClick={() => setForm(initialForm)}>Отмена</button>}</div>
      </form>
      <div className="admin-reviews">{reviews.map((review) => <article key={review.id}><div className="admin-review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div><h3>{review.name}</h3><small>{review.date} · {review.source}</small><p>{review.message}</p><button type="button" onClick={() => setForm(review)}>Изменить</button><button type="button" className="delete" onClick={() => deleteReview(review.id)}>Удалить</button></article>)}</div>
    </div>
  </section>;
}

export default ReviewsAdmin;
