import React, { createContext, useContext } from "react";
import useContentCollection from "./useContentCollection";

const VacanciesContext = createContext(null);
export function VacanciesProvider({ children }) {
  const { items: vacancies, save: saveVacancy, remove: deleteVacancy, ...state } = useContentCollection("vacancies");
  return <VacanciesContext.Provider value={{ vacancies, saveVacancy, deleteVacancy, ...state }}>{children}</VacanciesContext.Provider>;
}
export function useVacancies() {
  const context = useContext(VacanciesContext);
  if (!context) throw new Error("useVacancies must be used inside VacanciesProvider");
  return context;
}
