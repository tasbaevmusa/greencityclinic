import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Pencil, Plus, Search, Stethoscope, UsersRound, X } from "lucide-react";
import { useDoctors } from "../data/DoctorsContext";
import { schedulesApi } from "../services/api";
import "../Styles/DoctorsAdmin.css";

const initialForm = { name: "", position: "", description: "", image: "" };
const weekDays = [
  ["mon", "Пн", "Понедельник"],
  ["tue", "Вт", "Вторник"],
  ["wed", "Ср", "Среда"],
  ["thu", "Чт", "Четверг"],
  ["fri", "Пт", "Пятница"],
  ["sat", "Сб", "Суббота"],
  ["sun", "Вс", "Воскресенье"],
];

const emptyShift = { type: "work", start: "09:00", end: "17:00", note: "" };

const formatDate = (date) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);
const startOfWeek = (value) => {
  const date = new Date(value);
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  return date;
};

function DoctorsAdmin() {
  const { doctors, loading, error, saveDoctor, deleteDoctor } = useDoctors();
  const [tab, setTab] = useState("schedule");
  const [form, setForm] = useState(initialForm);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("Все специальности");
  const [schedule, setSchedule] = useState({});
  const [actionError, setActionError] = useState("");
  const [editing, setEditing] = useState(null);
  const [shift, setShift] = useState(emptyShift);

  const dates = useMemo(() => weekDays.map((day, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return { ...day, date, key: date.toISOString().slice(0, 10) };
  }), [weekStart]);

  useEffect(() => {
    let active = true;
    schedulesApi.list(dates[0].key, dates[6].key).then((items) => {
      if (!active) return;
      const next = {};
      items.forEach((item) => { next[item.doctor_id] = { ...(next[item.doctor_id] || {}), [item.work_date]: item }; });
      setSchedule(next);
      setActionError("");
    }).catch((err) => active && setActionError(err.message));
    return () => { active = false; };
  }, [dates]);

  const positions = useMemo(() => ["Все специальности", ...new Set(doctors.map((doctor) => doctor.position))], [doctors]);
  const filteredDoctors = doctors.filter((doctor) =>
    (position === "Все специальности" || doctor.position === position) &&
    `${doctor.name} ${doctor.position}`.toLowerCase().includes(query.toLowerCase())
  );

  const getShift = (doctorId, dateKey) => schedule[doctorId]?.[dateKey];
  const openShift = (doctor, date) => {
    setEditing({ doctor, date });
    setShift(getShift(doctor.id, date.key) || emptyShift);
  };
  const saveShift = async () => {
    if (!editing) return;
    try {
      const saved = await schedulesApi.save(editing.doctor.id, editing.date.key, shift);
      setSchedule((current) => ({ ...current, [editing.doctor.id]: { ...(current[editing.doctor.id] || {}), [editing.date.key]: saved } }));
      setEditing(null);
    } catch (err) { setActionError(err.message); }
  };
  const removeShift = async () => {
    if (!editing) return;
    try { await schedulesApi.remove(editing.doctor.id, editing.date.key); }
    catch (err) { setActionError(err.message); return; }
    setSchedule((current) => {
      const doctorSchedule = { ...(current[editing.doctor.id] || {}) };
      delete doctorSchedule[editing.date.key];
      return { ...current, [editing.doctor.id]: doctorSchedule };
    });
    setEditing(null);
  };

  const workingToday = doctors.filter((doctor) => {
    const today = new Date().toISOString().slice(0, 10);
    return getShift(doctor.id, today)?.type === "work";
  }).length;
  const weeklyHours = Object.values(schedule).reduce((total, doctorSchedule) =>
    total + dates.reduce((sum, date) => {
      const item = doctorSchedule[date.key];
      if (!item || item.type !== "work") return sum;
      const [sh, sm] = item.start.split(":").map(Number);
      const [eh, em] = item.end.split(":").map(Number);
      return sum + Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
    }, 0), 0);

  const handleChange = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const handleImageChange = ({ target: { files } }) => {
    const [file] = files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try { await saveDoctor(form); setForm(initialForm); setActionError(""); }
    catch (err) { setActionError(err.message); }
  };

  const handleDeleteDoctor = async (id) => {
    try { await deleteDoctor(id); setActionError(""); }
    catch (err) { setActionError(err.message); }
  };

  return <section className="admin-page doctors-management">
    {(error || actionError) && <div className="empty-result">Ошибка API: {error || actionError}. Проверьте, что Docker запущен.</div>}
    {loading && <div className="empty-result">Загрузка врачей…</div>}
    <header className="admin-heading">
      <div><p>УПРАВЛЕНИЕ ПЕРСОНАЛОМ</p><h1>Врачи и расписание</h1><span>Планируйте приём и следите за загрузкой специалистов</span></div>
      <Link to="/">← На сайт</Link>
    </header>

    <div className="management-tabs">
      <button className={tab === "schedule" ? "active" : ""} onClick={() => setTab("schedule")}><CalendarDays size={18}/> График работы</button>
      <button className={tab === "doctors" ? "active" : ""} onClick={() => setTab("doctors")}><Stethoscope size={18}/> Список врачей <b>{doctors.length}</b></button>
    </div>

    {tab === "schedule" ? <>
      <div className="schedule-stats">
        <article><span className="stat-icon green"><UsersRound size={21}/></span><div><b>{workingToday}</b><small>Врачей сегодня</small></div></article>
        <article><span className="stat-icon blue"><Clock3 size={21}/></span><div><b>{Math.round(weeklyHours)} ч</b><small>Запланировано на неделю</small></div></article>
        <article><span className="stat-icon amber"><CalendarDays size={21}/></span><div><b>{filteredDoctors.length}</b><small>Специалистов в графике</small></div></article>
      </div>

      <div className="schedule-card">
        <div className="schedule-toolbar">
          <div className="week-switcher">
            <button aria-label="Предыдущая неделя" onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * 86400000))}><ChevronLeft size={20}/></button>
            <div><small>Текущая неделя</small><b>{formatDate(weekStart)} — {formatDate(dates[6].date)}</b></div>
            <button aria-label="Следующая неделя" onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * 86400000))}><ChevronRight size={20}/></button>
            <button className="today-button" onClick={() => setWeekStart(startOfWeek(new Date()))}>Сегодня</button>
          </div>
          <div className="schedule-filters">
            <label className="search-field"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти врача"/></label>
            <select value={position} onChange={(e) => setPosition(e.target.value)}>{positions.map((item) => <option key={item}>{item}</option>)}</select>
          </div>
        </div>

        <div className="schedule-scroll" tabIndex={0} role="region" aria-label="Расписание врачей — прокрутка по горизонтали">
          <div className="schedule-grid">
            <div className="grid-head doctor-column">Врач / специальность</div>
            {dates.map((date) => <div className={`grid-head ${date.key === new Date().toISOString().slice(0, 10) ? "today" : ""}`} key={date.key}><b>{date[1]}</b><span>{date.date.getDate()}</span></div>)}
            {filteredDoctors.map((doctor) => <React.Fragment key={doctor.id}>
              <div className="doctor-column doctor-cell"><img src={doctor.image} alt=""/><div><b>{doctor.name}</b><span>{doctor.position}</span></div></div>
              {dates.map((date) => {
                const item = getShift(doctor.id, date.key);
                return <button key={date.key} className={`shift-cell ${item ? item.type : "empty"}`} onClick={() => openShift(doctor, date)}>
                  {item ? item.type === "work" ? <><b>{item.start}–{item.end}</b><span>{item.note || "Приём"}</span><Pencil size={13}/></> : <><b>{item.type === "vacation" ? "Отпуск" : "Выходной"}</b><span>{item.note || "Нет приёма"}</span><Pencil size={13}/></> : <><Plus size={17}/><span>Добавить</span></>}
                </button>;
              })}
            </React.Fragment>)}
          </div>
          {!filteredDoctors.length && <div className="empty-result">По вашему запросу врачи не найдены</div>}
        </div>
        <div className="schedule-legend"><span><i className="work"/>Рабочая смена</span><span><i className="dayoff"/>Выходной</span><span><i className="vacation"/>Отпуск</span><em>Нажмите на ячейку, чтобы изменить график</em></div>
      </div>
    </> : <div className="doctors-admin-grid">
      <form onSubmit={handleSubmit} className="doctor-form">
        <h2>{form.id ? "Редактировать врача" : "Добавить врача"}</h2>
        <label>Имя и фамилия<input name="name" value={form.name} onChange={handleChange} required /></label>
        <label>Специальность<input name="position" value={form.position} onChange={handleChange} required /></label>
        <label>Описание<textarea name="description" value={form.description} onChange={handleChange} rows="5" /></label>
        <label>Фото<input type="file" accept="image/*" onChange={handleImageChange} /></label>
        {form.image && <img className="form-preview" src={form.image} alt="Предпросмотр" />}
        <div className="form-actions"><button type="submit"><Check size={17}/> Сохранить</button>{form.id && <button type="button" onClick={() => setForm(initialForm)} className="cancel">Отмена</button>}</div>
      </form>
      <div className="admin-doctors">{doctors.map((doctor) => <article key={doctor.id}><img src={doctor.image} alt="" /><div><h3>{doctor.name}</h3><p>{doctor.position}</p><button type="button" onClick={() => setForm(doctor)}>Изменить</button><button type="button" onClick={() => handleDeleteDoctor(doctor.id)} className="delete">Удалить</button></div></article>)}</div>
    </div>}

    {editing && <div className="shift-overlay" onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
      <form className="shift-dialog" onSubmit={(e) => { e.preventDefault(); saveShift(); }}>
        <header><div><small>{editing.date[2]}, {formatDate(editing.date.date)}</small><h2>Изменить график</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Закрыть"><X/></button></header>
        <div className="editing-doctor"><img src={editing.doctor.image} alt=""/><div><b>{editing.doctor.name}</b><span>{editing.doctor.position}</span></div></div>
        <label>Тип дня<select value={shift.type} onChange={(e) => setShift({ ...shift, type: e.target.value })}><option value="work">Рабочая смена</option><option value="dayoff">Выходной</option><option value="vacation">Отпуск</option></select></label>
        {shift.type === "work" && <div className="time-row"><label>Начало<input type="time" value={shift.start} onChange={(e) => setShift({ ...shift, start: e.target.value })}/></label><label>Окончание<input type="time" value={shift.end} onChange={(e) => setShift({ ...shift, end: e.target.value })}/></label></div>}
        <label>Примечание<input value={shift.note} onChange={(e) => setShift({ ...shift, note: e.target.value })} placeholder="Например: кабинет №3"/></label>
        <div className="dialog-actions">{getShift(editing.doctor.id, editing.date.key) && <button type="button" className="remove-shift" onClick={removeShift}>Очистить</button>}<button type="button" className="cancel-shift" onClick={() => setEditing(null)}>Отмена</button><button type="submit" className="save-shift"><Check size={17}/> Сохранить</button></div>
      </form>
    </div>}
  </section>;
}

export default DoctorsAdmin;
