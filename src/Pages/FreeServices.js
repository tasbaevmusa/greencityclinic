import AppointmentLink from "../Components/AppointmentLink";
import React from "react";

import { ArrowRight, HeartPulse, ScanLine, Stethoscope } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import generalPractice from "../Assets/service-general-practice.png";
import pediatrics from "../Assets/service-pediatrics.png";
import ultrasound from "../Assets/service-ultrasound.png";
import laboratory from "../Assets/service-laboratory.png";
import womensHealth from "../Assets/service-womens-health.png";
import vaccination from "../Assets/service-vaccination.png";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/FreeServices.css";

const content = {
  en: {
    eyebrow: "NARAMED SERVICES", title: "Free Services", intro: "Specialist consultations, diagnostics and procedures for patients registered with the clinic.", appointment: "Book an Appointment",
    categories: [
      { title: "Specialist Consultations", text: "Doctor consultations for adults and children", image: generalPractice, icon: Stethoscope },
      { title: "Pediatric Care", text: "Pediatrician and pediatric neurologist appointments", image: pediatrics, icon: HeartPulse },
      { title: "Ultrasound and Doppler", text: "Modern ultrasound diagnostics", image: ultrasound, icon: ScanLine },
      { title: "Laboratory Tests", text: "All necessary types of laboratory tests", image: laboratory, icon: HeartPulse },
      { title: "Women’s Health", text: "Gynecologist consultations and examinations", image: womensHealth, icon: Stethoscope },
      { title: "Procedures and Vaccination", text: "Treatment room procedures and prevention", image: vaccination, icon: HeartPulse },
    ],
    groups: [
      { title: "Specialist Doctors", items: ["Ophthalmologist", "Rheumatologist", "Gynecologist", "Neurologist", "Surgeon", "General Practitioner", "Cardiologist", "Pediatrician", "Arrhythmologist", "Gastroenterologist", "Dentist", "Pediatric Neurologist", "Vascular Surgeon", "Hematologist", "Pulmonologist"] },
      { title: "Diagnostics and Procedures", items: ["All types of laboratory tests", "Ultrasound / Doppler", "CT and panoramic X-ray", "Treatment room"] },
    ],
  },
  ru: {
    eyebrow: "УСЛУГИ НАРАМЕД",
    title: "Бесплатные услуги",
    intro: "Консультации специалистов, диагностика и процедуры для прикреплённого населения.",
    appointment: "Записаться на приём",
    categories: [
      { title: "Приём специалистов", text: "Консультации врачей для взрослых и детей", image: generalPractice, icon: Stethoscope },
      { title: "Педиатрическая помощь", text: "Приём педиатра и детского невролога", image: pediatrics, icon: HeartPulse },
      { title: "УЗИ и УЗДГ", text: "Современная ультразвуковая диагностика", image: ultrasound, icon: ScanLine },
      { title: "Лабораторные анализы", text: "Все виды необходимых анализов", image: laboratory, icon: HeartPulse },
      { title: "Женское здоровье", text: "Консультация гинеколога и обследования", image: womensHealth, icon: Stethoscope },
      { title: "Процедуры и вакцинация", text: "Процедурный кабинет и профилактика", image: vaccination, icon: HeartPulse },
    ],
    groups: [
      { title: "Врачи-специалисты", items: ["Офтальмолог", "Ревматолог", "Гинеколог", "Невропатолог", "Хирург", "Терапевт", "Кардиолог", "Педиатр", "Аритмолог", "Гастроэнтеролог", "Стоматолог", "Детский невролог", "Сосудистый хирург", "Гематолог", "Пульмонолог"] },
      { title: "Диагностика и процедуры", items: ["Все виды анализов", "УЗИ / УЗДГ", "КТ и панорамный снимок", "Процедурный кабинет"] },
    ],
  },
  kk: {
    eyebrow: "NARAMED ҚЫЗМЕТТЕРІ",
    title: "Тегін қызметтер",
    intro: "Тіркелген пациенттерге арналған мамандар кеңесі, диагностика және емшаралар.",
    appointment: "Қабылдауға жазылу",
    categories: [
      { title: "Мамандар қабылдауы", text: "Ересектер мен балаларға дәрігерлер кеңесі", image: generalPractice, icon: Stethoscope },
      { title: "Педиатриялық көмек", text: "Педиатр мен балалар неврологының қабылдауы", image: pediatrics, icon: HeartPulse },
      { title: "УДЗ және УДДГ", text: "Заманауи ультрадыбыстық диагностика", image: ultrasound, icon: ScanLine },
      { title: "Зертханалық талдаулар", text: "Қажетті талдаулардың барлық түрі", image: laboratory, icon: HeartPulse },
      { title: "Әйелдер денсаулығы", text: "Гинеколог кеңесі және тексерулер", image: womensHealth, icon: Stethoscope },
      { title: "Емшаралар мен вакцинация", text: "Емшара кабинеті және профилактика", image: vaccination, icon: HeartPulse },
    ],
    groups: [
      { title: "Маман дәрігерлер", items: ["Офтальмолог", "Ревматолог", "Гинеколог", "Невропатолог", "Хирург", "Терапевт", "Кардиолог", "Педиатр", "Аритмолог", "Гастроэнтеролог", "Стоматолог", "Балалар неврологы", "Қан тамыр хирургі", "Гематолог", "Пульмонолог"] },
      { title: "Диагностика және емшаралар", items: ["Талдаулардың барлық түрі", "УДЗ / УДДГ", "КТ және панорамалық сурет", "Емшара кабинеті"] },
    ],
  },
};

export default function FreeServices() {
  const { language } = useLanguage();
  const copy = content[language] || content.ru;

  return <><Navbar /><main className="free-services-page">
    <header className="free-services-heading">
      <p>{copy.eyebrow}</p><h1>{copy.title}</h1><span>{copy.intro}</span>
    </header>
    <section className="free-service-cards" aria-label={copy.title}>
      {copy.categories.map(({ title, text, image, icon: Icon }) => <AppointmentLink className="free-service-card" key={title}>
        <img src={image} alt="" loading="lazy" /><span className="free-service-card__shade" />
        <span className="free-service-card__icon"><Icon size={17} /></span>
        <span className="free-service-card__copy"><strong>{title}</strong><small>{text}</small></span>
        <span className="free-service-card__arrow"><ArrowRight size={17} /></span>
      </AppointmentLink>)}
    </section>
    <section className="free-services-list">
      {copy.groups.map((group) => <article key={group.title}><h2>{group.title}</h2><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
    </section>
    <div className="free-services-action"><AppointmentLink>{copy.appointment}<ArrowRight size={17} /></AppointmentLink></div>
  </main><Footer /></>;
}
