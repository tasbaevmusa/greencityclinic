import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const NewsContext = createContext(null);
const STORAGE_KEY = "naramed-news";

const defaultNews = [
  {
    id: "news-1",
    category: "Цифровая медицина",
    title: "В Казахстане формируется единая цифровая архитектура здравоохранения",
    description: "ЕГМИС объединит медицинские сервисы в экосистему E-Densaulyq. К декабрю 2026 года система должна стать основной платформой управления отраслью.",
    source: "Министерство здравоохранения РК",
    url: "https://www.gov.kz/memleket/entities/dsm/press/news/details/1159176?lang=ru"
  },
  {
    id: "news-2",
    category: "ОСМС",
    title: "Цифровизация здравоохранения и устойчивость системы ОСМС",
    description: "Около 17 млн казахстанцев охвачены системой ОСМС. Цифровые инструменты усиливают прозрачность, контроль качества и доступность медицинской помощи.",
    source: "Министерство здравоохранения РК",
    url: "https://www.gov.kz/memleket/entities/dsm/press/news/details/1128093?lang=ru"
  },
  {
    id: "news-3",
    category: "Здравоохранение",
    title: "Казахстан вошёл в топ стран по снижению смертности от хронических заболеваний",
    description: "Минздрав представил ключевые показатели отрасли: развитие онлайн-медицины, снижение материнской и младенческой смертности и укрепление кадрового потенциала.",
    source: "Министерство здравоохранения РК",
    url: "https://www.gov.kz/memleket/entities/dsm/press/news/details/1129298?lang=ru"
  }
];

export function NewsProvider({ children }) {
  const [news, setNews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultNews; }
    catch { return defaultNews; }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(news)), [news]);
  const value = useMemo(() => ({
    news,
    saveNews: (item) => setNews((current) => current.some((newsItem) => newsItem.id === item.id)
      ? current.map((newsItem) => newsItem.id === item.id ? item : newsItem)
      : [{ ...item, id: crypto.randomUUID() }, ...current]),
    deleteNews: (id) => setNews((current) => current.filter((item) => item.id !== id))
  }), [news]);
  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error("useNews must be used inside NewsProvider");
  return context;
}
