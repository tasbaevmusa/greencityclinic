import React from "react";
import ContentStatus from "./ContentStatus";
import { useNews } from "../data/NewsContext";
import "../Styles/News.css";
import { useLanguage } from "../i18n/LanguageContext";

function News() {
  const { news, loading, error, refresh } = useNews();
  const { language, t } = useLanguage();
  if (!news.length && !loading && !error) return null;
  return <section className="news-section" id="news">
      <div className="news-container">
      <header className="news-heading"><div><p>{t.newsSection.label}</p><h2>{t.newsSection.title}</h2></div><a href={`https://www.gov.kz/memleket/entities/dsm/press/news?lang=${language}`} target="_blank" rel="noreferrer">{t.newsSection.all}</a></header>
      <ContentStatus loading={loading} error={error} retry={refresh} />
      <div className="news-grid">{news.slice(0, 6).map((item) => { const localized = (item.translationKey && t.newsItems[item.translationKey]) || item; return <article className="news-card" key={item.id}>
        <span className="news-category">{localized.category}</span>
        <h3>{localized.title}</h3>
        <p>{localized.description}</p>
        <footer><small>{localized.source}</small><a href={item.url} target="_blank" rel="noreferrer">{t.newsSection.read} →</a></footer>
      </article>; })}</div>
    </div>
  </section>;
}

export default News;
