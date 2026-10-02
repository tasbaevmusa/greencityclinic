import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import waitingArea from "../Assets/naramed-waiting-area.png";
import facade from "../Assets/naramed-facade.png";
import consultation from "../Assets/naramed-consultation.png";
import ultrasound from "../Assets/service-ultrasound.png";
import entrance from "../Assets/naramed-entrance.png";
import reception from "../Assets/naramed-reception.png";
import "../Styles/ClinicGallery.css";

// Replace these images with clinic photos as they become available.
const slides = [
  { image: reception, ru: "Регистратура НАРАМЕД", kk: "НАРАМЕД тіркеу бөлімі", en: "NARAMED reception", position: "center" },
  { image: waitingArea, ru: "Пространство заботы", kk: "Қамқорлық кеңістігі", en: "A place of care", position: "center" },
  { image: facade, ru: "Наша клиника", kk: "Біздің клиника", en: "Our clinic", position: "center" },
  { image: consultation, ru: "Внимание к каждому", kk: "Әр адамға көңіл бөлу", en: "Personal attention", position: "center 30%" },
  { image: ultrasound, ru: "Современная диагностика", kk: "Заманауи диагностика", en: "Modern diagnostics", position: "center 30%" },
  { image: entrance, ru: "Добро пожаловать в НАРАМЕД", kk: "НАРАМЕД клиникасына қош келдіңіз", en: "Welcome to NARAMED", position: "center" },
];

export default function ClinicGallery() {
  const { language } = useLanguage();
  const kk = language === "kk";
  const en = language === "en";
  const copy = en ? { label: "PHOTO GALLERY", title: "Explore the Clinic", region: "carousel", gallery: "Clinic photos", previous: "Previous photo", next: "Next photo", photo: "Photo", stop: "Stop slideshow", start: "Start slideshow" } : kk ? { label: "ФОТОГАЛЕРЕЯ", title: "Клиникамен танысыңыз", region: "слайдер", gallery: "Клиника суреттері", previous: "Алдыңғы сурет", next: "Келесі сурет", photo: "Сурет", stop: "Автоматты ауыстыруды тоқтату", start: "Автоматты ауыстыруды қосу" } : { label: "ФОТОГАЛЕРЕЯ", title: "Знакомьтесь с клиникой", region: "карусель", gallery: "Фотографии клиники", previous: "Предыдущее фото", next: "Следующее фото", photo: "Фото", stop: "Остановить автопрокрутку", start: "Включить автопрокрутку" };
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);


  const [visible, setVisible] = useState(!document.hidden);

  const touch = useRef(null);
  const running = playing && visible;
  const select = (index) => setActive((index + slides.length) % slides.length);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => { if (media.matches) setPlaying(false); };
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
      <div><p>{copy.label}</p><h2 id="gallery-title">{copy.title}</h2></div>
      <span>{kk ? "НАРАМЕД · Алматы" : "НАРАМЕД · Алматы"}</span>
    </header>
    <div className="clinic-gallery-stage" role="region" aria-roledescription={copy.region}
      aria-label={copy.gallery} tabIndex={0}


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
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { select(active + (dx < 0 ? 1 : -1)); }
        touch.current = null;
      }}>
      {slides.map((slide, index) => <div className={`clinic-gallery-slide ${active === index ? "is-active" : ""}`} key={slide.image} aria-hidden={active !== index}>
        <img src={slide.image} alt={slide[language] || slide.ru} style={{ objectPosition: slide.position }} loading="lazy" draggable="false" />
      </div>)}
      <div className="clinic-gallery-shade" />
      <span className="clinic-gallery-brand">NARAMED <span> / </span> GREEN CITY</span>
      <button type="button" className="clinic-gallery-arrow previous" onClick={() => select(active - 1)} aria-label={copy.previous}><ChevronLeft /></button>
      <button type="button" className="clinic-gallery-arrow next" onClick={() => select(active + 1)} aria-label={copy.next}><ChevronRight /></button>
      <div className="clinic-gallery-caption" aria-live={running ? "off" : "polite"} aria-atomic="true">
        <span>{String(active + 1).padStart(2, "0")} <i>/ {String(slides.length).padStart(2, "0")}</i></span>
        <h3>{slides[active][language] || slides[active].ru}</h3>
      </div>
      <div className="clinic-gallery-controls">
        <div className="clinic-gallery-dots">{slides.map((slide, index) => <button type="button" key={slide.image} className={index === active ? "is-active" : ""} aria-label={`${copy.photo} ${index + 1}: ${slide[language] || slide.ru}`} aria-current={index === active ? "true" : undefined} onClick={() => select(index)}><span /></button>)}</div>
        <button type="button" className="clinic-gallery-play" onClick={() => setPlaying(!playing)} aria-label={playing ? copy.stop : copy.start}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
      </div>
    </div>
  </section>;
}

