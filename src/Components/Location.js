import React from "react";
import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import "../Styles/Location.css";
import { useLanguage } from "../i18n/LanguageContext";

function Location() {
  const { language, t } = useLanguage();
  const text = t.location;
  const twoGisUrl = "https://2gis.kz/almaty/firm/70000001084000652?m=77.005043%2C43.286537%2F16";
  const copy = language === "kk" ? {
    title: "Байланыс",
    call: "Call-орталық (жазылу, анықтама):",
    all: "Барлық байланыстар мен телефондар",
  } : {
    title: "Контакты",
    call: "Call-центр (запись, справки):",
    all: "Все контакты и телефоны",
  };

  return (
    <section className="location-section" id="contact">
      <div className="location-container">
        <h2>{copy.title}</h2>
        <div className="location-content">
          <div className="location-info">
            <div className="contact-row"><MapPin /><span>{text.address}</span></div>
            <div className="contact-row"><Phone /><span>{copy.call} <a href="tel:+77075340824">+7 (707) 534-08-24</a></span></div>
            <div className="contact-row"><Mail /><a className="contact-plain" href="mailto:info@naramed.kz">info@naramed.kz</a></div>
            <div className="contact-row"><Clock3 /><span>{text.schedule}</span></div>
            <a className="location-map-button" href={twoGisUrl} target="_blank" rel="noopener noreferrer">{copy.all}<ArrowRight size={16} /></a>
          </div>

          <div className="location-map">
            <iframe
              title={text.clinic}
              src="https://www.google.com/maps?q=43.286537,77.005043&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={twoGisUrl} target="_blank" rel="noopener noreferrer" className="location-map-overlay">{text.openMap}<ArrowRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Location;
