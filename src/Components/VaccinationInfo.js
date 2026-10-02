import React from "react";
import { ShieldCheck, Baby, CalendarDays, Users, Syringe, ArrowUpRight } from "lucide-react";
import "../Styles/VaccinationInfo.css";

export default function VaccinationInfo({ language }) {
  const kk = language === "kk";
  const en = language === "en";
  const groups = [
    { age: kk ? "1 жас" : en ? "1 year" : "1 год", icon: Baby, vaccines: [en ? "MMR" : "ККП", en ? "OPV" : "ОПВ"], tone: "mint" },
    { age: kk ? "6 жас" : en ? "6 years" : "6 лет", icon: CalendarDays, vaccines: [en ? "MMR" : "ККП"], tone: "blue" },
    { age: kk ? "11–17 жас" : "11–17", icon: ShieldCheck, vaccines: [kk ? "АПВ" : en ? "HPV" : "ВПЧ"], tone: "violet" },
    { age: kk ? "Ересектерге" : en ? "Adults" : "Взрослым", icon: Users, vaccines: [kk ? "А гепатиті" : en ? "Hepatitis A" : "Гепатит А"], tone: "sand" },
  ];
  const message = kk ? "Сәлеметсіз бе! Вакцинация туралы ақпарат алғым келеді." : en ? "Hello! I would like information about vaccination." : "Здравствуйте! Хочу уточнить информацию о вакцинации.";
  const text = kk ? { eyebrow: "БІЗДЕ ҚОЛЖЕТІМДІ", title: "Балалар мен ересектерге арналған екпелер", intro: "Клиникамызда төмендегі екпелер бар. Қажетті вакцинаны және қабылдау уақытын нақтылау үшін бізге хабарласыңыз.", byAge: "Жас бойынша екпелер", available: "Клиникада қолжетімді", more: "Сондай-ақ қолжетімді", timing: "Жас пен егу мерзімін клиникадан нақтылаңыз.", questions: "Екпелер туралы сұрағыңыз бар ма?", ask: "Вакцинация туралы сұрау" } : en ? { eyebrow: "AVAILABLE AT OUR CLINIC", title: "Vaccinations for Children and Adults", intro: "The following vaccines are available at our clinic. Contact us to confirm availability and appointment times.", byAge: "Vaccinations by Age", available: "Available at the clinic", more: "Also Available", timing: "Please confirm age requirements and vaccination timing with the clinic.", questions: "Questions about vaccinations?", ask: "Ask About Vaccination" } : { eyebrow: "ДОСТУПНО В НАШЕЙ КЛИНИКЕ", title: "Прививки для детей и взрослых", intro: "В нашей клинике доступны следующие прививки. Свяжитесь с нами, чтобы уточнить нужную вакцину и время приёма.", byAge: "Прививки по возрасту", available: "Доступно в клинике", more: "Также доступны", timing: "Возраст и сроки вакцинации уточняйте в клинике.", questions: "Есть вопросы о прививках?", ask: "Уточнить о вакцинации" };

  return <div className="vaccination-content">
    <section className="vaccination-intro">
      <span className="vaccination-emblem"><ShieldCheck size={36} aria-hidden="true" /></span>
      <div>
        <span className="vaccination-eyebrow">{text.eyebrow}</span><h2>{text.title}</h2><p>{text.intro}</p>
      </div>
    </section>
    <section aria-labelledby="vaccination-ages">
      <h2 className="vaccination-section-title" id="vaccination-ages">{text.byAge}</h2>
      <ul className="vaccination-grid">
        {groups.map(({ age, icon: Icon, vaccines, tone }) => <li className={`vaccination-card vaccination-card--${tone}`} key={age}>
          <div className="vaccination-card-top"><span className="vaccination-icon"><Icon size={25} aria-hidden="true" /></span><span className="vaccination-age">{age}</span></div>
          <h3>{vaccines.join(" + ")}</h3>
          <p>{text.available}</p>
        </li>)}
      </ul>
    </section>
    <section className="vaccination-additional">
      <span className="vaccination-icon"><Syringe size={26} aria-hidden="true" /></span>
      <div><h2>{text.more}</h2><p className="vaccination-vaccines">{en ? "DTP" : "АКДС"} <span aria-hidden="true">·</span> {en ? "Td" : "АДС-М"}</p><p>{text.timing}</p></div>
    </section>
    <div className="vaccination-contact"><p>{text.questions}</p><a href={`https://wa.me/77075340824?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">{text.ask}<ArrowUpRight size={20} aria-hidden="true" /></a></div>
  </div>;
}
