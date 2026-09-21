import React from "react";
import { ExternalLink } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import flagImage from "../Assets/kazakhstan-flag.jpg";
import emblemImage from "../Assets/kazakhstan-emblem.jpg";
import "../Styles/StateSymbols.css";
import { useLanguage } from "../i18n/LanguageContext";

const copy = {
  ru: {
    eyebrow: "РЕСПУБЛИКА КАЗАХСТАН",
    title: "Государственные символы",
    intro: "Флаг, Герб и Гимн воплощают суверенитет, единство народа, историю и будущее нашей страны.",
    day: "4 июня — День государственных символов Республики Казахстан",
    nav: ["Флаг", "Герб", "Гимн"],
    flag: { title: "Государственный Флаг", lead: "Небесно-голубое полотнище — образ мира, благополучия и единства.", text: "В центре изображено золотое солнце с лучами, под ним — парящий степной орёл. У древка расположен национальный орнамент. Автор флага — заслуженный деятель искусств Казахстана Шакен Ниязбеков.", facts: ["Утверждён в 1992 году", "Соотношение сторон — 1:2", "Голубой и золотой цвета"] },
    emblem: { title: "Государственный Герб", lead: "Шанырак в центре герба символизирует общий дом и единство народа Казахстана.", text: "От шанырака расходятся уыки, словно солнечные лучи. По сторонам расположены мифические крылатые кони, сверху — пятиконечная звезда, снизу — надпись «QAZAQSTAN». Авторы герба — архитекторы Жандарбек Малибеков и Шот-Аман Валиханов.", facts: ["Утверждён 4 июня 1992 года", "Круглая форма", "Шанырак, тулпары и звезда"] },
    anthem: { title: "Государственный Гимн", lead: "«Менің Қазақстаным» — торжественная песня о Родине, свободе и силе народа.", text: "Современный Государственный гимн утверждён 6 января 2006 года. Музыка — Шамши Калдаякова, слова — Жумекена Нажимеденова и Нурсултана Назарбаева.", name: "Менің Қазақстаным", meta: "Государственный гимн Республики Казахстан", etiquette: "При публичном исполнении гимна принято слушать его стоя, повернувшись к Государственному Флагу.", official: "Официальная информация" },
  },
  kk: {
    eyebrow: "ҚАЗАҚСТАН РЕСПУБЛИКАСЫ",
    title: "Мемлекеттік рәміздер",
    intro: "Ту, Елтаңба және Әнұран еліміздің егемендігін, халық бірлігін, тарихы мен болашағын бейнелейді.",
    day: "4 маусым — Қазақстан Республикасының Мемлекеттік рәміздер күні",
    nav: ["Ту", "Елтаңба", "Әнұран"],
    flag: { title: "Мемлекеттік Ту", lead: "Көк аспан түстес байрақ — бейбітшілік, береке және бірліктің нышаны.", text: "Ортасында сәулелі алтын күн, оның астында қалықтаған дала қыраны бейнеленген. Ту сабының тұсында ұлттық өрнек орналасқан. Тудың авторы — Қазақстанның еңбек сіңірген өнер қайраткері Шәкен Ниязбеков.", facts: ["1992 жылы қабылданды", "Арақатынасы — 1:2", "Көк және алтын түстер"] },
    emblem: { title: "Мемлекеттік Елтаңба", lead: "Елтаңбаның ортасындағы шаңырақ — ортақ үй мен Қазақстан халқы бірлігінің белгісі.", text: "Шаңырақтан күн сәулесіндей уықтар тарайды. Екі жағында қанатты пырақтар, жоғарыда бес бұрышты жұлдыз, төменде «QAZAQSTAN» жазуы бар. Авторлары — сәулетшілер Жандарбек Мәлібеков пен Шот-Аман Уәлиханов.", facts: ["1992 жылғы 4 маусымда қабылданды", "Дөңгелек пішінді", "Шаңырақ, пырақтар және жұлдыз"] },
    anthem: { title: "Мемлекеттік Әнұран", lead: "«Менің Қазақстаным» — Отан, еркіндік және халықтың рухы туралы салтанатты ән.", text: "Қазіргі Мемлекеттік әнұран 2006 жылғы 6 қаңтарда бекітілді. Әні — Шәмші Қалдаяқовтікі, сөздері — Жұмекен Нәжімеденов пен Нұрсұлтан Назарбаевтікі.", name: "Менің Қазақстаным", meta: "Қазақстан Республикасының Мемлекеттік әнұраны", etiquette: "Әнұран көпшілік алдында орындалған кезде оны орнынан тұрып, Мемлекеттік Туға қарап тыңдау дәстүрі бар.", official: "Ресми ақпарат" },
  },
};

function StateSymbols() {
  const { language } = useLanguage();
  const c = copy[language] || copy.ru;
  return <>
    <Navbar />
    <main className="symbols-page">
      <header className="symbols-container symbols-heading">
        <p className="symbols-eyebrow">{c.eyebrow}</p>
        <h1>{c.title}</h1>
        <p className="symbols-intro">{c.intro}</p>
        <p className="symbols-day">{c.day}</p>
      </header>
      <nav className="symbols-container symbols-jump" aria-label={c.title}>
        {c.nav.map((item, index) => <a key={item} href={`#symbol-${index + 1}`}>{item}</a>)}
      </nav>
      <div className="symbols-container symbols-content">
        <section id="symbol-1" className="symbol-section" aria-labelledby="flag-title">
          <div className="symbol-visual flag-visual"><img src={flagImage} alt={c.flag.title} width="750" height="357" /></div>
          <SymbolCopy id="flag-title" data={c.flag} />
        </section>
        <section id="symbol-2" className="symbol-section" aria-labelledby="emblem-title">
          <div className="symbol-visual emblem-visual"><img src={emblemImage} alt={c.emblem.title} width="750" height="778" loading="lazy" /></div>
          <SymbolCopy id="emblem-title" data={c.emblem} />
        </section>
        <section id="symbol-3" className="symbol-section" aria-labelledby="anthem-title">
          <div className="anthem-heading">
            <span>{c.nav[2]}</span><p lang="kk">{c.anthem.name}</p>
            <a href="https://www.akorda.kz/ru/state_symbols/kazakhstan_anthem" target="_blank" rel="noreferrer">{language === "kk" ? "Әнұранның ресми беті" : "Официальная страница гимна"}<ExternalLink size={14} /></a>
          </div>
          <SymbolCopy id="anthem-title" data={c.anthem} />
        </section>
        <a className="symbols-source" href="https://www.akorda.kz/ru/state_symbols/about_state_symbols" target="_blank" rel="noreferrer">{c.anthem.official} · Akorda.kz<ExternalLink size={14} /></a>
      </div>
    </main>
    <Footer />
  </>;
}

function SymbolCopy({ id, data }) {
  return <div className="symbol-copy">
    <h2 id={id}>{data.title}</h2>
    <p className="symbol-lead">{data.lead}</p>
    <p className="symbol-text">{data.text}</p>
    {data.facts && <ul>{data.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>}
  </div>;
}

export default StateSymbols;
