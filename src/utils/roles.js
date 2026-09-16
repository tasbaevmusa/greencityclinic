export const ROLES = Object.freeze({ ADMIN: "admin", USER: "user", DOCTOR: "doctor", MANAGER: "manager", REGISTRAR: "registrar" });
export const permissionsByRole = Object.freeze({
  [ROLES.ADMIN]: ["admin.access", "doctors.manage", "services.manage", "news.manage", "reviews.manage", "pages.manage", "users.manage", "appointments.manage", "settings.manage"],
  [ROLES.USER]: ["profile.manage", "appointments.create"]
});

export const checkPermission = (role, permission) => Boolean(role && permissionsByRole[role]?.includes(permission));
export const isAdmin = role => role === ROLES.ADMIN;
export const isUser = role => role === ROLES.USER;
