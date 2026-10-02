import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";

import Home from "./Pages/Home";
import Legal from "./Pages/Legal";
import Appointment from "./Pages/Appointment";
import DoctorDetails from "./Pages/DoctorDetails";
import AllDoctors from "./Pages/AllDoctors";
import DoctorsAdmin from "./Pages/DoctorsAdmin";
import ReviewsAdmin from "./Pages/ReviewsAdmin";
import NewsAdmin from "./Pages/NewsAdmin";
import VacanciesAdmin from "./Pages/VacanciesAdmin";
import Vacancies from "./Pages/Vacancies";
import AboutDetail from "./Pages/AboutDetail";
import PriceList from "./Pages/PriceList";
import ServiceDetail from "./Pages/ServiceDetail";
import DoctorsSchedule from "./Pages/DoctorsSchedule";
import PatientDetail from "./Pages/PatientDetail";
import StateSymbols from "./Pages/StateSymbols";
import TvSchedule from "./Pages/TvSchedule";
import RegulatoryFramework from "./Pages/RegulatoryFramework";
import AboutClinic from "./Pages/AboutClinic";
import FreeServices from "./Pages/FreeServices";
import AttachmentRules from "./Pages/AttachmentRules";
import PatientRights from "./Pages/PatientRights";

import AdminDashboard from "./Pages/AdminDashboard";
import AdminPlaceholder from "./Pages/AdminPlaceholder";
import LoginPage from "./Pages/LoginPage";
import ForbiddenPage from "./Pages/ForbiddenPage";
import NotFoundPage from "./Pages/NotFoundPage";

import { LanguageProvider } from "./i18n/LanguageContext";
import { DoctorsProvider } from "./data/DoctorsContext";
import { ReviewsProvider } from "./data/ReviewsContext";
import { NewsProvider } from "./data/NewsContext";
import { VacanciesProvider } from "./data/VacanciesContext";
import { AuthProvider } from "./contexts/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import ScrollToHash from "./routes/ScrollToHash";
import WhatsAppFloat from "./Components/WhatsAppFloat";
import AccessibilityPanel from "./Components/AccessibilityPanel";

function PublicWidgets() {
  const { pathname } = useLocation();
  return pathname === "/tv-schedule" ? null : <><WhatsAppFloat /><AccessibilityPanel /></>;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <DoctorsProvider>
          <ReviewsProvider>
            <NewsProvider>
            <VacanciesProvider>
          <div className="App">
            <Router basename={process.env.PUBLIC_URL || "/"}>
              <ScrollToHash />
              <Routes>
                {/* Публичные страницы */}
                <Route path="/" element={<Home />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/doctors/:id" element={<DoctorDetails />} />
                <Route path="/doctors" element={<AllDoctors />} />
                <Route path="/doctors-schedule" element={<DoctorsSchedule />} />
                <Route path="/tv-schedule" element={<TvSchedule />} />
                <Route path="/about/:section" element={<AboutDetail />} />
                <Route path="/about/regulatory-framework" element={<RegulatoryFramework />} />
                <Route path="/about/clinic" element={<AboutClinic />} />
                <Route path="/about/attachment-rules" element={<AttachmentRules />} />
                <Route path="/about/patient-rights" element={<PatientRights />} />
                <Route path="/vacancies" element={<Vacancies />} />
                <Route path="/services/price-list" element={<PriceList />} />
                <Route path="/services/free" element={<FreeServices />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/patients/:section" element={<PatientDetail />} />
                <Route path="/state-symbols" element={<StateSymbols />} />

                {/* Авторизация */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/403" element={<ForbiddenPage />} />

                {/* Только для администратора */}
                <Route element={<ProtectedRoute roles={["admin"]} />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />

                    <Route
                      path="dashboard"
                      element={<AdminDashboard />}
                    />

                    <Route
                      path="doctors"
                      element={<DoctorsAdmin />}
                    />

                    <Route
                      path="services"
                      element={
                        <AdminPlaceholder title="Управление услугами" />
                      }
                    />

                    <Route
                      path="news"
                      element={<NewsAdmin />}
                    />
                    <Route path="vacancies" element={<VacanciesAdmin />} />

                    <Route
                      path="reviews"
                      element={<ReviewsAdmin />}
                    />

                    <Route
                      path="pages"
                      element={
                        <AdminPlaceholder title="Страницы сайта" />
                      }
                    />

                    <Route
                      path="users"
                      element={
                        <AdminPlaceholder title="Пользователи" />
                      }
                    />

                    <Route
                      path="requests"
                      element={
                        <AdminPlaceholder title="Заявки" />
                      }
                    />

                    <Route
                      path="appointments"
                      element={
                        <AdminPlaceholder title="Запись пациентов" />
                      }
                    />

                    <Route
                      path="settings"
                      element={
                        <AdminPlaceholder title="Настройки сайта" />
                      }
                    />
                  </Route>
                </Route>

                {/* Страница не найдена */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <PublicWidgets />
            </Router>
          </div>
            </VacanciesProvider>
            </NewsProvider>
          </ReviewsProvider>
        </DoctorsProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
