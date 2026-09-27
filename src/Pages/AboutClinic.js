import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, HandHeart, HeartPulse, MapPin, ShieldCheck, Stethoscope, UsersRound } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import reception from "../Assets/naramed-reception.png";
import { useDoctors } from "../data/DoctorsContext";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/AboutClinic.css";

const copy = {
  ru: {
    eyebrow: "О КЛИНИКЕ", title: "NARAMED — забота о здоровье рядом с домом",
    intro: "Современная клиника в микрорайоне Думан-2 города Алматы. Мы объединяем внимательное отношение, опыт специалистов и понятный путь пациента от консультации до диагностики и лечения.",
    action: "Посмотреть врачей", schedule: "График работы врачей", doctors: "врачей", specialties: "направлений", days: "дней в неделю", hours: "режим работы",
    missionLabel: "НАША МИССИЯ", mission: "Качественная медицинская помощь в атмосфере доверия",
    missionText: "Наша задача — помогать пациентам своевременно получать консультации, проходить обследования и принимать понятные решения о своём здоровье. Мы ценим безопасность, профессионализм и уважительное общение.",
    values: "Наши ценности", valueItems: [
      ["Забота", "Внимательно относимся к самочувствию, вопросам и обстоятельствам каждого пациента."],
      ["Профессионализм", "Развиваем компетенции специалистов и используем современные подходы к диагностике."],
      ["Безопасность", "Соблюдаем медицинские стандарты и ставим качество помощи на первое место."],
      ["Доступность", "Объясняем рекомендации понятным языком и помогаем выбрать удобный путь обращения."]
    ],
    directionsLabel: "МЕДИЦИНСКАЯ ПОМОЩЬ", directions: "Основные направления", directionItems: ["Общая врачебная практика", "Ультразвуковая диагностика", "Женское здоровье", "Детские специалисты", "Кардиология и сосудистая помощь", "Лабораторные исследования"],
    location: "Мы находимся в Алматы", address: "мкр. Думан-2, 61", openMap: "Открыть маршрут в 2ГИС", openDaily: "Ежедневно, 08:00–21:00"
  },
  kk: {
    eyebrow: "КЛИНИКА ТУРАЛЫ", title: "NARAMED — үйіңізге жақын денсаулық қамқорлығы",
    intro: "Алматы қаласының Думан-2 шағын ауданындағы заманауи клиника. Біз дәрігер кеңесінен бастап диагностика мен емдеуге дейінгі жолда мұқият қарым-қатынас пен мамандар тәжірибесін біріктіреміз.",
    action: "Дәрігерлерді көру", schedule: "Дәрігерлердің жұмыс кестесі", doctors: "дәрігер", specialties: "бағыт", days: "аптасына күн", hours: "жұмыс уақыты",
    missionLabel: "БІЗДІҢ МИССИЯМЫЗ", mission: "Сенім атмосферасындағы сапалы медициналық көмек",
    missionText: "Мақсатымыз — пациенттерге кеңес алуға, тексеруден өтуге және денсаулығына қатысты түсінікті шешім қабылдауға көмектесу. Біз қауіпсіздікті, кәсібилікті және құрметті қарым-қатынасты бағалаймыз.",
    values: "Біздің құндылықтарымыз", valueItems: [
      ["Қамқорлық", "Әр пациенттің жағдайына, сұрақтарына және қажеттіліктеріне мұқият қараймыз."],
      ["Кәсібилік", "Мамандардың біліктілігін дамытып, заманауи диагностика тәсілдерін қолданамыз."],
      ["Қауіпсіздік", "Медициналық стандарттарды сақтап, көмек сапасын бірінші орынға қоямыз."],
      ["Қолжетімділік", "Ұсыныстарды түсінікті тілде түсіндіріп, қолайлы қызмет жолын таңдауға көмектесеміз."]
    ],
    directionsLabel: "МЕДИЦИНАЛЫҚ КӨМЕК", directions: "Негізгі бағыттар", directionItems: ["Жалпы дәрігерлік практика", "Ультрадыбыстық диагностика", "Әйелдер денсаулығы", "Балалар мамандары", "Кардиология және қан тамырлары көмегі", "Зертханалық зерттеулер"],
    location: "Біз Алматыда орналасқанбыз", address: "Думан-2 ықшам ауданы, 61", openMap: "2GIS арқылы маршрут құру", openDaily: "Күн сайын, 08:00–21:00"
  }
};

export default function AboutClinic() {
  const { language } = useLanguage();
  const { doctors } = useDoctors();
  const c = copy[language === "kk" ? "kk" : "ru"];
  const specialtyCount = new Set(doctors.map((doctor) => doctor.position).filter(Boolean)).size;
  const valueIcons = [HandHeart, Stethoscope, ShieldCheck, UsersRound];

  return <div className="about-clinic-page">
    <Navbar />
    <main>
      <section className="about-clinic-hero">
        <div className="about-clinic-copy">
          <span className="about-clinic-eyebrow"><HeartPulse />{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.intro}</p>
          <div className="about-clinic-actions"><Link to="/#doctors">{c.action}<ArrowRight /></Link><Link className="secondary" to="/doctors-schedule"><CalendarDays />{c.schedule}</Link></div>
        </div>
        <div className="about-clinic-photo"><img src={reception} alt={language === "kk" ? "NARAMED клиникасының тіркеу бөлімі" : "Регистратура клиники NARAMED"} /><span><MapPin />{c.address}</span></div>
      </section>

      <section className="about-clinic-stats" aria-label={language === "kk" ? "Клиника көрсеткіштері" : "Клиника в цифрах"}>
        <article><strong>{doctors.length || "—"}</strong><span>{c.doctors}</span></article>
        <article><strong>{specialtyCount || "—"}</strong><span>{c.specialties}</span></article>
        <article><strong>7</strong><span>{c.days}</span></article>
        <article><strong>08–21</strong><span>{c.hours}</span></article>
      </section>

      <section className="about-clinic-mission">
        <div><span>{c.missionLabel}</span><h2>{c.mission}</h2></div><p>{c.missionText}</p>
      </section>

      <section className="about-clinic-values"><header><span>NARAMED</span><h2>{c.values}</h2></header><div>{c.valueItems.map(([title, text], index) => { const Icon = valueIcons[index]; return <article key={title}><i><Icon /></i><h3>{title}</h3><p>{text}</p></article>; })}</div></section>

      <section className="about-clinic-directions">
        <header><span>{c.directionsLabel}</span><h2>{c.directions}</h2></header>
        <div>{c.directionItems.map((item, index) => <article key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></article>)}</div>
      </section>

      <section className="about-clinic-location"><div><MapPin /><span><small>{c.location}</small><strong>{c.address}</strong></span></div><div><Clock3 /><span><small>{c.openDaily}</small><strong>+7 (707) 534-08-24</strong></span></div><a href="https://go.2gis.com/" target="_blank" rel="noopener noreferrer">{c.openMap}<ArrowRight /></a></section>
    </main>
    <Footer />
  </div>;
}
