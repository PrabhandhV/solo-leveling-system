import { useState } from 'react'
import './AuthPage.css'
import { useAuth } from '../../context/AuthContext'

export default function AuthPage() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (isRegister && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      if (isRegister) {
        await register(email.trim(), password, displayName.trim() || "Hunter");
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <h1 className="auth-title">SOLO LEVELING</h1>
        <p className="auth-subtitle">
          {isRegister ? "Register as a hunter" : "Enter the system"}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Hunter name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? "Please wait…" : isRegister ? "Register" : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already a hunter?" : "New to the system?"}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => { setMode(isRegister ? "login" : "register"); setError(null); }}
          >
            {isRegister ? "Log in" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}