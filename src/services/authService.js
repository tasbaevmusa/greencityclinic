import { request } from "./api";

export const authService = {
  login: ({ email, password }) => request("/auth/login", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getSession: () => request("/auth/me"),
};
