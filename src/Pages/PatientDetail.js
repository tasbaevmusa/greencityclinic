import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/Vacancies.css";

const pages = {
  ru: {
    attachment: ["ПАЦИЕНТАМ", "Прикрепление к поликлинике", "Информация о прикреплении к клинике НАРАМЕД и перечне необходимых документов."],
    "health-school": ["ПАЦИЕНТАМ", "Школа здоровья", "Полезная информация о профилактике заболеваний и поддержании здоровья."],
    vaccination: ["ПАЦИЕНТАМ", "Вакцинация", "Информация о доступной вакцинации, подготовке и порядке проведения прививок."],
    screenings: ["ПАЦИЕНТАМ", "Скрининги", "Информация о профилактических обследованиях и ранней диагностике заболеваний."],
  },
  kk: {
    attachment: ["ПАЦИЕНТТЕРГЕ", "Емханаға тіркелу", "НАРАМЕД клиникасына тіркелу және қажетті құжаттар туралы ақпарат."],
    "health-school": ["ПАЦИЕНТТЕРГЕ", "Денсаулық мектебі", "Аурулардың алдын алу және денсаулықты сақтау туралы пайдалы ақпарат."],
    vaccination: ["ПАЦИЕНТТЕРГЕ", "Вакцинация", "Қолжетімді вакцинация, дайындық және екпе жүргізу тәртібі туралы ақпарат."],
    screenings: ["ПАЦИЕНТТЕРГЕ", "Скринингтер", "Профилактикалық тексерулер және ауруларды ерте анықтау туралы ақпарат."],
  },
};

export default function PatientDetail() {
  const { section } = useParams();
  const { language } = useLanguage();
  const page = (pages[language] || pages.ru)[section];
  if (!page) return <Navigate to="/" replace />;

  return <><Navbar /><main className="about-detail"><p>{page[0]}</p><h1>{page[1]}</h1><div><p>{page[2]}</p></div></main><Footer /></>;
}
