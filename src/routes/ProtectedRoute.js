import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ roles = [], children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/403" replace />;
  return children || <Outlet />;
}
export default ProtectedRoute;
