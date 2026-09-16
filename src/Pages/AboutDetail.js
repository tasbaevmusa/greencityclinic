import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../Styles/Vacancies.css";
import { useLanguage } from "../i18n/LanguageContext";
function AboutDetail() { const { t } = useLanguage(); const page = t.aboutPages[useParams().section]; if (!page) return <Navigate to="/" replace />; return <><Navbar /><main className="about-detail"><p>{page.eyebrow}</p><h1>{page.title}</h1><div><p>{page.text}</p></div></main></>; }
export default AboutDetail;
