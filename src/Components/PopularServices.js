import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  FlaskConical,
  HeartPulse,
  Microscope,
  ShieldPlus,
  Syringe,
} from "lucide-react";
import generalPractice from "../Assets/service-general-practice.png";
import pediatrics from "../Assets/service-pediatrics.png";
import ultrasound from "../Assets/service-ultrasound.png";
import laboratory from "../Assets/service-laboratory.png";
import womensHealth from "../Assets/service-womens-health.png";
import vaccination from "../Assets/service-vaccination.png";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/PopularServices.css";

const content = {
  ru: {
    eyebrow: "УСЛУГИ",
    title: "Популярные услуги",
    all: "Все услуги",
    items: [
      "Приём врача общей практики",
      "Приём педиатра",
      "УЗИ-диагностика",
      "Лабораторные анализы",
      "Женская консультация",
      "Вакцинация",
    ],
  },
  kk: {
    eyebrow: "ҚЫЗМЕТТЕР",
    title: "Танымал қызметтер",
    all: "Барлық қызметтер",
    items: [
      "Жалпы тәжірибелік дәрігердің қабылдауы",
      "Педиатрдың қабылдауы",
      "УДЗ диагностикасы",
      "Зертханалық талдаулар",
      "Әйелдер консультациясы",
      "Вакцинация",
    ],
  },
};

const cards = [
  { image: generalPractice, icon: ShieldPlus },
  { image: pediatrics, icon: Baby },
  { image: ultrasound, icon: HeartPulse },
  { image: laboratory, icon: FlaskConical },
  { image: womensHealth, icon: Microscope },
  { image: vaccination, icon: Syringe },
];

function PopularServices() {
  const { language } = useLanguage();
  const copy = content[language] || content.ru;

  return (
    <section className="popular-services" aria-labelledby="popular-services-title">
      <div className="popular-services__container">
        <header className="popular-services__header">
          <div>
            <p>{copy.eyebrow}</p>
            <h2 id="popular-services-title">{copy.title}</h2>
          </div>
          <Link to="/services/price-list" className="popular-services__all">
            {copy.all}<ArrowRight size={15} />
          </Link>
        </header>

        <div className="popular-services__grid">
          {cards.map(({ image, icon: Icon }, index) => (
            <Link
              key={copy.items[index]}
              to="/appointment"
              className="popular-service-card"
              aria-label={copy.items[index]}
            >
              <img src={image} alt="" loading="lazy" />
              <span className="popular-service-card__shade" aria-hidden="true" />
              <span className="popular-service-card__icon"><Icon size={16} /></span>
              <strong>{copy.items[index]}</strong>
              <span className="popular-service-card__arrow"><ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularServices;
