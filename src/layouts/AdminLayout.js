import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/AdminNavbar";

import "../Styles/AdminLayout.css";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    if (!isSidebarOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSidebarOpen]);

  return (
    <div className={`admin-shell ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <button className="admin-backdrop" aria-label="Закрыть меню" onClick={() => setIsSidebarOpen(false)} />}

      <div className="admin-main">
        <AdminNavbar onMenu={() => setIsSidebarOpen((isOpen) => !isOpen)} />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
