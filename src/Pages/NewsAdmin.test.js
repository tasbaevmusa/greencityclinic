import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewsAdmin from "./NewsAdmin";
import { useNews } from "../data/NewsContext";

jest.mock("../data/NewsContext", () => ({ useNews: jest.fn() }));

test("failed save preserves the form and reports error; success resets it", async () => {
  const saveNews = jest.fn().mockRejectedValueOnce(new Error("Сервер недоступен")).mockResolvedValueOnce({ id: "saved" });
  useNews.mockReturnValue({ news: [], saveNews, deleteNews: jest.fn(), loading: false, error: "", refresh: jest.fn() });
  render(<NewsAdmin />);
  fireEvent.change(screen.getByLabelText("Заголовок"), { target: { value: "Новая новость" } });
  fireEvent.submit(screen.getByRole("button", { name: "Сохранить" }).closest("form"));
  expect(await screen.findByRole("alert")).toHaveTextContent("Сервер недоступен");
  expect(screen.getByLabelText("Заголовок")).toHaveValue("Новая новость");
  fireEvent.submit(screen.getByRole("button", { name: "Сохранить" }).closest("form"));
  await waitFor(() => expect(screen.getByLabelText("Заголовок")).toHaveValue(""));
});

test("failed deletion is visible to the administrator", async () => {
  useNews.mockReturnValue({ news: [{ id: "1", title: "Existing" }], saveNews: jest.fn(), deleteNews: jest.fn().mockRejectedValue(new Error("Не удалось удалить")), loading: false, error: "", refresh: jest.fn() });
  render(<NewsAdmin />);
  fireEvent.click(screen.getByRole("button", { name: "Удалить" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Не удалось удалить");
  expect(screen.getByText("Existing")).toBeInTheDocument();
});
