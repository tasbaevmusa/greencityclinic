import React, { useState } from "react";
import { useVacancies } from "../data/VacanciesContext";
import "../Styles/Vacancies.css";
const initialForm = { title: "", department: "", employment: "Полная занятость", description: "", requirements: "", contact: "", published: true };
function VacanciesAdmin() {
  const { vacancies, saveVacancy, deleteVacancy } = useVacancies(); const [form, setForm] = useState(initialForm);
  const change = ({ target: { name, value, type, checked } }) => setForm((item) => ({ ...item, [name]: type === "checkbox" ? checked : value }));
  const submit = (event) => { event.preventDefault(); saveVacancy(form); setForm(initialForm); };
  return <section className="admin-page"><header className="admin-heading"><div><p>УПРАВЛЕНИЕ КОНТЕНТОМ</p><h1>Вакансии</h1></div></header><div className="vacancies-admin-grid">
    <form className="vacancy-admin-form" onSubmit={submit}><h2>{form.id ? "Редактировать вакансию" : "Добавить вакансию"}</h2>
      <label>Название должности<input name="title" value={form.title} onChange={change} required /></label><label>Отделение<input name="department" value={form.department} onChange={change} required /></label>
      <label>Занятость<select name="employment" value={form.employment} onChange={change}><option>Полная занятость</option><option>Частичная занятость</option><option>Сменный график</option><option>Стажировка</option></select></label>
      <label>Описание<textarea name="description" value={form.description} onChange={change} rows="4" required /></label><label>Требования<textarea name="requirements" value={form.requirements} onChange={change} rows="4" required /></label>
      <label>Контакт для отклика<input name="contact" value={form.contact} onChange={change} placeholder="Телефон или e-mail" required /></label><label className="publish-check"><input type="checkbox" name="published" checked={form.published} onChange={change} /> Показывать на сайте</label>
      <div><button type="submit">Сохранить</button>{form.id && <button type="button" className="cancel" onClick={() => setForm(initialForm)}>Отмена</button>}</div></form>
    <div className="admin-vacancies">{vacancies.map((item) => <article key={item.id}><span>{item.published ? "Опубликовано" : "Черновик"}</span><h3>{item.title}</h3><strong>{item.department} · {item.employment}</strong><p>{item.description}</p><div><button type="button" onClick={() => setForm(item)}>Изменить</button><button type="button" className="delete" onClick={() => deleteVacancy(item.id)}>Удалить</button></div></article>)}</div>
  </div></section>;
}
export default VacanciesAdmin;
