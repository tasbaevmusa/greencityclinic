import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/WhatsAppFloat.css";

function WhatsAppFloat() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  if (pathname.startsWith("/admin") || pathname === "/login") return null;

  const label = language === "kk" ? "WhatsApp арқылы жазылу" : "Написать в WhatsApp";
  return <a className="whatsapp-float" href="https://wa.me/77075340824" target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
    <span className="whatsapp-float-ring" aria-hidden="true" />
    <FontAwesomeIcon icon={faWhatsapp} />
    <span className="whatsapp-float-tooltip">{label}</span>
  </a>;
}

export default WhatsAppFloat;
