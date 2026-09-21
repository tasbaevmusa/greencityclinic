const STORAGE_KEY = "naramed-auth-session";

// Adapter boundary: replace these local functions with API/JWT calls when backend is ready.
const developmentAccounts = [
  { id: 1, name: "Admin", email: "admin@naramed.kz", password: "Admin123!", role: "admin" },
  { id: 2, name: "User", email: "user@gmail.com", password: "User123!", role: "user" }
];
const toPublicUser = ({ password, ...user }) => user;

export const authService = {
  async login({ email, password }) {
    const cleanEmail = String(email ?? "").normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().toLowerCase();
    const cleanPassword = String(password ?? "").normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
    const account = developmentAccounts.find(item => item.email.toLowerCase() === cleanEmail && item.password === cleanPassword);
    if (!account) throw new Error("Неверный email или пароль");
    const user = toPublicUser(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  async logout() { localStorage.removeItem(STORAGE_KEY); },
  getSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { localStorage.removeItem(STORAGE_KEY); return null; }
  }
};
