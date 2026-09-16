import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Eye,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";

import Logo from "../Assets/logo.png";
import "../Styles/Navbar.css";
import { useLanguage } from "../i18n/LanguageContext";

function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const menu = [
    ["home", "/"],
    ["about", "/about/vision"],
    ["doctors", "/#doctors"],
    ["services", "/#services"],
    ["patients", "/patients/attachment"],
    ["news", "/#news"],
    ["gallery", "/#gallery"],
    ["contact", "/#contact"],
  ];
  const aboutMenu = [
    [t.aboutMenu.vision, "/about/vision"],
    [t.aboutMenu.mission, "/about/mission"],
    [t.aboutMenu.achievements, "/about/achievements"],
    [t.aboutMenu.vacancies, "/vacancies"],
    [t.aboutMenu.schedule, "/doctors-schedule"],
    [language === "kk" ? "Құқықтық ақпарат" : "Правовая информация", "/legal"],
    [t.nav.news, "/#news"],
    [t.nav.contact, "/#contact"],
  ];
  const servicesMenu = [[t.priceList, "/services/price-list"]];
  const patientMenu = language === "kk"
    ? [["Емханаға тіркелу", "/patients/attachment"], ["Тіркелу", "/appointment"], ["Денсаулық мектебі", "/patients/health-school"], ["Вакцинация", "/patients/vaccination"], ["Скринингтер", "/patients/screenings"], ["ҚҰЖАТТАР", null], ["Сұрақ-жауап", "/#faq"]]
    : [["Прикрепление к поликлинике", "/patients/attachment"], ["Прикрепиться", "/appointment"], ["Школа здоровья", "/patients/health-school"], ["Вакцинация", "/patients/vaccination"], ["Скрининги", "/patients/screenings"], ["ДОКУМЕНТЫ", null], ["Вопрос-ответ", "/#faq"]];
  const dropdowns = { about: aboutMenu, services: servicesMenu, patients: patientMenu };
  const whatsappUrl = "https://wa.me/77075340824";
  const renderMenuLink = ([label, to]) => !to
    ? <p key={label} className="patient-dropdown-label">{label}</p>
    : to.startsWith("https://")
    ? <a key={label} href={to} target="_blank" rel="noopener noreferrer">{label}</a>
    : <Link key={label} to={to}>{label}</Link>;

  const labels = language === "kk"
    ? { address: "Алматы қ., Думан-2, 61", hours: "Күн сайын 08:00–21:00", accessibility: "Нашар көретіндерге арналған нұсқа", openMenu: "Мәзірді ашу", closeMenu: "Мәзірді жабу" }
    : { address: "г. Алматы, Думан-2, 61", hours: "Ежедневно 08:00–21:00", accessibility: "Версия для слабовидящих", openMenu: "Открыть меню", closeMenu: "Закрыть меню" };
  const navLabels = language === "kk"
    ? { patients: "Пациенттерге", gallery: "Галерея" }
    : { patients: "Пациентам", gallery: "Галерея" };

  useEffect(() => {
    setNavOpen(false);
    setMobileSection(null);
  }, [location.pathname, location.hash]);

  const openAccessibility = () => {
    document.querySelector(".accessibility-trigger")?.click();
  };

  const isActive = (key) => {
    if (key === "home") return location.pathname === "/" && !location.hash;
    if (key === "about") return location.pathname.startsWith("/about") || location.pathname === "/vacancies";
    if (key === "services") return location.pathname.startsWith("/services") || location.hash === "#services";
    if (key === "patients") return location.pathname.startsWith("/patients") || location.pathname === "/appointment" || location.hash === "#faq";
    return location.hash === `#${key}`;
  };

  return (
    <header className="site-header">
      <div className="header-utility">
        <div className="header-container utility-inner">
          <div className="utility-details">
            <a href="https://go.2gis.com/" target="_blank" rel="noopener noreferrer"><MapPin size={14} />{labels.address}</a>
            <span><Clock3 size={14} />{labels.hours}</span>
            <a href="tel:+77075340824"><Phone size={14} />+7 (707) 534-08-24</a>
          </div>
          <div className="utility-actions">
            <div className="header-languages" aria-label="Выбор языка">
              {["kk", "ru"].map((code) => (
                <button type="button" key={code} className={language === code ? "active" : ""} onClick={() => setLanguage(code)}>
                  {code === "kk" ? "ҚАЗ" : "РУС"}
                </button>
              ))}
            </div>
            <button type="button" className="header-accessibility" onClick={openAccessibility}>
              <Eye size={15} /> <span>{labels.accessibility}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="header-container header-main-inner">
          <Link to="/" className="navbar-logo" onClick={() => window.scrollTo(0, 0)} aria-label={t.nav.home}>
            <span className="navbar-logo-image"><img src={Logo} alt="НАРАМЕД" /></span>
            <span className="navbar-logo-copy"><strong>НАРАМЕД</strong><small>{t.clinic}</small></span>
          </Link>

          <nav className="desktop-nav" aria-label="Основная навигация">
            <ul>
              {menu.map(([key, href]) => (
                <li key={key} className={dropdowns[key] ? "nav-dropdown" : ""}>
                  <Link className={isActive(key) ? "active" : ""} to={href}>
                    {t.nav[key] || navLabels[key]} {dropdowns[key] && <ChevronDown className="dropdown-arrow" size={14} />}
                  </Link>
                  {dropdowns[key] && <div className={`nav-dropdown-menu ${key === "about" ? "about-dropdown-menu" : ""} ${key === "patients" ? "patient-dropdown-menu" : ""}`}>
                    {key === "about" ? <>
                      <div className="about-dropdown-intro">
                        {aboutMenu.slice(0, 2).map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
                      </div>
                      <p className="about-dropdown-label">{language === "kk" ? "Клиника туралы ақпарат" : "Информация о клинике"}</p>
                      <div className="about-dropdown-grid">
                        {aboutMenu.slice(2).map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
                      </div>
                    </> : dropdowns[key].map(renderMenuLink)}
                  </div>}
                </li>
              ))}
            </ul>
          </nav>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="appointment-btn">
            <span>{t.appointment}</span><ArrowRight size={17} />
          </a>

          <button type="button" className="mobile-toggle" onClick={() => setNavOpen((value) => !value)} aria-expanded={navOpen} aria-label={navOpen ? labels.closeMenu : labels.openMenu}>
            {navOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${navOpen ? "show" : ""}`}>
        <div className="mobile-menu-inner">
          {menu.map(([key, href]) => dropdowns[key] ? (
            <div className="mobile-nav-group" key={key}>
              <div><Link to={href}>{t.nav[key] || navLabels[key]}</Link><button type="button" aria-label={`${t.nav[key] || navLabels[key]}: ${mobileSection === key ? labels.closeMenu : labels.openMenu}`} onClick={() => setMobileSection(mobileSection === key ? null : key)} aria-expanded={mobileSection === key}><ChevronDown size={18} /></button></div>
              {mobileSection === key && <div className="mobile-submenu">{dropdowns[key].map(renderMenuLink)}</div>}
            </div>
          ) : <Link className="mobile-direct-link" key={key} to={href}>{t.nav[key] || navLabels[key]}</Link>)}
          <div className="mobile-contact"><a href="tel:+77075340824"><Phone size={17} />+7 (707) 534-08-24</a><span><MapPin size={17} />{labels.address}</span></div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="appointment-btn mobile-btn"><span>{t.appointment}</span><ArrowRight size={17} /></a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
