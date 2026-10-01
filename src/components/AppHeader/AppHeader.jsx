import { useNavigate, useLocation } from 'react-router-dom'
import './AppHeader.css'
import { usePlayer } from '../../context/PlayerContext'
import { useTheme } from '../../context/ThemeContext'

const ROUTES = [
  { id: "dashboard", label: "Dashboard", path: "/", locked: false },
  { id: "quests", label: "Quests", path: "/quests", locked: false },
  { id: "habits", label: "Habits", path: "/habits", locked: false },
  { id: "awakening", label: "Awakening", path: "/awakening", locked: true },
  { id: "gates", label: "Gates", path: "/gates", locked: true },
];

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { player } = usePlayer();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <button className="app-brand" onClick={() => navigate('/')}>
        <span className="app-brand-mark" />
        <span className="app-brand-text">SOLO LEVELING</span>
      </button>

      <nav className="app-nav" aria-label="Main">
        {ROUTES.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <button
              key={route.id}
              className={`app-nav-tab ${isActive ? "tab-active" : ""} ${route.locked ? "tab-locked" : ""}`}
              disabled={route.locked}
              onClick={() => navigate(route.path)}
            >
              {route.label}
              {route.locked && <LockIcon />}
            </button>
          );
        })}
      </nav>

      <div className="app-header-right">
        <span className="level-chip">
          <span className="level-chip-label">LV</span>
          <span className="level-chip-value">{player?.level ?? "—"}</span>
        </span>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "midnight" ? "Switch to daybreak theme" : "Switch to midnight theme"}
          title={theme === "midnight" ? "Switch to daybreak" : "Switch to midnight"}
        >
          {theme === "midnight" ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  );
}

function LockIcon() {
  return (
    <svg className="nav-lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" fill="currentColor" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
      </g>
    </svg>
  );
}
