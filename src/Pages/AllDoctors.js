import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { DoctorListCard } from "../Components/DoctorsSlider";
import { useDoctors } from "../data/DoctorsContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function AllDoctors() {
  const { doctors, loading, error, refreshDoctors } = useDoctors();
  const { t } = useLanguage();
  return <>
    <Navbar />
    <main className="doctors-slider-section all-doctors-page">
      <header className="doctors-slider-heading"><div><p>{t.doctorsSection.label}</p><h1>{t.doctorsSection.all}</h1></div></header>
      {loading ? <p className="doctors-list-status" role="status">{t.doctorsSection.loading}</p>
        : error ? <div className="doctors-list-status" role="alert"><p>{t.doctorsSection.error}</p><button className="all-doctors-link" onClick={refreshDoctors}>{t.doctorsSection.retry}</button></div>
        : doctors.length ? <div className="all-doctors-grid">{doctors.map(doctor => <DoctorListCard key={doctor.id} doctor={doctor} />)}</div>
        : <p className="doctors-list-status">{t.doctorsSection.empty}</p>}
    </main>
    <Footer />
  </>;
}
