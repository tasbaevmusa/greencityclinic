import React, { useEffect, useMemo, useState } from "react";
import { CloudSun, Expand, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { doctorsApi, schedulesApi } from "../services/api";
import { CLINIC_ZONE, SLIDE_MS, clinicDateKey, clinicWeek, doctorPages, weatherText } from "../utils/clinicSchedule";
import logo from "../Assets/logo.png";
import "../Styles/TvSchedule.css";

const dayLabels = ["ПН / ДС", "ВТ / СС", "СР / СР", "ЧТ / БС", "ПТ / ЖМ", "СБ / СБ", "ВС / ЖС"];
const clockFormat = new Intl.DateTimeFormat("ru-RU", { timeZone: CLINIC_ZONE, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const dateFormat = new Intl.DateTimeFormat("ru-RU", { timeZone: CLINIC_ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortDate = new Intl.DateTimeFormat("ru-RU", { timeZone: CLINIC_ZONE, day: "2-digit", month: "2-digit" });

export default function TvSchedule() {
  const [now, setNow] = useState(() => new Date());
  const [data, setData] = useState({ doctors: [], schedule: {}, week: "", updated: null });
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const today = clinicDateKey(now);
  const monday = clinicDateKey(clinicWeek(now)[0].date);
  const dates = useMemo(() => clinicWeek(new Date(`${monday}T12:00:00Z`)), [monday]);
  const pages = useMemo(() => doctorPages(data.doctors), [data.doctors]);
  const activePage = page % pages.length;
  const currentWeek = data.week === monday;
  const schedule = currentWeek ? data.schedule : {};
  // Keep Sunday when reception is configured, otherwise match the six-day reference.
  const showSunday = dates[6].key === today || Object.values(schedule).some((days) => days[dates[6].key]?.type === "work");
  const visibleDates = showSunday ? dates : dates.slice(0, 6);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    let pending = false;
    let controller;
    const load = async () => {
      if (pending) return;
      pending = true;
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        const options = { signal: controller.signal, cache: "no-store" };
        const [doctors, shifts] = await Promise.all([doctorsApi.list(options), schedulesApi.list(dates[0].key, dates[6].key, options)]);
        if (!Array.isArray(doctors) || !Array.isArray(shifts)) throw new Error("Invalid schedule");
        const next = {};
        shifts.forEach((shift) => { next[shift.doctor_id] = { ...next[shift.doctor_id], [shift.work_date]: shift }; });
        if (active) { setData({ doctors, schedule: next, week: monday, updated: new Date() }); setError(""); }
      } catch {
        if (active) setError("Нет связи с сервером. Повторяем подключение…");
      } finally { window.clearTimeout(timeout); pending = false; }
    };
    load();
    const timer = window.setInterval(load, SLIDE_MS);
    const resume = () => { if (!document.hidden) load(); };
    window.addEventListener("online", load);
    document.addEventListener("visibilitychange", resume);
    return () => { active = false; controller?.abort(); window.clearInterval(timer); window.removeEventListener("online", load); document.removeEventListener("visibilitychange", resume); };
  }, [dates, monday]);

  useEffect(() => {
    if (paused || pages.length < 2) return;
    const timer = window.setInterval(() => setPage((value) => (value + 1) % pages.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, pages.length]);

  useEffect(() => {
    let active = true;
    let pending = false;
    let controller;
    const load = async () => {
      if (pending) return;
      pending = true;
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.2389&longitude=76.8897&current=temperature_2m,weather_code&timezone=Asia%2FAlmaty&timeformat=unixtime", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Weather unavailable");
        const result = await response.json();
        if (!Number.isFinite(result.current?.temperature_2m) || !Number.isFinite(result.current?.time)) throw new Error("Invalid weather");
        if (active) { setWeather(result.current); setWeatherError(false); }
      } catch { if (active) setWeatherError(true); }
      finally { window.clearTimeout(timeout); pending = false; }
    };
    load();
    const timer = window.setInterval(load, 15 * 60 * 1000);
    window.addEventListener("online", load);
    return () => { active = false; controller?.abort(); window.clearInterval(timer); window.removeEventListener("online", load); };
  }, []);

  const freshWeather = weather && Math.abs(now.getTime() - weather.time * 1000) < 60 * 60 * 1000;
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else throw new Error("Unsupported");
      setFullscreenError("");
    } catch { setFullscreenError("Включите полноэкранный режим в меню браузера или клавишей F11."); }
  };

  return <main className="tv-schedule">
    <header className="tv-header">
      <img className="tv-logo" src={logo} alt="Нарамед" />
      <div className="tv-heading"><span>NARAMED · GREEN CITY</span><h1>РАСПИСАНИЕ ВРАЧЕЙ</h1><p>ДӘРІГЕРЛЕРДІҢ ҚАБЫЛДАУ КЕСТЕСІ</p></div>
      <div className="tv-clock"><time dateTime={now.toISOString()}>{clockFormat.format(now)}</time><span>{dateFormat.format(now)}</span></div>
      <div className="tv-weather"><span>АЛМАТЫ</span><div><CloudSun aria-hidden="true" />{freshWeather ? <b>{Math.round(weather.temperature_2m)}°C</b> : <b>—</b>}</div><small>{freshWeather ? weatherText(weather.weather_code) : weatherError || weather ? "Погода недоступна" : "Загрузка погоды…"}</small>{freshWeather && weatherError && <small>Нет обновления</small>}</div>
    </header>
    <div className="tv-meta"><span>Неделя / Апта: <b>{shortDate.format(dates[0].date)} — {shortDate.format(dates[6].date)}</b></span><span className="tv-slide-label">БЛОК <b>{String(activePage + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</b></span></div>
    <section className="tv-table-area" aria-label="Недельное расписание врачей">
      {data.doctors.length > 0 ? <table className="tv-table" style={{ "--day-count": visibleDates.length }}>
        <colgroup><col className="tv-room-col" /><col className="tv-specialty-col" /><col className="tv-name-col" />{visibleDates.map(({ key }) => <col key={key} />)}</colgroup>
        <thead><tr><th scope="col">КАБИНЕТ</th><th scope="col">СПЕЦИАЛЬНОСТЬ</th><th scope="col">Ф. И. О. ВРАЧА</th>{visibleDates.map(({ key, date }, index) => <th scope="col" key={key} className={key === today ? "tv-today" : ""}>{dayLabels[index]}<small>{shortDate.format(date)}</small></th>)}</tr></thead>
        <tbody key={activePage}>{pages[activePage].map((doctor) => {
          const [surname, ...names] = doctor.name.trim().split(/\s+/);
          return <tr key={doctor.id}><td className="tv-room">{doctor.room || "—"}</td><td className="tv-specialty">{doctor.position}</td><td className="tv-name"><strong>{surname}</strong><span>{names.join(" ")}</span></td>{visibleDates.map(({ key }) => {
            const shift = schedule[doctor.id]?.[key];
            return <td key={key} className={`tv-shift ${key === today ? "tv-today" : ""} ${shift?.type || "unspecified"}`}>
              {shift?.type === "work" ? <><b>{shift.start?.slice(0, 5)}–{shift.end?.slice(0, 5)}</b>{shift.note && <small>{shift.note}</small>}</> : <span>{shift?.type === "vacation" ? "Отпуск" : shift?.type === "dayoff" ? "Выходной" : "—"}</span>}
            </td>;
          })}</tr>;
        })}</tbody>
      </table> : <div className="tv-empty">{error ? "Не удалось загрузить расписание. Подключение восстановится автоматически." : data.updated ? "Добавьте врачей и расписание в админ-панели" : "Загружаем расписание…"}</div>}
    </section>
    <footer className="tv-footer"><div><strong>Обеденный перерыв 13:00–14:00</strong><span>— приём не указан · Уточняйте изменения у регистратора</span></div><div className={`tv-sync ${error ? "is-offline" : ""}`} role="status">{error ? `${error}${data.updated ? ` Данные на ${clockFormat.format(data.updated)}.` : ""}` : data.updated && currentWeek ? `Обновлено ${clockFormat.format(data.updated)} · Смена каждые 10 сек.` : "Получаем актуальные данные…"}<a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Погода: Open-Meteo</a></div><strong className="tv-phone">+7 (707) 534-08-24</strong></footer>
    <nav className="tv-controls" aria-label="Управление ТВ-расписанием"><button type="button" onClick={() => setPage((value) => (value - 1 + pages.length) % pages.length)} aria-label="Предыдущий блок"><ChevronLeft /></button><button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Продолжить смену блоков" : "Остановить смену блоков"}>{paused ? <Play /> : <Pause />}</button><button type="button" onClick={() => setPage((value) => (value + 1) % pages.length)} aria-label="Следующий блок"><ChevronRight /></button><button type="button" onClick={toggleFullscreen}><Expand /> На весь экран</button>{fullscreenError && <span role="status">{fullscreenError}</span>}</nav>
    <div key={`${activePage}-${paused}`} className={`tv-progress ${paused ? "is-paused" : ""}`} aria-hidden="true" />
  </main>;
}
