import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LegacyContentImport from "./LegacyContentImport";
import { contentApi } from "../services/api";

jest.mock("../services/api", () => ({ contentApi: { import: jest.fn() } }));
afterEach(() => { localStorage.clear(); jest.clearAllMocks(); });

test("legacy records are not imported automatically and remain after a conflict", async () => {
  const raw = JSON.stringify([{ id: "old", title: "Моя новость" }]);
  localStorage.setItem("naramed-news", raw);
  contentApi.import.mockRejectedValue(new Error("На сервере уже есть правки"));
  render(<LegacyContentImport />);
  expect(contentApi.import).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Перенести новости" }));
  expect(await screen.findByRole("status")).toHaveTextContent("На сервере уже есть правки");
  expect(localStorage.getItem("naramed-news")).toBe(raw);
});
