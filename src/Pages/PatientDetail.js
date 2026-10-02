import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import VaccinationInfo from "../Components/VaccinationInfo";
import { useLanguage } from "../i18n/LanguageContext";
import "../Styles/Vacancies.css";

const pages = {
  en: {
    attachment: ["FOR PATIENTS", "Clinic Registration", "Information about registering with NARAMED Clinic and the required documents."],
    "health-school": ["FOR PATIENTS", "Health Education", "Helpful information about preventing illness and maintaining good health."],
    vaccination: ["FOR PATIENTS", "Vaccination", "Information about available vaccinations, preparation and the vaccination process."],
    screenings: ["FOR PATIENTS", "Screenings", "Information about preventive examinations and early detection of disease."],
    "primary-care-procedure": ["FOR PATIENTS", "Primary Care Procedure"],
  },
  ru: {
    attachment: ["ПАЦИЕНТАМ", "Прикрепление к поликлинике", "Информация о прикреплении к клинике НАРАМЕД и перечне необходимых документов."],
    "health-school": ["ПАЦИЕНТАМ", "Школа здоровья", "Полезная информация о профилактике заболеваний и поддержании здоровья."],
    vaccination: ["ПАЦИЕНТАМ", "Вакцинация", "Информация о доступной вакцинации, подготовке и порядке проведения прививок."],
    screenings: ["ПАЦИЕНТАМ", "Скрининги", "Информация о профилактических обследованиях и ранней диагностике заболеваний."],
    "primary-care-procedure": ["ПАЦИЕНТАМ", "Порядок оказания первичной медико-санитарной помощи"],
  },
  kk: {
    attachment: ["ПАЦИЕНТТЕРГЕ", "Емханаға тіркелу", "НАРАМЕД клиникасына тіркелу және қажетті құжаттар туралы ақпарат."],
    "health-school": ["ПАЦИЕНТТЕРГЕ", "Денсаулық мектебі", "Аурулардың алдын алу және денсаулықты сақтау туралы пайдалы ақпарат."],
    vaccination: ["ПАЦИЕНТТЕРГЕ", "Вакцинация", "Қолжетімді вакцинация, дайындық және екпе жүргізу тәртібі туралы ақпарат."],
    screenings: ["ПАЦИЕНТТЕРГЕ", "Скринингтер", "Профилактикалық тексерулер және ауруларды ерте анықтау туралы ақпарат."],
    "primary-care-procedure": ["ПАЦИЕНТТЕРГЕ", "Порядок оказания первичной медико-санитарной помощи"],
  },
};

