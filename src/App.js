import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import Home from "./Pages/Home";
import Legal from "./Pages/Legal";
import Appointment from "./Pages/Appointment";
import DoctorDetails from "./Pages/DoctorDetails";
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

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <DoctorsProvider>
          <ReviewsProvider>
            <NewsProvider>
            <VacanciesProvider>
          <div className="App">
            <Router basename="/Health-Plus">
              <ScrollToHash />
              <Routes>
                {/* Публичные страницы */}
                <Route path="/" element={<Home />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/doctors/:id" element={<DoctorDetails />} />
                <Route path="/doctors-schedule" element={<DoctorsSchedule />} />
                <Route path="/about/:section" element={<AboutDetail />} />
                <Route path="/vacancies" element={<Vacancies />} />
                <Route path="/services/price-list" element={<PriceList />} />
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
              <WhatsAppFloat />
              <AccessibilityPanel />
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
