import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Assets/logo.png";
import { useAuth } from "../hooks/useAuth";
import "../Styles/Auth.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      // Password managers can fill visible inputs before React state updates.
      const formData = new FormData(event.currentTarget);
      const nextUser = await login({
        email: formData.get("email") || email,
        password: formData.get("password") || password,
      });
      const requestedPath = location.state?.from;
      const destination = nextUser.role === "admin"
        ? (requestedPath?.startsWith("/admin") ? requestedPath : "/admin/dashboard")
        : "/";
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Не удалось выполнить вход");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <a className="auth-logo" href="/Health-Plus/" aria-label="Вернуться на сайт">
          <img src={Logo} alt="" />
          <span><strong>НАРАМЕД</strong><small>КЛИНИКА</small></span>
        </a>

        <div className="auth-heading">
          <p>АДМИНИСТРАТИВНАЯ ПАНЕЛЬ</p>
          <h1>Вход в систему</h1>
          <span>Введите данные администратора для продолжения.</span>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <label>
          Email
          <span className="auth-input-wrap">
            <Mail size={18} aria-hidden="true" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@naramed.kz"
              autoComplete="username"
              autoFocus
              required
            />
          </span>
        </label>

        <label>
          Пароль
          <span className="auth-input-wrap">
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль"
              autoComplete="current-password"
              required
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        <button className="auth-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Выполняется вход…" : "Войти"}
        </button>

        <button
          className="auth-demo"
          type="button"
          onClick={() => { setEmail("admin@naramed.kz"); setPassword("Admin123!"); setError(""); }}
        >
          <span>Заполнить данные администратора</span>
          <code>admin@naramed.kz</code>
          <code>Admin123!</code>
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
