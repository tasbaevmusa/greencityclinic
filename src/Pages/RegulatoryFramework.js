import React, { useMemo, useState } from "react";
import { BookOpen, ExternalLink, FileText, Search, Scale } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/RegulatoryFramework.css";

const documents = [
  { category: "codes", title: "Конституция Республики Казахстан", number: "30 августа 1995 года", url: "K950001000_" },
  { category: "codes", title: "Кодекс Республики Казахстан «О здоровье народа и системе здравоохранения»", number: "7 июля 2020 года № 360-VI", url: "K2000000360" },
  { category: "codes", title: "Социальный кодекс Республики Казахстан", number: "20 апреля 2023 года № 224-VII", url: "K2300000224" },
  { category: "laws", title: "Об обязательном социальном медицинском страховании", number: "Закон РК от 16 ноября 2015 года № 405-V", url: "Z1500000405" },
  { category: "government", title: "Об утверждении перечня гарантированного объёма бесплатной медицинской помощи", number: "Постановление Правительства РК от 16 октября 2020 года № 672", url: "P2000000672" },
  { category: "government", title: "Об утверждении перечня медицинской помощи в системе обязательного социального медицинского страхования", number: "Постановление Правительства РК от 20 июня 2019 года № 421", url: "P1900000421" },
  { category: "orders", title: "Об утверждении Правил оказания первичной медико-санитарной помощи", number: "Приказ Министра здравоохранения РК от 24 августа 2021 года № ҚР ДСМ-90", url: "V2100024094" },
  { category: "orders", title: "Об утверждении правил прикрепления физических лиц к организациям здравоохранения, оказывающим первичную медико-санитарную помощь", number: "Приказ Министра здравоохранения РК от 13 ноября 2020 года № ҚР ДСМ-194/2020", url: "V2000021642" },
  { category: "orders", title: "Об утверждении Стандарта организации оказания первичной медико-санитарной помощи в Республике Казахстан", number: "Приказ Министра здравоохранения РК от 30 марта 2023 года № 49", url: "V2300032160" },
  { category: "orders", title: "Об утверждении целевых групп лиц, подлежащих скрининговым исследованиям, правил, объёма и периодичности их проведения", number: "Приказ и. о. Министра здравоохранения РК от 30 октября 2020 года № ҚР ДСМ-174/2020", url: "V2000021572" },
  { category: "orders", title: "Об утверждении правил, объёма и периодичности проведения профилактических медицинских осмотров целевых групп населения", number: "Приказ Министра здравоохранения РК от 15 декабря 2020 года № ҚР ДСМ-264/2020", url: "V2000021820" },
  { category: "orders", title: "Об утверждении санитарных правил для объектов здравоохранения", number: "Приказ Министра здравоохранения РК от 11 августа 2020 года № ҚР ДСМ-96/2020", url: "V2000021080" },
  { category: "orders", title: "Об утверждении правил организации и проведения внутренней и внешней экспертиз качества медицинских услуг", number: "Приказ Министра здравоохранения РК от 3 декабря 2020 года № ҚР ДСМ-230/2020", url: "V2000021727" },
  { category: "orders", title: "Об утверждении правил проведения экспертизы временной нетрудоспособности и выдачи листа или справки", number: "Приказ Министра здравоохранения РК от 18 ноября 2020 года № ҚР ДСМ-198/2020", url: "V2000021660" },
  { category: "orders", title: "Об утверждении правил оказания специализированной медицинской помощи в амбулаторных условиях", number: "Приказ Министра здравоохранения РК от 27 апреля 2022 года № ҚР ДСМ-37", url: "V2200027833" },
  { category: "orders", title: "Об утверждении стандарта организации оказания медицинской реабилитации", number: "Приказ Министра здравоохранения РК от 7 апреля 2023 года № 65", url: "V2300032263" },
];

export default function RegulatoryFramework() {
  const { language } = useLanguage();
  const kk = language === "kk";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const labels = kk ? {
    eyebrow: "КЛИНИКА ҚҰЖАТТАРЫ", title: "Нормативтік-құқықтық база", intro: "Қазақстан Республикасының денсаулық сақтау саласындағы негізгі нормативтік құқықтық актілері.",
    search: "Құжатты атауы немесе нөмірі бойынша іздеу", all: "Барлығы", codes: "Кодекстер", laws: "Заңдар", government: "Үкімет қаулылары", orders: "Бұйрықтар", open: "Әділет жүйесінде ашу", empty: "Құжаттар табылмады", note: "Құжаттардың өзекті редакциясы ресми «Әділет» ақпараттық-құқықтық жүйесінде қолжетімді."
  } : {
    eyebrow: "ДОКУМЕНТЫ КЛИНИКИ", title: "Нормативно-правовая база", intro: "Основные нормативные правовые акты Республики Казахстан в сфере здравоохранения.",
    search: "Поиск по названию или номеру документа", all: "Все", codes: "Кодексы", laws: "Законы", government: "Постановления", orders: "Приказы", open: "Открыть в системе «Әділет»", empty: "Документы не найдены", note: "Актуальная редакция документов доступна в официальной информационно-правовой системе «Әділет»."
  };
  const categories = ["all", "codes", "laws", "government", "orders"];
  const filtered = useMemo(() => documents.filter((document) =>
    (category === "all" || document.category === category) &&
    `${document.title} ${document.number}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [category, query]);

  return <div className="regulatory-page">
    <Navbar />
    <main>
      <header className="regulatory-hero">
        <span><Scale size={17} />{labels.eyebrow}</span>
        <h1>{labels.title}</h1>
        <p>{labels.intro}</p>
      </header>
      <section className="regulatory-content">
        <div className="regulatory-tools">
          <label><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search} /></label>
          <div className="regulatory-filters">{categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{labels[item]}</button>)}</div>
        </div>
        <div className="regulatory-note"><BookOpen aria-hidden="true" /><p>{labels.note}</p></div>
        <div className="regulatory-list">{filtered.map((document, index) => <article key={document.url}>
          <span className="regulatory-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="regulatory-icon"><FileText aria-hidden="true" /></span>
          <div><small>{labels[document.category]}</small><h2>{document.title}</h2><p>{document.number}</p></div>
          <a href={`https://adilet.zan.kz/${kk ? "kaz" : "rus"}/docs/${document.url}`} target="_blank" rel="noopener noreferrer">{labels.open}<ExternalLink aria-hidden="true" /></a>
        </article>)}</div>
        {!filtered.length && <div className="regulatory-empty"><Search /><p>{labels.empty}</p></div>}
      </section>
    </main>
    <Footer />
  </div>;
}
