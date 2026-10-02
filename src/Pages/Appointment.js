import React, { useEffect } from "react";
import AppointmentLink, { appointmentWhatsAppUrl } from "../Components/AppointmentLink";
import { useLanguage } from "../i18n/LanguageContext";

function Appointment() {
  const { language } = useLanguage();
  useEffect(() => { window.location.replace(appointmentWhatsAppUrl); }, []);
  return <main className="service-detail-page"><h1>{language === "kk" ? "WhatsApp арқылы жазылу" : language === "en" ? "Book via WhatsApp" : "Запись через WhatsApp"}</h1><AppointmentLink>{language === "kk" ? "WhatsApp ашу" : language === "en" ? "Open WhatsApp" : "Открыть WhatsApp"}</AppointmentLink></main>;
}

export default Appointment;
