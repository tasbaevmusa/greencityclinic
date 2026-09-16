import { createContext, useCallback, useMemo, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession());
  const [isLoading, setIsLoading] = useState(false);
  const login = useCallback(async credentials => { setIsLoading(true); try { const nextUser = await authService.login(credentials); setUser(nextUser); return nextUser; } finally { setIsLoading(false); } }, []);
  const logout = useCallback(async () => { await authService.logout(); setUser(null); }, []);
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isLoading, login, logout }), [user, isLoading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
