import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/ServiceDetail.css";
import { useLanguage } from "../i18n/LanguageContext";

function ServiceDetail() {
  const { t } = useLanguage();
  const service = t.servicePage.details[useParams().slug];
  if (!service) return <Navigate to="/" replace />;
  return <><Navbar /><main className="service-detail-page"><p>{t.servicePage.label}</p><h1>{service.title}</h1><div><p>{service.description}</p><Link to={service.to}>{service.action}</Link><Link to="/#services" className="service-back">← {t.servicePage.all}</Link></div></main><Footer /></>;
}

export default ServiceDetail;
