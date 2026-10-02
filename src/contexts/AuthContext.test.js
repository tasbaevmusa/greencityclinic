import React from "react";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";
import { authService } from "../services/authService";

jest.mock("../services/authService", () => ({ authService: { getSession: jest.fn(), login: jest.fn(), logout: jest.fn() } }));

test("forged legacy localStorage cannot grant admin access; waits for server", async () => {
  localStorage.setItem("naramed-auth-session", JSON.stringify({ role: "admin", id: "forged" }));
  let resolve;
  authService.getSession.mockReturnValue(new Promise(done => { resolve = done; }));
  render(<MemoryRouter initialEntries={["/admin"]}><AuthProvider><Routes><Route path="/admin" element={<ProtectedRoute roles={["admin"]}><p>Private editor</p></ProtectedRoute>} /><Route path="/login" element={<p>Sign in</p>} /></Routes></AuthProvider></MemoryRouter>);
  expect(screen.getByRole("status")).toHaveTextContent("Проверяем вход");
  expect(screen.queryByText("Private editor")).not.toBeInTheDocument();
  expect(localStorage.getItem("naramed-auth-session")).toBeNull();
  await act(async () => { resolve({ role: "admin", id: "real" }); });
  expect(screen.getByText("Private editor")).toBeInTheDocument();
  act(() => { window.dispatchEvent(new Event("clinic-session-expired")); });
  expect(screen.queryByText("Private editor")).not.toBeInTheDocument();
});
