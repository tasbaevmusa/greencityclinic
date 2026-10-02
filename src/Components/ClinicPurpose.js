import AppointmentLink from "./AppointmentLink";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, ShieldCheck, Sprout } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "../i18n/LanguageContext";
import consultation from "../Assets/service-general-practice.png";
import clinic from "../Assets/clinic-hero.png";
import "../Styles/ClinicPurpose.css";

const content = {
  en: {
    home: "Home", about: "About the Clinic", brand: "NARAMED · OUR GUIDING PRINCIPLES", appointment: "Book an Appointment",
    mission: { label: "Mission", title: "Caring for health. Being there for people.", intro: "NARAMED’s mission is to help people stay healthy and receive medical care with attention, respect and understanding. For us, care begins with listening to the patient.", caption: "People are at the heart of our work", alt: "A doctor speaking with a patient", heading: "Care that begins with trust", description: "We want every patient to understand their health, why examinations are needed and what the next step will be. Clear communication and thoughtful care are the foundation of our mission.", cards: [["Attention to Every Patient", "We consider each person’s questions, circumstances and needs, creating a space where they can speak openly about their health."], ["A Responsible Approach", "We rely on medical knowledge, explain our recommendations and make patient safety a priority."], ["Care for the Future", "We encourage healthy habits and prevention, making self-care part of everyday life."]], note: "Our Guiding Principle", statement: "Behind every request is a person who needs attention and support.", next: "Our Vision", other: "vision" },
    vision: { label: "Vision", title: "The future of medicine is closer to people.", intro: "We see NARAMED as a clinic families can trust with their health. We aim to bring together modern medicine, accessible service and a warm, personal approach.", caption: "Growing to support people’s health", alt: "A bright modern clinic building", heading: "A clinic that inspires confidence in the future", description: "For us, progress means making medical care clearer and more convenient. We strive to build lasting relationships with patients and support them through every stage of life.", cards: [["Trust for Years to Come", "We aim to be a reliable health partner through openness, respect and continuity of care."], ["Improving Quality", "We develop professional knowledge and practices so modern medicine can meet patients’ needs."], ["A Culture of Prevention", "We help build a future where people visit doctors to stay healthy as well as to treat illness."]], note: "The Future We Seek", statement: "Medicine where professionalism and humanity always go hand in hand.", next: "Our Mission", other: "mission" },
  },
  ru: {
    home: "Главная", about: "О клинике", brand: "НАРАМЕД · НАШИ ОРИЕНТИРЫ", appointment: "Записаться на приём",
    mission: {
      label: "Миссия", title: "Заботиться о здоровье. Быть рядом с человеком.",
      intro: "Миссия «Нарамед» — помогать людям сохранять здоровье и получать медицинскую помощь с вниманием, уважением и пониманием. Для нас забота начинается с умения услышать пациента.",
      caption: "В центре нашей работы — человек", alt: "Иллюстрация: врач беседует с пациентом",
      heading: "Забота, которая начинается с доверия", description: "Мы стремимся, чтобы каждый пациент понимал, что происходит с его здоровьем, для чего нужны обследования и каким будет следующий шаг. Понятный диалог и бережное отношение — основа нашей миссии.",
      cards: [
        ["Внимание к каждому", "Учитывать вопросы, обстоятельства и потребности человека. Создавать пространство, где можно спокойно говорить о своём здоровье."],
        ["Ответственный подход", "Опираться на медицинские знания, объяснять рекомендации и делать безопасность пациента приоритетом при принятии решений."],
        ["Забота на перспективу", "Помогать формировать здоровые привычки и уделять внимание профилактике, чтобы забота о себе стала частью повседневной жизни."],
      ],
      note: "Наш главный ориентир", statement: "За каждым обращением — человек, которому нужны внимание и поддержка.", next: "Наше видение", other: "vision",
    },
    vision: {
      label: "Видение", title: "Будущее медицины — ближе к человеку.",
      intro: "Мы видим «Нарамед» клиникой, которой семьи доверяют заботу о своём здоровье. Наше стремление — объединять современную медицину, доступный сервис и тёплое человеческое отношение.",
      caption: "Развиваться ради здоровья людей", alt: "Иллюстрация: светлое здание современной клиники",
      heading: "Клиника, с которой спокойно смотреть вперёд", description: "Для нас развитие — это путь к более понятной и удобной медицинской помощи. Мы стремимся выстраивать долгосрочные отношения с пациентами и поддерживать их на разных этапах жизни.",
      cards: [
        ["Доверие на годы", "Стремиться быть надёжным партнёром в вопросах здоровья, сохраняя открытость, уважение и преемственность заботы."],
        ["Развитие качества", "Совершенствовать профессиональные знания и подходы к работе, чтобы современные возможности медицины служили потребностям пациента."],
        ["Культура профилактики", "Создавать будущее, в котором люди обращаются к врачу не только при недомогании, но и для сохранения здоровья."],
      ],
      note: "Будущее, к которому мы стремимся", statement: "Медицина, в которой профессионализм и человечность всегда рядом.", next: "Наша миссия", other: "mission",
    },
  },
  kk: {
    home: "Басты бет", about: "Клиника туралы", brand: "НАРАМЕД · БІЗДІҢ БАҒЫТЫМЫЗ", appointment: "Қабылдауға жазылу",
    mission: {
      label: "Миссия", title: "Денсаулыққа қамқорлық. Әр адамның жанынан табылу.",
      intro: "«Нарамед» миссиясы — адамдарға денсаулығын сақтауға көмектесу және медициналық көмекті ықыласпен, құрметпен әрі түсіністікпен ұсыну. Біз үшін қамқорлық пациентті тыңдай білуден басталады.",
      caption: "Жұмысымыздың басты құндылығы — адам", alt: "Иллюстрация: дәрігер пациентпен әңгімелесіп отыр",
      heading: "Сенімнен басталатын қамқорлық", description: "Әр пациент өз денсаулығының жағдайын, тексерулердің мақсатын және келесі қадамды түсінгенін қалаймыз. Ашық диалог пен ұқыпты қарым-қатынас — миссиямыздың негізі.",
      cards: [
        ["Әр адамға көңіл бөлу", "Адамның сұрақтарын, жағдайын және қажеттіліктерін ескеру. Денсаулығы туралы еркін сөйлесуге қолайлы орта қалыптастыру."],
        ["Жауапты көзқарас", "Медициналық білімге сүйену, ұсыныстарды түсіндіру және шешім қабылдауда пациент қауіпсіздігін басты орынға қою."],
        ["Болашаққа қамқорлық", "Салауатты әдеттерді қалыптастыруға көмектесу және алдын алуға көңіл бөлу. Өзіне қамқорлық жасауды күнделікті өмірдің бір бөлігіне айналдыру."],
      ],
      note: "Біздің басты бағдарымыз", statement: "Әр өтініштің артында көңіл бөлу мен қолдауды қажет ететін адам бар.", next: "Біздің көзқарасымыз", other: "vision",
    },
    vision: {
      label: "Көзқарас", title: "Медицинаның болашағы — адамға жақын болу.",
      intro: "Біз «Нарамедті» отбасылар өз денсаулығын сеніп тапсыратын клиника ретінде көреміз. Біздің ұмтылысымыз — заманауи медицинаны, қолжетімді қызметті және жылы қарым-қатынасты біріктіру.",
      caption: "Адамдардың денсаулығы үшін даму", alt: "Иллюстрация: заманауи клиниканың жарық ғимараты",
      heading: "Болашаққа сеніммен қарайтын клиника", description: "Біз үшін даму — медициналық көмекті түсінікті әрі ыңғайлы ету жолы. Пациенттермен ұзақ мерзімді қарым-қатынас орнатып, өмірінің әр кезеңінде қолдау көрсетуге ұмтыламыз.",
      cards: [
        ["Ұзақ мерзімді сенім", "Ашықтықты, құрметті және қамқорлықтың сабақтастығын сақтай отырып, денсаулық мәселелерінде сенімді серіктес болуға ұмтылу."],
        ["Сапаны дамыту", "Заманауи медицинаның мүмкіндіктері пациент қажеттіліктеріне қызмет етуі үшін кәсіби білім мен жұмыс тәсілдерін жетілдіру."],
        ["Алдын алу мәдениеті", "Адамдар дәрігерге ауырғанда ғана емес, денсаулығын сақтау үшін де жүгінетін болашақты қалыптастыру."],
      ],
      note: "Біз ұмтылатын болашақ", statement: "Кәсібилік пен адамгершілік әрдайым қатар жүретін медицина.", next: "Біздің миссиямыз", other: "mission",
    },
  },
};
const icons = [HeartHandshake, ShieldCheck, Sprout];

