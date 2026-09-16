import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { doctorsApi } from "../services/api";

const DoctorsContext = createContext(null);

export function DoctorsProvider({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshDoctors = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setDoctors(await doctorsApi.list()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshDoctors(); }, [refreshDoctors]);

  const value = useMemo(() => ({
    doctors, loading, error, refreshDoctors,
    saveDoctor: async (doctor) => {
      const saved = doctor.id ? await doctorsApi.update(doctor) : await doctorsApi.create(doctor);
      setDoctors((current) => doctor.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      return saved;
    },
    deleteDoctor: async (id) => {
      await doctorsApi.remove(id);
      setDoctors((current) => current.filter((doctor) => doctor.id !== id));
    },
  }), [doctors, loading, error, refreshDoctors]);

  return <DoctorsContext.Provider value={value}>{children}</DoctorsContext.Provider>;
}

export function useDoctors() {
  const context = useContext(DoctorsContext);
  if (!context) throw new Error("useDoctors must be used inside DoctorsProvider");
  return context;
}
