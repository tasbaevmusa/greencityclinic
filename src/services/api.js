const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8080/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Ошибка сервера (${response.status})`);
  return body;
}

export const doctorsApi = {
  list: () => request("/doctors"),
  create: (doctor) => request("/doctors", { method: "POST", body: JSON.stringify(doctor) }),
  update: (doctor) => request(`/doctors/${doctor.id}`, { method: "PUT", body: JSON.stringify(doctor) }),
  remove: (id) => request(`/doctors/${id}`, { method: "DELETE" }),
};

export const schedulesApi = {
  list: (from, to) => request(`/schedules?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  save: (doctorId, date, shift) => request(`/doctors/${doctorId}/schedules/${date}`, { method: "PUT", body: JSON.stringify(shift) }),
  remove: (doctorId, date) => request(`/doctors/${doctorId}/schedules/${date}`, { method: "DELETE" }),
};
