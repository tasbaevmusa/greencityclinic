import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import Navbar from "../Components/Navbar";
import "../Styles/Vacancies.css";
import { useLanguage } from "../i18n/LanguageContext";
import ClinicPurpose from "../Components/ClinicPurpose";
function AboutDetail() {
  const { t } = useLanguage();
  const { section } = useParams();
  const page = t.aboutPages[section];
  const [documentText, setDocumentText] = useState("");

  useEffect(() => {
    if (!page?.textFile) return;
    fetch(`${process.env.PUBLIC_URL}${page.textFile}`)
      .then((response) => response.text())
      .then(setDocumentText)
      .catch(() => setDocumentText("Не удалось загрузить документ."));
  }, [page]);

  if (!page) return <Navigate to="/" replace />;
  if (section === "mission" || section === "vision") return <ClinicPurpose section={section} />;

  const paragraphs = documentText.split(/\r?\n\s*\r?\n/).filter(Boolean);
  return <><Navbar /><main className={`about-detail ${page.textFile ? "ethical-code-page" : ""} ${Array.isArray(page.text) ? "director-message" : ""} ${page.tasks ? "compliance-page" : ""}`}><p>{page.eyebrow}</p><h1>{page.title}</h1><div>{page.textFile ? paragraphs.map((paragraph, index) => {
    const isHeading = /^(Этический кодекс|КОДЕКС ДЕЛОВОЙ ЭТИКИ|Миссия Кодекса|\d+(?:\.\d+)*\.?\s+[^.]+)$/.test(paragraph.trim()) && paragraph.length < 120;
    return isHeading ? <h2 key={index}>{paragraph}</h2> : <p key={index}>{paragraph}</p>;
  }) : page.tasks ? <>
    <p>{page.text}</p>
    <h2>{page.tasksTitle}</h2>
    <ul>{page.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
    <section className="compliance-documents">
      <h2>{page.documentsTitle}</h2>
      <div>{page.documents.map((document) => {
        const url = `${process.env.PUBLIC_URL}${document.file}`;
        return <a href={url} download key={document.file}>
          <span><FileText aria-hidden="true" /><strong>{document.title}</strong></span>
          <Download aria-hidden="true" />
        </a>;
      })}</div>
    </section>
  </> : Array.isArray(page.text) ? page.text.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>{page.text}</p>}</div></main></>;
}
export default AboutDetail;
