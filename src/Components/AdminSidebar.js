import { NavLink } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Newspaper,
  Settings,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import "../Styles/AdminLayout.css";

const items = [
  ["/admin/dashboard", "Обзор", LayoutDashboard],
  ["/admin/doctors", "График работы врачей", CalendarDays],
  ["/admin/services", "Услуги", Wrench],
  ["/admin/news", "Новости", Newspaper],
  ["/admin/vacancies", "Вакансии", BriefcaseBusiness],
  ["/admin/reviews", "Отзывы", FileText],
  ["/admin/pages", "Страницы", FileText],
  ["/admin/users", "Пользователи", Users],
  ["/admin/requests", "Заявки", UserRound],
  ["/admin/appointments", "Записи пациентов", CalendarDays],
  ["/admin/settings", "Настройки", Settings],
];

function AdminSidebar({ onNavigate }) {
  return (
    <aside className="admin-sidebar">
      <NavLink className="admin-brand" to="/admin/dashboard">
        НАРАМЕД <span>ADMIN</span>
      </NavLink>
      <nav>
        {items.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} onClick={onNavigate}>
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
