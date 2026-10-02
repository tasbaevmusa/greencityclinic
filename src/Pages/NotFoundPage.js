import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function NotFoundPage() {
  const { language } = useLanguage();
  const copy = language === "en" ? ["Page not found.", "Back to Home"] : language === "kk" ? ["Бет табылмады.", "Басты бетке оралу"] : ["Страница не найдена.", "Вернуться на главную"];
  return (
    <div>
      <h1>404</h1>
      <p>{copy[0]}</p>
      <Link to="/">{copy[1]}</Link>
    </div>
  );
}

export default NotFoundPage;
