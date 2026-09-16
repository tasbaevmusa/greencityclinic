import { Link } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
function AdminNavbar({ onMenu }) { const { user, logout } = useAuth(); return <header className="admin-navbar"><button className="admin-menu-button" onClick={onMenu} aria-label="Открыть меню"><Menu/></button><div className="admin-navbar-spacer"/><Link to="/" className="admin-site-link">На сайт</Link><div className="admin-user"><span>{user?.name?.slice(0, 1)}</span><div><strong>{user?.name}</strong><small>{user?.role}</small></div></div><button className="logout-button" onClick={logout} title="Выйти"><LogOut size={19}/></button></header>; }
export default AdminNavbar;
