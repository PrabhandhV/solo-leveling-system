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
        <span className="auth-bracket bracket-tl" />
        <span className="auth-bracket bracket-br" />

        <h1 className="auth-title">SOLO LEVELING</h1>
        <p className="auth-subtitle">
          {isRegister ? "Register as a hunter" : "Enter the system"}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="auth-field">
              <UserIcon />
              <input
                type="text"
                placeholder="Hunter name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
          )}
          <label className="auth-field">
            <MailIcon />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="auth-field">
            <LockIcon />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>

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

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}