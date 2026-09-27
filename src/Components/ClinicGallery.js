import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import exterior from "../Assets/clinic-hero.png";
import consultation from "../Assets/service-general-practice.png";
import ultrasound from "../Assets/service-ultrasound.png";
import entrance from "../Assets/naramed-entrance.png";
import reception from "../Assets/naramed-reception.png";
import "../Styles/ClinicGallery.css";

// Replace these images with clinic photos as they become available.
const slides = [
  { image: reception, ru: "Регистратура НАРАМЕД", kk: "НАРАМЕД тіркеу бөлімі", position: "center" },
  { image: exterior, ru: "Пространство заботы", kk: "Қамқорлық кеңістігі", position: "center 53%" },
  { image: consultation, ru: "Внимание к каждому", kk: "Әр адамға көңіл бөлу", position: "center 30%" },
  { image: ultrasound, ru: "Современная диагностика", kk: "Заманауи диагностика", position: "center 30%" },
  { image: entrance, ru: "Добро пожаловать в НАРАМЕД", kk: "НАРАМЕД клиникасына қош келдіңіз", position: "center" },
];

export default function ClinicGallery() {
  const { language } = useLanguage();
  const kk = language === "kk";
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const touch = useRef(null);
  const running = playing && !hovered && !focused && visible && !reducedMotion;
  const select = (index) => setActive((index + slides.length) % slides.length);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    const visibility = () => setVisible(!document.hidden);
    media.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % slides.length), 6000);
    return () => window.clearTimeout(timer);
  }, [active, running]);

  return <section id="gallery" className="clinic-gallery" aria-labelledby="gallery-title">
    <header className="clinic-gallery-heading">
      <div><p>{kk ? "ФОТОГАЛЕРЕЯ" : "ФОТОГАЛЕРЕЯ"}</p><h2 id="gallery-title">{kk ? "Клиникамен танысыңыз" : "Знакомьтесь с клиникой"}</h2></div>
      <span>{kk ? "НАРАМЕД · Алматы" : "НАРАМЕД · Алматы"}</span>
    </header>
    <div className="clinic-gallery-stage" role="region" aria-roledescription={kk ? "слайдер" : "карусель"}
      aria-label={kk ? "Клиника суреттері" : "Фотографии клиники"} tabIndex={0}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault(); select(active + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
      onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchCancel={() => { touch.current = null; }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { select(active + (dx < 0 ? 1 : -1)); setPlaying(false); }
        touch.current = null;
      }}>
      {slides.map((slide, index) => <div className={`clinic-gallery-slide ${active === index ? "is-active" : ""}`} key={slide.image} aria-hidden={active !== index}>
        <img src={slide.image} alt={slide[kk ? "kk" : "ru"]} style={{ objectPosition: slide.position }} loading="lazy" draggable="false" />
      </div>)}
      <div className="clinic-gallery-shade" />
      <span className="clinic-gallery-brand">NARAMED <span> / </span> GREEN CITY</span>
      <button type="button" className="clinic-gallery-arrow previous" onClick={() => select(active - 1)} aria-label={kk ? "Алдыңғы сурет" : "Предыдущее фото"}><ChevronLeft /></button>
      <button type="button" className="clinic-gallery-arrow next" onClick={() => select(active + 1)} aria-label={kk ? "Келесі сурет" : "Следующее фото"}><ChevronRight /></button>
      <div className="clinic-gallery-caption" aria-live={running ? "off" : "polite"} aria-atomic="true">
        <span>{String(active + 1).padStart(2, "0")} <i>/ {String(slides.length).padStart(2, "0")}</i></span>
        <h3>{slides[active][kk ? "kk" : "ru"]}</h3>
      </div>
      <div className="clinic-gallery-controls">
        <div className="clinic-gallery-dots">{slides.map((slide, index) => <button type="button" key={slide.image} className={index === active ? "is-active" : ""} aria-label={`${kk ? "Сурет" : "Фото"} ${index + 1}: ${slide[kk ? "kk" : "ru"]}`} aria-current={index === active ? "true" : undefined} onClick={() => select(index)}><span /></button>)}</div>
        {!reducedMotion && <button type="button" className="clinic-gallery-play" onClick={() => setPlaying(!playing)} aria-label={playing ? (kk ? "Автоматты ауыстыруды тоқтату" : "Остановить автопрокрутку") : (kk ? "Автоматты ауыстыруды қосу" : "Включить автопрокрутку")}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>}
      </div>
    </div>
  </section>;
}
