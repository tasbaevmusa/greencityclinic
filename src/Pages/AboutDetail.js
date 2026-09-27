import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../Styles/Vacancies.css";
import { useLanguage } from "../i18n/LanguageContext";
function AboutDetail() {
  const { t } = useLanguage();
  const page = t.aboutPages[useParams().section];
  const [documentText, setDocumentText] = useState("");

  useEffect(() => {
    if (!page?.textFile) return;
    fetch(`${process.env.PUBLIC_URL}${page.textFile}`)
      .then((response) => response.text())
      .then(setDocumentText)
      .catch(() => setDocumentText("Не удалось загрузить документ."));
  }, [page]);

  if (!page) return <Navigate to="/" replace />;

  const paragraphs = documentText.split(/\r?\n\s*\r?\n/).filter(Boolean);
  return <><Navbar /><main className={`about-detail ${page.textFile ? "ethical-code-page" : ""} ${Array.isArray(page.text) ? "director-message" : ""}`}><p>{page.eyebrow}</p><h1>{page.title}</h1><div>{page.textFile ? paragraphs.map((paragraph, index) => {
    const isHeading = /^(Этический кодекс|КОДЕКС ДЕЛОВОЙ ЭТИКИ|Миссия Кодекса|\d+(?:\.\d+)*\.?\s+[^.]+)$/.test(paragraph.trim()) && paragraph.length < 120;
    return isHeading ? <h2 key={index}>{paragraph}</h2> : <p key={index}>{paragraph}</p>;
  }) : Array.isArray(page.text) ? page.text.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>{page.text}</p>}</div></main></>;
}
export default AboutDetail;
