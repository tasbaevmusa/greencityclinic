import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";
import { useDoctors } from "../data/DoctorsContext";
import "../Styles/DoctorsSlider.css";
import { useLanguage } from "../i18n/LanguageContext";

function DoctorPhoto({ doctor }) {
  const [failed, setFailed] = useState(false);
  if (!doctor.image || failed) return <div className="doctor-slide-placeholder" aria-label={`Фото ${doctor.name} пока не добавлено`}>
    <span><UserRound aria-hidden="true" /></span>
    <b>NARAMED</b>
    <small>Фото врача скоро появится</small>
  </div>;

  return <img className="doctor-slide-photo-main" src={doctor.image} alt={doctor.name} onError={() => setFailed(true)} />;
}

function DoctorsSlider() {
  const { doctors } = useDoctors();
  const { t } = useLanguage();
  const [start, setStart] = useState(0);
  const visible = Math.min(3, doctors.length);
  if (!doctors.length) return null;
  const shown = Array.from({ length: visible }, (_, index) => doctors[(start + index) % doctors.length]);
  const move = (direction) => setStart(current => (current + direction + doctors.length) % doctors.length);

  return <section className="doctors-slider-section" id="doctors">
    <div className="doctors-slider-heading"><div><p>{t.doctorsSection.label}</p><h2>{t.doctorsSection.title}</h2></div></div>
    <div className="doctors-slider"><button aria-label={t.doctorsSection.previous} onClick={() => move(-1)}>‹</button><div className="doctors-slider-track">{shown.map(doctor => { const profile = t.doctorProfiles[doctor.id] || doctor; return <Link to={`/doctors/${doctor.id}`} className="doctor-slide" key={doctor.id}><div className="doctor-slide-photo"><DoctorPhoto doctor={doctor} /></div><div className="doctor-slide-info"><h3>{doctor.name}</h3><p>{profile.position}</p><span>{t.doctorsSection.more} →</span></div></Link>; })}</div><button aria-label={t.doctorsSection.next} onClick={() => move(1)}>›</button></div>
  </section>;
}

export default DoctorsSlider;
