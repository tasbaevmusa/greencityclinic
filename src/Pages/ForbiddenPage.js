import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function ForbiddenPage() {
  const { language } = useLanguage();
  const copy = language === "en" ? ["You do not have access to this page.", "Back to Home"] : language === "kk" ? ["Бұл бетке кіруге рұқсатыңыз жоқ.", "Басты бетке оралу"] : ["У вас нет доступа к этой странице.", "Вернуться на главную"];
  return (
    <div>
      <h1>403</h1>
      <p>{copy[0]}</p>
      <Link to="/">{copy[1]}</Link>
    </div>
  );
}

export default ForbiddenPage;
