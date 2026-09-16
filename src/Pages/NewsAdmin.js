import React, { useState } from "react";
import { useNews } from "../data/NewsContext";
import "../Styles/NewsAdmin.css";

const initialForm = { category: "Здравоохранение", title: "", description: "", source: "Министерство здравоохранения РК", url: "" };

function NewsAdmin() {
  const { news, saveNews, deleteNews } = useNews();
  const [form, setForm] = useState(initialForm);
  const change = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const submit = (event) => { event.preventDefault(); saveNews(form); setForm(initialForm); };
  return <section className="admin-page">
    <header className="admin-heading"><div><p>УПРАВЛЕНИЕ КОНТЕНТОМ</p><h1>Новости</h1></div><a href="https://www.gov.kz/memleket/entities/dsm/press/news?lang=ru" target="_blank" rel="noreferrer">Новости Минздрава ↗</a></header>
    <div className="news-admin-grid">
      <form className="news-admin-form" onSubmit={submit}>
        <h2>{form.id ? "Редактировать новость" : "Добавить новость"}</h2>
        <label>Категория<input name="category" value={form.category} onChange={change} required /></label>
        <label>Заголовок<input name="title" value={form.title} onChange={change} required /></label>
        <label>Краткое описание<textarea name="description" value={form.description} onChange={change} rows="5" required /></label>
        <label>Источник<input name="source" value={form.source} onChange={change} required /></label>
        <label>Ссылка на полную новость<input name="url" type="url" value={form.url} onChange={change} placeholder="https://..." required /></label>
        <div className="form-actions"><button type="submit">Сохранить</button>{form.id && <button type="button" className="cancel" onClick={() => setForm(initialForm)}>Отмена</button>}</div>
      </form>
      <div className="admin-news">{news.map((item) => <article key={item.id}><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><small>{item.source}</small><div><button type="button" onClick={() => setForm(item)}>Изменить</button><button type="button" className="delete" onClick={() => deleteNews(item.id)}>Удалить</button></div></article>)}</div>
    </div>
  </section>;
}

export default NewsAdmin;
