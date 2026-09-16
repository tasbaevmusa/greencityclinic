import React from "react";
import Navbar from "../Components/Navbar";
import "../Styles/PriceList.css";
import { useLanguage } from "../i18n/LanguageContext";

function PriceList() {
  const { t } = useLanguage();
  const pdfUrl = `${process.env.PUBLIC_URL}/documents/prices.pdf`;
  return <>
    <Navbar />
    <main className="price-list-page">
      <header className="price-list-heading">
        <div><p>{t.pricePage.label}</p><h1>{t.pricePage.title}</h1><span>{t.pricePage.intro}</span></div>
        <div className="price-list-actions"><a href={pdfUrl} target="_blank" rel="noreferrer">{t.pricePage.open}</a><a href={pdfUrl} download>{t.pricePage.download}</a></div>
      </header>
      <div className="price-list-document">
        <iframe src={`${pdfUrl}#view=FitH`} title={t.pricePage.frameTitle} />
        <p><a href={pdfUrl} target="_blank" rel="noreferrer">{t.pricePage.fallback}</a></p>
      </div>
    </main>
  </>;
}

export default PriceList;
