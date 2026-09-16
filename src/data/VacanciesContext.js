import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const VacanciesContext = createContext(null);
const STORAGE_KEY = "naramed-vacancies";
const defaults = [{ id: "vacancy-1", title: "Врач общей практики", department: "Амбулаторное отделение", employment: "Полная занятость", description: "Ищем внимательного врача для амбулаторного приёма пациентов.", requirements: "Высшее медицинское образование, действующий сертификат специалиста.", contact: "+7 707 534 0824", published: true }];

export function VacanciesProvider({ children }) {
  const [vacancies, setVacancies] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaults; } catch { return defaults; } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(vacancies)), [vacancies]);
  const value = useMemo(() => ({ vacancies,
    saveVacancy: (vacancy) => setVacancies((items) => items.some((item) => item.id === vacancy.id) ? items.map((item) => item.id === vacancy.id ? vacancy : item) : [{ ...vacancy, id: crypto.randomUUID() }, ...items]),
    deleteVacancy: (id) => setVacancies((items) => items.filter((item) => item.id !== id))
  }), [vacancies]);
  return <VacanciesContext.Provider value={value}>{children}</VacanciesContext.Provider>;
}
export function useVacancies() { const value = useContext(VacanciesContext); if (!value) throw new Error("useVacancies must be used inside VacanciesProvider"); return value; }