export default function PatientDetail() {
  const { section } = useParams();
  const { language } = useLanguage();
  const page = (pages[language] || pages.ru)[section];
  if (!page) return <Navigate to="/" replace />;

  const isPrimaryCareProcedure = section === "primary-care-procedure";
  const isScreenings = section === "screenings";
  const screeningCopy = language === "kk" ? {
    what: "Скрининг дегеніміз не",
    intro: "Скрининг — денсаулықтағы өзгерістерді ерте кезеңде анықтауға көмектесетін тегін профилактикалық тексеру. Өзіңізді жақсы сезінсеңіз де, тексеруден уақытылы өту аурудың алдын алуға және емді дер кезінде бастауға мүмкіндік береді.",
    types: "Емхана қандай скринингтер жүргізеді",
    items: [
      "Ересектердегі жүрек-қан тамырлары аурулары мен қауіп факторларын анықтауға арналған скрининг",
      "Әйелдерде жатыр мойны және сүт безі обырын анықтауға арналған скрининг",
      "Ас қорыту ағзаларының онкологиялық ауруларын анықтауға арналған скрининг",
      "Терідегі жаңа түзілістерді ерте анықтау",
      "Туберкулезді анықтауға арналған флюорографиялық тексеру"
    ],
    note: "Сізге қандай тексеру қажет екенін және оны қашан өтуге болатынын учаскелік дәрігер нақтылайды. Скрининг тіркелген пациенттер үшін мемлекеттік бағдарлама шеңберінде жүргізіледі.",
    appointment: "Скринингке жазылу",
    message: "Сәлеметсіз бе! НАРАМЕД клиникасында скринингке жазылғым келеді. Жақын күнді хабарлай аласыз ба?"
  } : language === "en" ? {
    what: "What Is Screening?",
    intro: "Screening is a free preventive check that can help identify changes in health at an early stage. Even if you feel well, timely screening can help prevent illness or start treatment early.",
    types: "Screenings Available at the Clinic",
    items: ["Screening adults for cardiovascular disease and risk factors", "Screening women for cervical and breast cancer", "Screening for cancers of the digestive system", "Early detection of skin growths", "Fluorography screening for tuberculosis"],
    note: "Your primary care doctor can advise which examinations are right for you and when to have them. Screening is provided to registered patients as part of the state program.",
    appointment: "Book a Screening", message: "Hello! I would like to book a screening at NARAMED Clinic. Please let me know the nearest available date."
  } : {
    what: "Что такое скрининг",
    intro: "Скрининг — бесплатная профилактическая проверка, которая помогает заметить изменения в здоровье на раннем этапе. Даже при хорошем самочувствии своевременное обследование позволяет предупредить заболевание или начать лечение вовремя.",
    types: "Какие скрининги проводит поликлиника",
    items: [
      "Скрининг на сердечно-сосудистые заболевания и факторы риска у взрослых",
      "Скрининг на выявление рака шейки матки и молочной железы у женщин",
      "Скрининг на онкологические заболевания органов пищеварения",
      "Раннее выявление новообразований кожи",
      "Флюорографическое обследование для выявления туберкулёза"
    ],
    note: "Какие обследования подходят именно вам и когда их пройти, подскажет участковый врач. Скрининг проводится для прикреплённого населения в рамках государственной программы.",
    appointment: "Записаться на скрининг",
    message: "Здравствуйте! Я хочу записаться на скрининг в клинике НАРАМЕД. Подскажите, пожалуйста, ближайшую дату."
  };
  const screeningWhatsApp = `https://wa.me/77075340824?text=${encodeURIComponent(screeningCopy.message)}`;

  return <><Navbar /><main className={`about-detail ${isPrimaryCareProcedure ? "patient-document" : ""} ${isScreenings ? "screening-page" : ""} ${section === "vaccination" ? "vaccination-page" : ""}`}><p>{page[0]}</p><h1>{page[1]}</h1><div>{section === "vaccination" ? <VaccinationInfo language={language} /> : isPrimaryCareProcedure ? <>
    <p className="patient-document-source"><strong><em>(Выписка из приказа И. о. Министра здравоохранения Республики Казахстан от 30 марта 2023 года № 49).</em></strong></p>
    <p><strong>72.</strong> ПМСП населению в центре ПМСП оказывают врач общей практики, семейный врач, терапевт, педиатр, СМР (фельдшер, акушер(ка), сестра (брат) медицинская(ий) расширенной практики, сестра или (брат) медицинская(ий) участковая(ый), сестра (брат) медицинская(ий) общей практики), психолог, социальный работник в амбулаторных условиях, на дому.</p>
    <p><strong>74.</strong> Обслуживание вызовов осуществляется врачом ПМСП в течение рабочего дня.</p>
    <p><strong>106.</strong> Медицинская помощь предоставляется после получения информированного согласия пациента либо его законного представителя согласно пункта 3, статьи 134 Кодекса.</p>
    <p><strong>107.</strong> Прием населения врачами ПМСП осуществляется по предварительной записи при самостоятельном обращении, посредством телефонной связи, через мобильные приложения МИС или через веб-портал «электронного правительства» (далее – ПЭП).</p>
    <p>При самостоятельном обращении или посредством телефонной связи пациента в организацию ПМСП, специалистами колл-центра или регистратуры вносится запись в журнал «Предварительная запись на прием к врачу» в МИС и в устной форме предоставляется ответ с указанием свободного времени и даты приема врача, в соответствии с графиком приема врача.</p>
    <p>При осуществлении записи на прием посредством мобильного приложения пациент видит часы приема и выбирает свободное время, дату приема. Пациенту уведомление о записи и напоминание о приеме поступает за сутки и в день приема.</p>
    <p>При обращении через ПЭП, пациенту поступает уведомление в виде статуса электронной заявки в «Личный кабинет» с указанием времени и даты приема врача.</p>
    <p><strong>108.</strong> При первичном обращении в организацию ПМСП пациенты проходят осмотр в смотровом кабинете (женский, мужской) с целью выявления и предупреждения развития различных заболеваний на ранней стадии, а также факторов риска их возникновения.</p>
    <p><strong>109.</strong> Специалисты ПМСП оказывают медицинскую помощь на дому, в том числе обслуживают вызова и активы, проводят патронажное наблюдение, организуют стационар на дому.</p>
    <p>Прием вызовов на дом осуществляется регистратурой организации ПМСП посредством телефонной связи, оператором колл-центра или через ПЭП «Вызов врача на дом».</p>
    <p><strong>135.</strong> При самостоятельном обращении пациента или посредством телефонной связи в организацию ПМСП, специалистами ПМСП вносится информация в форму № 056/у «Форма учета записи вызовов врачей на дом», утвержденную приказом № ҚР ДСМ-175 и в устной форме предоставляется ответ с указанием даты и времени посещения врача. После принятия запроса на оказание государственной услуги «Вызов врача на дом» медицинская помощь на дому оказывается в установленное время.</p>
    <p><strong>136.</strong> Обслуживание вызовов на дому осуществляется врачами ПМСП и (или) СМР (при отсутствии врача).</p>
    <div className="patient-document-section">
      <p><strong>139.</strong> Показаниями (наиболее частыми) для обслуживания вызовов на дому специалистом ПМСП являются:</p>
      <ol>
        <li>острые болезненные состояния, не позволяющие пациенту самостоятельно посетить организацию ПМСП:
          <ul>
            <li>повышение температуры тела выше 38 градусов С;</li>
            <li>повышение артериального давления с выраженными нарушениями самочувствия;</li>
            <li>многократный жидкий стул;</li>
            <li>сильные боли в позвоночнике и суставах нижних конечностей с ограничением подвижности;</li>
            <li>головокружение, сильная тошнота, рвота;</li>
          </ul>
        </li>
        <li>хронические болезненные состояния, которые не позволяют пациенту самостоятельно посетить поликлинику (тяжелое течение онкологических заболеваний, инвалидность (I – II группы), параличи, парезы конечностей);</li>
        <li>острые инфекционные заболевания, представляющие опасность для окружающих;</li>
        <li>нетранспортабельность пациента;</li>
        <li>обслуживание вызовов, переданных со станции скорой медицинской помощи, в часы работы организаций ПМСП.</li>
      </ol>
    </div>
    <p><strong>140.</strong> Данные о результатах вызова на дом вносятся в МИС.</p>
  </> : isScreenings ? <div className="screening-content">
    <section className="screening-card">
      <h2>{screeningCopy.what}</h2>
      <p>{screeningCopy.intro}</p>
    </section>
    <section className="screening-card">
      <h2>{screeningCopy.types}</h2>
      <ul>{screeningCopy.items.map((item) => <li key={item}>{item}</li>)}</ul>
      <p className="screening-note">{screeningCopy.note}</p>
    </section>
    <div className="screening-actions">
      <a className="screening-appointment" href={screeningWhatsApp} target="_blank" rel="noreferrer">{screeningCopy.appointment}</a>
    </div>
  </div> : <p>{page[2]}</p>}</div></main><Footer /></>;
}
