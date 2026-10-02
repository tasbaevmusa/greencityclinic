import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ roles = [], children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <p role="status">Проверяем вход…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/403" replace />;
  return children || <Outlet />;
}
export default ProtectedRoute;
