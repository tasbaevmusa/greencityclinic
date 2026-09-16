import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ChiefPhoto from "../Assets/profile-1.png";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/ChiefDoctor.css";

const content = {
  ru: {
    label: "ГЛАВНЫЙ ВРАЧ КЛИНИКИ",
    name: "Аида Жузбаевна",
    greeting: "Добро пожаловать в клинику НАРАМЕД!",
    action: "Блог главного врача",
    roleLabel: "РУКОВОДИТЕЛЬ",
    role: "Главный врач",
    alt: "Главный врач клиники НАРАМЕД",
  },
  kk: {
    label: "КЛИНИКАНЫҢ БАС ДӘРІГЕРІ",
    name: "Аида Жүзбайқызы",
    greeting: "НАРАМЕД клиникасына қош келдіңіз!",
    action: "Бас дәрігердің блогы",
    roleLabel: "БАСШЫ",
    role: "Бас дәрігер",
    alt: "НАРАМЕД клиникасының бас дәрігері",
  },
};

function ChiefDoctor() {
  const { language } = useLanguage();
  const copy = content[language] || content.ru;

  return (
    <section className="chief-section" aria-labelledby="chief-doctor-title">
      <div className="chief-container">
        <div className="chief-copy">
          <p className="chief-label">{copy.label}</p>
          <h2 id="chief-doctor-title">{copy.name}</h2>
          <p className="chief-greeting">{copy.greeting}</p>
          <Link className="chief-action" to="/about/director">{copy.action}<ArrowRight size={17} /></Link>
        </div>

        <div className="chief-portrait">
          <img src={ChiefPhoto} alt={copy.alt} />
          <div className="chief-role"><small>{copy.roleLabel}</small><strong>{copy.role}</strong></div>
        </div>
      </div>
    </section>
  );
}

export default ChiefDoctor;
