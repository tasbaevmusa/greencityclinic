import { useAuth } from "./useAuth";
import { checkPermission, isAdmin, isUser } from "../utils/roles";
export function useRole() { const { user } = useAuth(); const role = user?.role; return { role, checkPermission: permission => checkPermission(role, permission), isAdmin: isAdmin(role), isUser: isUser(role) }; }
