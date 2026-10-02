import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ClinicGallery from "./ClinicGallery";

jest.mock("../i18n/LanguageContext", () => ({ useLanguage: () => ({ language: "ru" }) }));

beforeEach(() => {
  jest.useFakeTimers();
  window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
});
afterEach(() => jest.useRealTimers());
const tick = () => act(() => jest.advanceTimersByTime(6000));
const current = () => document.querySelector('.clinic-gallery-dots [aria-current="true"]');

test("autoplay continues after hover, focus, manual navigation and swipe, and wraps", () => {
  render(<ClinicGallery />);
  const gallery = screen.getByRole("region", { name: "Фотографии клиники" });
  fireEvent.mouseEnter(gallery);
  fireEvent.focus(gallery);
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 2:");
  fireEvent.click(screen.getByRole("button", { name: "Следующее фото" }));
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 4:");
  fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 100 }] });
  fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 100, clientY: 100 }] });
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 6:");
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 1:");
});

test("pause stops the timer and play resumes it", () => {
  render(<ClinicGallery />);
  fireEvent.click(screen.getByRole("button", { name: "Остановить автопрокрутку" }));
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 1:");
  fireEvent.click(screen.getByRole("button", { name: "Включить автопрокрутку" }));
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 2:");
});

test("reduced motion starts paused but allows explicit playback", () => {
  window.matchMedia.mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  render(<ClinicGallery />);
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 1:");
  fireEvent.click(screen.getByRole("button", { name: "Включить автопрокрутку" }));
  tick();
  expect(current().getAttribute("aria-label")).toContain("Фото 2:");
});
