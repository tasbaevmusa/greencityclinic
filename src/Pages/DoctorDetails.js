import React from "react";
import { Link, useParams } from "react-router-dom";
import { useDoctors } from "../data/DoctorsContext";
import "../Styles/DoctorDetails.css";
import { useLanguage } from "../i18n/LanguageContext";

function DoctorDetails() {
  const { id } = useParams();
  const { doctors } = useDoctors();
  const { t } = useLanguage();
  const doctor = doctors.find(item => item.id === id);
  if (!doctor) return <main className="doctor-details"><h1>{t.doctorPage.notFound}</h1><Link to="/">{t.doctorPage.home}</Link></main>;
  const profile = t.doctorProfiles[doctor.id] || doctor;
  return <main className="doctor-details"><Link to="/" className="back-link">← {t.doctorPage.back}</Link><article><img src={doctor.image} alt={doctor.name} /><div><p className="doctor-position">{profile.position}</p><h1>{doctor.name}</h1><p className="doctor-description">{profile.description}</p></div></article></main>;
}

export default DoctorDetails;
