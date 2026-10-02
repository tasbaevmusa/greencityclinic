import React from "react";
import { useLanguage } from "../i18n/LanguageContext";

export default function ContentStatus({ loading, error, retry }) {
  const { language } = useLanguage();
  if (error) return <div role="alert"><p>{language === "kk" ? "Деректерді жүктеу мүмкін болмады." : language === "en" ? "Could not load the data." : "Не удалось загрузить данные."}</p><button onClick={retry}>{language === "kk" ? "Қайталау" : language === "en" ? "Try Again" : "Попробовать снова"}</button></div>;
  return loading ? <p role="status">{language === "kk" ? "Жүктелуде…" : language === "en" ? "Loading…" : "Загрузка…"}</p> : null;
}
