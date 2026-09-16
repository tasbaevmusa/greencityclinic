import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, HeartPulse, Phone, Stethoscope } from "lucide-react";
import ClinicImage from "../Assets/naramed-entrance.png";
import "../Styles/Hero.css";
import { useLanguage } from "../i18n/LanguageContext";

const content = {
  ru: {
    eyebrow: "Заботимся о вашем здоровье каждый день",
    title: "Современная медицина рядом с вами",
    description: "Клиника НАРАМЕД — внимательные врачи, точная диагностика и понятный путь к хорошему самочувствию для всей семьи.",
    appointment: "Записаться на приём", doctor: "Выбрать врача",
    attachment: "Прикрепиться к клинике", schedule: "Расписание врачей",
    callCenter: "Call-центр", hours: "Время работы", weekdays: "Ежедневно 08:00–21:00",
    imageAlt: "Вход в клинику НАРАМЕД",
  },
  kk: {
    eyebrow: "Күн сайын денсаулығыңызға қамқорлық жасаймыз",
    title: "Заманауи медицина әрдайым жаныңызда",
    description: "НАРАМЕД клиникасы — бүкіл отбасы үшін тәжірибелі дәрігерлер, дәл диагностика және сапалы медициналық көмек.",
    appointment: "Қабылдауға жазылу", doctor: "Дәрігерді таңдау",
    attachment: "Клиникаға тіркелу", schedule: "Дәрігерлер кестесі",
    callCenter: "Call-орталық", hours: "Жұмыс уақыты", weekdays: "Күн сайын 08:00–21:00",
    imageAlt: "НАРАМЕД клиникасының кіреберісі",
  },
};

function Hero() {
  const { language } = useLanguage();
  const copy = content[language] || content.ru;

  return (
    <section className="hero-container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-eyebrow"><HeartPulse size={17} />{copy.eyebrow}</div>
        <h1 id="hero-title">{copy.title}</h1>
        <p>{copy.description}</p>
        <div className="hero-actions">
          <a className="hero-primary" href="https://wa.me/77075340824" target="_blank" rel="noopener noreferrer"><CalendarDays size={19} />{copy.appointment}<ArrowRight size={17} /></a>
          <Link className="hero-secondary" to="/#doctors"><Stethoscope size={19} />{copy.doctor}</Link>
        </div>
        <div className="hero-quick-links">
          <Link to="/appointment">{copy.attachment}<ArrowRight size={14} /></Link>
          <Link to="/doctors-schedule">{copy.schedule}<ArrowRight size={14} /></Link>
        </div>
      </div>

      <div className="hero-visual">
        <img src={ClinicImage} alt={copy.imageAlt} />
        <a className="hero-phone-card" href="tel:+77075340824">
          <span><Phone size={20} /></span><small>{copy.callCenter}</small><strong>+7 707 534 08 24</strong>
        </a>
        <div className="hero-hours-card">
          <span><Clock3 size={19} /></span><div><small>{copy.hours}</small><strong>{copy.weekdays}</strong></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
