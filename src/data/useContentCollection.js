import { useCallback, useEffect, useRef, useState } from "react";
import { contentApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function useContentCollection(kind) {
  const { user, isLoading: checkingSession } = useAuth();
  const admin = user?.role === "admin";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const ticket = ++generation.current;
    setLoading(true);
    try {
      const next = await contentApi.list(kind, admin);
      if (ticket === generation.current) { setItems(next); setError(""); }
    } catch (err) {
      if (ticket === generation.current) setError(err.message);
    } finally { if (ticket === generation.current) setLoading(false); }
  }, [kind, admin]);
  useEffect(() => {
    const requests = generation;
    setItems([]);
    if (checkingSession) return undefined;
    refresh();
    const onFocus = () => { refresh(); };
    const onImported = () => { refresh(); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("clinic-content-imported", onImported);
    return () => {
      ++requests.current;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("clinic-content-imported", onImported);
    };
  }, [checkingSession, refresh]);
  const save = useCallback(async item => {
    const saved = await contentApi.save(kind, item);
    ++generation.current;
    setLoading(false);
    setItems(current => current.some(entry => entry.id === saved.id) ? current.map(entry => entry.id === saved.id ? saved : entry) : [saved, ...current]);
    return saved;
  }, [kind]);
  const remove = useCallback(async id => {
    await contentApi.remove(kind, id);
    ++generation.current;
    setLoading(false);
    setItems(current => current.filter(item => item.id !== id));
  }, [kind]);
  return { items, loading, error, refresh, save, remove };
}
