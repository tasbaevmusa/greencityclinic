// A TV must contact the site's server, not localhost on the television itself.
const defaultApiUrl = `${window.location.protocol}//${window.location.hostname}:8080/api`;
const API_URL = (process.env.REACT_APP_API_URL || defaultApiUrl).replace(/\/$/, "");

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-Requested-With": "clinic-admin", ...options.headers },
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== "/auth/login" && path !== "/auth/me") window.dispatchEvent(new Event("clinic-session-expired"));
    const error = new Error(body.error || `Ошибка сервера (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}

export const contentApi = {
  list: (kind, admin = false, options = {}) => request(`${admin ? "/admin" : ""}/content/${kind}`, options),
  save: (kind, item) => request(`/admin/content/${kind}${item.id ? `/${encodeURIComponent(item.id)}` : ""}`, { method: item.id ? "PUT" : "POST", body: JSON.stringify(item) }),
  remove: (kind, id) => request(`/admin/content/${kind}/${encodeURIComponent(id)}`, { method: "DELETE" }),
  import: (kind, items) => request(`/admin/content/${kind}/import`, { method: "POST", body: JSON.stringify(items) }),
};

export const doctorsApi = {
  list: (options = {}) => request("/doctors", options),
  create: (doctor) => request("/doctors", { method: "POST", body: JSON.stringify(doctor) }),
  update: (doctor) => request(`/doctors/${doctor.id}`, { method: "PUT", body: JSON.stringify(doctor) }),
  remove: (id) => request(`/doctors/${id}`, { method: "DELETE" }),
};

export const schedulesApi = {
  list: (from, to, options = {}) => request(`/schedules?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, options),
  save: (doctorId, date, shift) => request(`/doctors/${doctorId}/schedules/${date}`, { method: "PUT", body: JSON.stringify(shift) }),
  remove: (doctorId, date) => request(`/doctors/${doctorId}/schedules/${date}`, { method: "DELETE" }),
};
