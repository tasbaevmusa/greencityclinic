import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
function AdminNavbar({ onMenu }) { const { user, logout } = useAuth(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const signOut = async () => { setBusy(true); setError(""); try { await logout(); } catch (err) { setError(err.message); } finally { setBusy(false); } }; return <header className="admin-navbar"><button className="admin-menu-button" onClick={onMenu} aria-label="Открыть меню"><Menu/></button><div className="admin-navbar-spacer"/><Link to="/" className="admin-site-link">На сайт</Link><div className="admin-user"><span>{user?.name?.slice(0, 1)}</span><div><strong>{user?.name}</strong><small>{user?.role}</small></div></div><span role="alert">{error}</span><button className="logout-button" disabled={busy} onClick={signOut} title="Выйти"><LogOut size={19}/></button></header>; }
export default AdminNavbar;
