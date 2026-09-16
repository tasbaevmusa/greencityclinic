import React from "react";
import Navbar from "../Components/Navbar";
import { useVacancies } from "../data/VacanciesContext";
import "../Styles/Vacancies.css";
import { useLanguage } from "../i18n/LanguageContext";
function Vacancies() { const { vacancies } = useVacancies(); const { t } = useLanguage(); const published = vacancies.filter((item) => item.published); return <><Navbar /><main className="vacancies-page"><header><p>{t.vacancies.label}</p><h1>{t.vacancies.title}</h1><span>{t.vacancies.intro}</span></header><div className="vacancies-list">{published.length ? published.map((item) => { const localized = t.vacancyItems[item.id] || item; return <article key={item.id}><small>{localized.department}</small><h2>{localized.title}</h2><strong>{localized.employment}</strong><p>{localized.description}</p><h3>{t.vacancies.requirements}</h3><p>{localized.requirements}</p><a href={item.contact.includes("@") ? `mailto:${item.contact}` : `tel:${item.contact.replace(/[^+\d]/g, "")}`}>{t.vacancies.apply}: {item.contact}</a></article>; }) : <div className="vacancies-empty"><h2>{t.vacancies.empty}</h2><p>{t.vacancies.follow}</p></div>}</div></main></>; }
export default Vacancies;
