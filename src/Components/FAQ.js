import React, { useState } from "react";
import { ArrowRight, ArrowUp, Plus, HeartPulse, MessageCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/FAQ.css";

const content = {
  ru: {
    label: "ВОПРОС–ОТВЕТ",
    title: "Ответим на частые вопросы",
    description: "Собрали ответы на вопросы о записи на приём, прикреплении к клинике, ОСМС и вызове врача.",
    more: "Все вопросы и ответы", less: "Показать меньше",
    help: "Остались вопросы?", support: "Команда НАРАМЕД поможет разобраться.", contact: "Написать в WhatsApp",
    questions: [
      ["Как записаться на приём к врачу?", "Напишите нам в WhatsApp или позвоните по номеру +7 (707) 534-08-24. Администратор поможет выбрать врача и согласовать время приёма."],
      ["Как прикрепиться к клинике?", "Свяжитесь с регистратурой НАРАМЕД: мы подскажем порядок прикрепления и какие документы понадобятся."],
      ["Как вызвать врача на дом?", "Позвоните в клинику или напишите в WhatsApp. Администратор уточнит возможность выезда, адрес и удобное время."],
      ["Как узнать об услугах по ОСМС?", "Обратитесь в регистратуру, чтобы уточнить доступные в клинике услуги по ОСМС и условия записи."],
      ["Где находится клиника?", "Наш адрес: г. Алматы, Думан-2, 61. Ссылку на карту и маршрут можно найти в разделе «Контакты»."],
      ["В какое время работает клиника?", "Мы работаем ежедневно с 08:00 до 21:00. Время приёма конкретного специалиста уточняйте при записи."],
    ],
  },
  kk: {
    label: "СҰРАҚ–ЖАУАП",
    title: "Жиі қойылатын сұрақтарға жауап береміз",
    description: "Қабылдауға жазылу, клиникаға тіркелу, МӘМС және дәрігерді үйге шақыру туралы сұрақтарға жауаптар жинадық.",
    more: "Барлық сұрақтар мен жауаптар", less: "Азырақ көрсету",
    help: "Сұрақтарыңыз бар ма?", support: "НАРАМЕД командасы көмектесуге дайын.", contact: "WhatsApp арқылы жазу",
    questions: [
      ["Дәрігердің қабылдауына қалай жазылуға болады?", "WhatsApp арқылы жазыңыз немесе +7 (707) 534-08-24 нөміріне қоңырау шалыңыз. Әкімші дәрігерді таңдауға және қабылдау уақытын келісуге көмектеседі."],
      ["Клиникаға қалай тіркелуге болады?", "НАРАМЕД тіркеу бөліміне хабарласыңыз: тіркелу тәртібін және қажетті құжаттар тізімін түсіндіреміз."],
      ["Дәрігерді үйге қалай шақыруға болады?", "Клиникаға қоңырау шалыңыз немесе WhatsApp арқылы жазыңыз. Әкімші үйге келу мүмкіндігін, мекенжайды және қолайлы уақытты нақтылайды."],
      ["МӘМС қызметтері туралы қалай білуге болады?", "Клиникада МӘМС бойынша қолжетімді қызметтер мен жазылу шарттарын білу үшін тіркеу бөліміне хабарласыңыз."],
      ["Клиника қайда орналасқан?", "Біздің мекенжай: Алматы қаласы, Думан-2, 61. Карта мен бағыт сілтемесін «Байланыс» бөлімінен таба аласыз."],
      ["Клиника қай уақытта жұмыс істейді?", "Күн сайын 08:00-ден 21:00-ге дейін жұмыс істейміз. Нақты маманның қабылдау уақытын жазылу кезінде анықтаңыз."],
    ],
  },
};

export default function FAQ() {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(0);
  const copy = content[language] || content.ru;
  const Icon = expanded ? ArrowUp : ArrowRight;

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-container">
        <div className="faq-intro">
          <p className="faq-label"><HeartPulse size={18} aria-hidden="true" />НАРАМЕД · {copy.label}</p>
          <h2 id="faq-title">{copy.title}</h2>
          <p className="faq-description">{copy.description}</p>
          <div className="faq-support">
            <MessageCircle size={24} aria-hidden="true" />
            <div><h3>{copy.help}</h3><p>{copy.support}</p>
              <a href="https://wa.me/77075340824" target="_blank" rel="noopener noreferrer">{copy.contact}<ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <div className="faq-answers" id="faq-answers">
          {copy.questions.slice(0, expanded ? copy.questions.length : 4).map(([question, answer], index) => (
            <article className={`faq-item ${openQuestion === index ? "is-open" : ""}`} key={index}>
              <h3><button type="button" id={`faq-question-${index}`} aria-expanded={openQuestion === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenQuestion(openQuestion === index ? null : index)}>
                <span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span>{question}</span><Plus className="faq-toggle" size={20} aria-hidden="true" />
              </button></h3>
              <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={openQuestion !== index}><p>{answer}</p></div>
            </article>
          ))}
          <button className="faq-more" type="button" aria-expanded={expanded} aria-controls="faq-answers" onClick={() => setExpanded(value => !value)}>
            {expanded ? copy.less : copy.more}<Icon size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
