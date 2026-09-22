import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Search } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useDoctors } from "../data/DoctorsContext";
import { schedulesApi } from "../services/api";
import "../Styles/DoctorsSchedule.css";

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const startOfWeek = (value) => {
  const date = new Date(value);
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  return date;
};
const formatDate = (date) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);

function DoctorsSchedule() {
  const { doctors, loading, error } = useDoctors();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("Все специалисты");
  const [schedule, setSchedule] = useState({});
  const [scheduleError, setScheduleError] = useState("");
  const dates = useMemo(() => dayNames.map((name, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return { name, date, key: date.toISOString().slice(0, 10) };
  }), [weekStart]);
  useEffect(() => {
    let active = true;
    schedulesApi.list(dates[0].key, dates[6].key).then((items) => {
      if (!active) return;
      const next = {};
      items.forEach((item) => { next[item.doctor_id] = { ...(next[item.doctor_id] || {}), [item.work_date]: item }; });
      setSchedule(next);
      setScheduleError("");
    }).catch((err) => active && setScheduleError(err.message));
    return () => { active = false; };
  }, [dates]);
  const positions = ["Все специалисты", ...new Set(doctors.map((doctor) => doctor.position))];
  const visibleDoctors = doctors.filter((doctor) =>
    (position === "Все специалисты" || doctor.position === position) &&
    `${doctor.name} ${doctor.position}`.toLowerCase().includes(query.toLowerCase())
  );

  return <div className="public-schedule-page">
    <Navbar />
    <main>
      <section className="schedule-hero">
        <div className="schedule-eyebrow"><CalendarDays size={17}/> Расписание приёма</div>
        <h1>График работы врачей</h1>
        <p>Выберите специалиста и удобный день. Перед визитом рекомендуем уточнить время приёма.</p>
      </section>
      <section className="public-schedule-card">
        {(error || scheduleError) && <div className="public-no-doctors">Не удалось загрузить данные: {error || scheduleError}</div>}
        {loading && <div className="public-no-doctors">Загрузка…</div>}
        <div className="public-schedule-controls">
          <div className="public-week-picker">
            <button aria-label="Предыдущая неделя" onClick={() => setWeekStart(new Date(weekStart.getTime() - 604800000))}><ChevronLeft/></button>
            <div><span>Неделя</span><b>{formatDate(weekStart)} — {formatDate(dates[6].date)}</b></div>
            <button aria-label="Следующая неделя" onClick={() => setWeekStart(new Date(weekStart.getTime() + 604800000))}><ChevronRight/></button>
            <button className="public-today" onClick={() => setWeekStart(startOfWeek(new Date()))}>Сегодня</button>
          </div>
          <div className="public-schedule-filters">
            <label><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск врача"/></label>
            <select value={position} onChange={(e) => setPosition(e.target.value)}>{positions.map((item) => <option key={item}>{item}</option>)}</select>
          </div>
        </div>
        <div className="public-schedule-scroll" tabIndex={0} role="region" aria-label="Расписание врачей — прокрутка по горизонтали">
          <div className="public-schedule-grid">
            <div className="public-grid-head public-doctor-column">Врач</div>
            {dates.map((item) => <div className={`public-grid-head ${item.key === new Date().toISOString().slice(0, 10) ? "current" : ""}`} key={item.key}><b>{item.name}</b><span>{item.date.getDate()}</span></div>)}
            {visibleDoctors.map((doctor) => <React.Fragment key={doctor.id}>
              <div className="public-doctor-column public-doctor-info"><div><b>{doctor.name}</b><span>{doctor.position}</span></div></div>
              {dates.map((date) => {
                const shift = schedule[doctor.id]?.[date.key];
                return <div className={`public-shift ${shift?.type || "none"}`} key={date.key}>
                  {shift?.type === "work" ? <><Clock3 size={15}/><b>{shift.start}–{shift.end}</b><span>{shift.note || "Приём"}</span></> : <><b>{shift?.type === "vacation" ? "Отпуск" : "Выходной"}</b><span>Нет приёма</span></>}
                </div>;
              })}
            </React.Fragment>)}
          </div>
          {!visibleDoctors.length && <div className="public-no-doctors">Врачи не найдены</div>}
        </div>
        <div className="public-schedule-note"><span><i/>Врач принимает</span><span><i/>Нет приёма</span><p>Расписание может измениться. Телефон: <a href="tel:+77075340824">+7 707 534 08 24</a></p></div>
      </section>
    </main>
    <Footer />
  </div>;
}

export default DoctorsSchedule;
