import { request } from "./api";
import { authService } from "./authService";

afterEach(() => { jest.restoreAllMocks(); });

test("login sends credentials to server without persisting a browser login", async () => {
  const user = { id: "admin", role: "admin" };
  global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => user });
  const save = jest.spyOn(Storage.prototype, "setItem");
  expect(await authService.login({ email: " admin@example.com ", password: " password with spaces " })).toEqual(user);
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/auth/login"), expect.objectContaining({
    credentials: "include",
    headers: expect.objectContaining({ "X-Requested-With": "clinic-admin" }),
    body: JSON.stringify({ email: "admin@example.com", password: " password with spaces " }),
  }));
  expect(save).not.toHaveBeenCalled();
});

test("expired write session notifies the UI and rejects the change", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: "Session expired" }) });
  const listener = jest.fn();
  window.addEventListener("clinic-session-expired", listener);
  try {
    await expect(request("/doctors/1", { method: "DELETE" })).rejects.toMatchObject({ status: 401 });
    expect(listener).toHaveBeenCalledTimes(1);
  } finally { window.removeEventListener("clinic-session-expired", listener); }
});
