import React from "react";
import { act, render, screen, cleanup } from "@testing-library/react";
import TvSchedule from "./TvSchedule";
import { doctorsApi, schedulesApi } from "../services/api";
import { clinicDateKey, clinicWeek, doctorPages } from "../utils/clinicSchedule";

jest.mock("../services/api", () => ({ doctorsApi: { list: jest.fn() }, schedulesApi: { list: jest.fn() } }));
const doctors = Array.from({ length: 21 }, (_, i) => ({ id: String(i), name: `Врач${i} Имя Отчество`, position: "Терапевт", room: "03" }));
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-09-29T10:00:00Z"));
  doctorsApi.list.mockResolvedValue(doctors);
  schedulesApi.list.mockResolvedValue([]);
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ current: { temperature_2m: 20, weather_code: 0, time: Date.now() / 1000 } }) });
});
afterEach(() => { cleanup(); jest.useRealTimers(); jest.clearAllMocks(); });

test("clinic week follows Almaty midnight, including month/year rollover", () => {
  expect(clinicDateKey(new Date("2026-09-27T19:01:00Z"))).toBe("2026-09-28");
  expect(clinicWeek(new Date("2026-09-27T19:01:00Z")).map(d => d.key)).toEqual(["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04"]);
  expect(clinicWeek(new Date("2027-01-01T00:00:00Z"))[0].key).toBe("2026-12-28");
});
test("all doctors fit into balanced pages without dropping records", () => {
  for (let count = 0; count < 100; count++) {
    const list = Array.from({ length: count }, (_, i) => i);
    const pages = doctorPages(list);
    expect(pages.flat()).toEqual(list);
    expect(pages.every(page => page.length <= 7)).toBe(true);
  }
  expect(doctorPages(doctors).map(page => page.length)).toEqual([7, 7, 7]);
});
test("rotates three blocks every 10 seconds and refreshes admin data without reload", async () => {
  render(<TvSchedule />); await flush();
  expect(screen.getByText("Врач0")).toBeTruthy();
  await act(async () => { jest.advanceTimersByTime(9999); });
  expect(screen.queryByText("Врач7")).toBeNull();
  doctorsApi.list.mockResolvedValue(doctors.map(d => d.id === "7" ? { ...d, name: "Обновлённый Врач", room: "99" } : d));
  schedulesApi.list.mockResolvedValue([{ doctor_id: "7", work_date: "2026-09-29", type: "work", start: "11:00:00", end: "16:00:00", note: "Новый график" }]);
  await act(async () => { jest.advanceTimersByTime(1); }); await flush();
  expect(screen.getByText("Обновлённый")).toBeTruthy();
  expect(screen.getByText("99")).toBeTruthy();
  expect(screen.getByText("11:00–16:00")).toBeTruthy();
  await act(async () => { jest.advanceTimersByTime(10000); });
  expect(screen.getByText("Врач14")).toBeTruthy();
  await act(async () => { jest.advanceTimersByTime(10000); });
  expect(screen.getByText("Врач0")).toBeTruthy();
});
test("preserves last data on network failure, recovers, and handles removal of doctors", async () => {
  render(<TvSchedule />); await flush();
  doctorsApi.list.mockRejectedValueOnce(new Error("offline"));
  await act(async () => { jest.advanceTimersByTime(10000); }); await flush();
  expect(screen.getByRole("status").textContent).toContain("Нет связи");
  expect(screen.getByText("Врач7")).toBeTruthy();
  doctorsApi.list.mockResolvedValue([]);
  await act(async () => { jest.advanceTimersByTime(10000); }); await flush();
  expect(screen.getByText("Добавьте врачей и расписание в админ-панели")).toBeTruthy();
  expect(screen.queryByText("Врач7")).toBeNull();
  expect(screen.getByRole("status").textContent).not.toContain("Нет связи");
});
test("Sunday reception is shown and missing weather is not a permanent loading state", async () => {
  schedulesApi.list.mockResolvedValue([{ doctor_id: "0", work_date: "2026-10-04", type: "work", start: "10:00", end: "12:00" }]);
  global.fetch.mockRejectedValue(new Error("offline"));
  render(<TvSchedule />); await flush();
  expect(screen.getByText("ВС / ЖС")).toBeTruthy();
  expect(screen.getByText("10:00–12:00")).toBeTruthy();
  expect(screen.getByText("Погода недоступна")).toBeTruthy();
});