export default function ClinicPurpose({ section }) {
  const { language } = useLanguage();
  const copy = content[language] || content.ru;
  const page = copy[section];
  return <><Navbar /><main className="purpose-page">
    <nav className="purpose-breadcrumb" aria-label={language === "kk" ? "Навигация жолы" : language === "en" ? "Breadcrumb" : "Хлебные крошки"}>
      <Link to="/">{copy.home}</Link><span>/</span><Link to="/about/clinic">{copy.about}</Link><span>/</span><span aria-current="page">{page.label}</span>
    </nav>
    <section className="purpose-hero" aria-labelledby="purpose-title">
      <div className="purpose-copy"><p className="purpose-eyebrow">{copy.brand}</p><h1 id="purpose-title">{page.label}</h1><h2>{page.title}</h2><p className="purpose-intro">{page.intro}</p><AppointmentLink className="purpose-button">{copy.appointment}<ArrowRight size={18} aria-hidden="true" /></AppointmentLink></div>
      <figure className="purpose-photo"><img src={section === "mission" ? consultation : clinic} alt={page.alt} /><figcaption><span>NARAMED</span>{page.caption}</figcaption></figure>
    </section>
    <section className="purpose-values" aria-labelledby="purpose-values-title"><header><p className="purpose-eyebrow">{page.label} · NARAMED</p><h2 id="purpose-values-title">{page.heading}</h2><p>{page.description}</p></header>
      <div className="purpose-grid">{page.cards.map(([title, description], index) => { const Icon = icons[index]; return <article key={title}><div className="purpose-card-top"><Icon size={25} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{description}</p></article>; })}</div>
    </section>
    <section className="purpose-statement"><div><p className="purpose-eyebrow">{page.note}</p><h2>{page.statement}</h2></div><Link to={`/about/${page.other}`}>{page.next}<ArrowRight size={20} aria-hidden="true" /></Link></section>
  </main><Footer /></>;
}
