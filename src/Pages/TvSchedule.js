import React, { useEffect, useMemo, useState } from "react";
import { CloudSun, Expand, MapPin, MonitorUp, RefreshCw, Sun, Wind } from "lucide-react";
import { useDoctors } from "../data/DoctorsContext";
import { schedulesApi } from "../services/api";
import "../Styles/TvSchedule.css";

const zone = "Asia/Almaty";
const weekStart = (value) => {
  const result = new Date(value);
  const day = result.getDay() || 7;
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - day + 1);
  return result;
};
const dateKey = (value) => new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(value);
const weatherText = (code) => ({ 0: "Ясно", 1: "Преимущественно ясно", 2: "Облачно", 3: "Пасмурно", 45: "Туман", 51: "Морось", 61: "Дождь", 71: "Снег", 80: "Ливень", 95: "Гроза" }[code] || "Нет данных");

export default function TvSchedule() {
  const { doctors, loading, error } = useDoctors();
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [scheduleError, setScheduleError] = useState("");
  const today = dateKey(now);
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = weekStart(new Date(`${today}T12:00:00`));
    date.setDate(date.getDate() + index);
    return { date, key: dateKey(date) };
  }), [today]);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);
  useEffect(() => {
    let active = true;
    const loadWeather = async () => {
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.2389&longitude=76.8897&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FAlmaty");
        const data = await response.json();
        if (active && data.current) setWeather(data.current);
      } catch { if (active) setWeather(false); }
    };
    loadWeather();
    const refresh = window.setInterval(loadWeather, 30 * 60 * 1000);
    return () => { active = false; window.clearInterval(refresh); };
  }, []);
  useEffect(() => {
    let active = true;
    schedulesApi.list(dates[0].key, dates[6].key).then((items) => {
      if (!active) return;
      const next = {};
      items.forEach((item) => { next[item.doctor_id] = { ...(next[item.doctor_id] || {}), [item.work_date]: item }; });
      setSchedule(next); setScheduleError("");
    }).catch(() => active && setScheduleError("Расписание временно недоступно"));
    return () => { active = false; };
  }, [dates]);
  const dateTitle = new Intl.DateTimeFormat("ru-RU", { timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  const time = new Intl.DateTimeFormat("ru-RU", { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
  const requestFullscreen = () => document.documentElement.requestFullscreen?.();

  return <main className="tv-schedule" aria-live="polite">
    <header className="tv-header">
      <div className="tv-brand"><span>NARAMED</span><small>КЛИНИКА</small></div>
      <div className="tv-clock"><time>{time}</time><span>{dateTitle}</span></div>
      <div className="tv-weather">{weather ? <><CloudSun /><b>{Math.round(weather.temperature_2m)}°</b><span>{weatherText(weather.weather_code)}</span><Wind size={18} /><small>{Math.round(weather.wind_speed_10m)} км/ч</small></> : <><Sun /><span>Погода загружается</span></>}<MapPin size={18} /><small>Алматы</small></div>
    </header>
    <section className="tv-title"><div><span><MonitorUp /> ИНФОРМАЦИЯ ДЛЯ ПАЦИЕНТОВ</span><h1>График работы врачей</h1></div><button onClick={requestFullscreen} type="button"><Expand /> На весь экран</button></section>
    <section className="tv-grid-wrap">
      <div className="tv-grid">
        <div className="tv-grid-head tv-doctor">Врач / кабинет</div>
        {dates.map(({ date, key }) => <div className={`tv-grid-head ${key === today ? "today" : ""}`} key={key}><b>{new Intl.DateTimeFormat("ru-RU", { weekday: "short", timeZone: zone }).format(date).replace(".", "")}</b><span>{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", timeZone: zone }).format(date)}</span></div>)}
        {doctors.map((doctor) => <React.Fragment key={doctor.id}>
          <div className="tv-doctor"><b>{doctor.name}</b><span>{doctor.position} · Каб. {doctor.room || "уточняется"}</span></div>
          {dates.map(({ key }) => {
            const shift = schedule[doctor.id]?.[key];
            return <div className={`tv-shift ${shift?.type || "dayoff"}`} key={key}>{shift?.type === "work" ? <><b>{shift.start}–{shift.end}</b><span>{shift.note || "Приём"}</span></> : <><b>{shift?.type === "vacation" ? "Отпуск" : "Нет приёма"}</b></>}</div>;
          })}
        </React.Fragment>)}
      </div>
      {!loading && !doctors.length && <div className="tv-empty">Список врачей пока не заполнен</div>}
      {(error || scheduleError) && <div className="tv-notice"><RefreshCw />{error || scheduleError}</div>}
    </section>
    <footer className="tv-footer"><span>Расписание может измениться. Пожалуйста, уточняйте у регистратора.</span><strong>+7 (707) 534-08-24</strong></footer>
  </main>;
}
