import React from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, ExternalLink } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import Logo from "../Assets/logo.png";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/Footer.css";

function Footer() {
  const { t } = useLanguage();
  const twoGisUrl = "https://2gis.kz/almaty/firm/70000001084000652?m=77.005043%2C43.286537%2F16";
  const whatsappUrl = "https://wa.me/77075340824";
  return <footer className="footer-section" id="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <Link to="/" className="footer-logo" aria-label={`НАРАМЕД — ${t.nav.home}`}>
          <span><img src={Logo} alt="НАРАМЕД" /></span>
          <div><strong>НАРАМЕД</strong><small>{t.clinic}</small></div>
        </Link>
        <p>{t.footer.description}</p>
      </div>

      <nav className="footer-column" aria-label={t.footer.navigation}>
        <h3>{t.footer.navigation}</h3>
        <Link to="/">{t.footer.home}</Link>
        <Link to="/#doctors">{t.footer.doctors}</Link>
        <Link to="/services/price-list">{t.footer.paid}</Link>
        <Link to="/#news">{t.footer.news}</Link>
        <Link to="/vacancies">{t.footer.vacancies}</Link>
      </nav>

      <div className="footer-column footer-contacts">
        <h3>{t.footer.contacts}</h3>
        <a href={twoGisUrl} target="_blank" rel="noreferrer"><MapPin size={17} /><span>{t.footer.address}</span></a>
        <a href="tel:+77075340824"><Phone size={17} /><span>+7 707 534 0824</span></a>
        <div><Clock size={17} /><span>{t.footer.schedule}</span></div>
      </div>

      <div className="footer-column">
        <h3>{t.footer.social}</h3>
        <a href="https://www.instagram.com/greencity.clinic/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /> Instagram</a>
        <a href={twoGisUrl} target="_blank" rel="noreferrer"><ExternalLink size={17} /> {t.footer.map}</a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-appointment">{t.footer.appointment}</a>
      </div>
    </div>

    <div className="footer-bottom"><div><span>© {new Date().getFullYear()} НАРАМЕД. {t.footer.rights}</span><Link to="/legal">{t.footer.legal}</Link></div></div>
  </footer>;
}

export default Footer;
