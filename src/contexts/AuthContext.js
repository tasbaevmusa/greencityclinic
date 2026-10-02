import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");
  useEffect(() => {
    let active = true;
    localStorage.removeItem("naramed-auth-session");
    authService.getSession().then(next => { if (active) setUser(next); })
      .catch(err => { if (active && err.status !== 401) setSessionError("Не удалось проверить вход. Проверьте подключение к серверу."); })
      .finally(() => { if (active) setIsLoading(false); });
    const expired = () => { setUser(null); setSessionError("Сессия завершена. Войдите снова."); };
    window.addEventListener("clinic-session-expired", expired);
    return () => { active = false; window.removeEventListener("clinic-session-expired", expired); };
  }, []);
  const login = useCallback(async credentials => {
    setIsLoading(true);
    try { const nextUser = await authService.login(credentials); setUser(nextUser); setSessionError(""); return nextUser; }
    finally { setIsLoading(false); }
  }, []);
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setSessionError("");
  }, []);
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isLoading, sessionError, login, logout }), [user, isLoading, sessionError, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
