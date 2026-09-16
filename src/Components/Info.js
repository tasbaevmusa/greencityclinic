import React from "react";

import {
  HousePlus,
  UserRound,
  Monitor,
  CalendarCheck,
  BriefcaseMedical,
  Asterisk,
  ExternalLink,
} from "lucide-react";

import "../Styles/ServicesGrid.css";
import { useLanguage } from "../i18n/LanguageContext";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Электронное правительство",
    icon: HousePlus,
    link: "https://egov.kz",
  },
  {
    title: "Вызов врача на дом",
    icon: UserRound,
    link: "/services/doctor-home",
  },
  {
    title: "Личный кабинет пациента",
    icon: Monitor,
    link: "/services/patient-cabinet",
  },
  {
    title: "Запись на прием",
    icon: CalendarCheck,
    link: "https://wa.me/77075340824",
  },
  {
    title: "Прикрепление к учреждению",
    icon: BriefcaseMedical,
    link: "/services/attachment",
  },
  {
    title: "ОСМС",
    icon: Asterisk,
    link: "/services/osms",
  },
];

function Info() {
  const { t } = useLanguage();
  return (
    <section className="services-section" id="services">
      <div className="services-grid">
        {services.map(({ icon: Icon, link }, index) => {
          const title = t.services[index];
          const isExternal = link.startsWith("http");

          const CardLink = isExternal ? "a" : Link;
          const linkProps = isExternal ? { href: link, target: "_blank", rel: "noopener noreferrer" } : { to: link };
          return (
            <CardLink
              {...linkProps}
              className="service-card"
              key={title}
            >
              <div className="service-card__left">
                <div className="service-card__icon">
                  <Icon size={23} strokeWidth={2.5} />
                </div>

                <span className="service-card__title">{title}</span>
              </div>

              <ExternalLink
                className="service-card__external"
                size={17}
                strokeWidth={1.8}
              />
            </CardLink>
          );
        })}
      </div>
    </section>
  );
}

export default Info;
