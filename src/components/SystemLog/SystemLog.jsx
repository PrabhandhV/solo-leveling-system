import { useNavigate } from 'react-router-dom'
import './SystemLog.css'

const modules = [
  {
    id: "awakening",
    name: "Awakening",
    description: "Vision, anti-vision and identity",
    accent: "var(--cyan)",
    status: "locked",
  },
  {
    id: "quests",
    name: "Quests",
    description: "Tasks, timers and rewards",
    accent: "var(--purple)",
    status: "active",
  },
  {
    id: "habits",
    name: "Habits",
    description: "Daily streaks and heatmaps",
    accent: "var(--yellow)",
    status: "active",
  },
  {
    id: "gates",
    name: "Gates",
    description: "Boss challenges and unlocks",
    accent: "var(--red)",
    status: "locked",
  },
];

export default function SystemLog() {
  const navigate = useNavigate();

  return (
    <div className="system-log-page">
      <h1 className="nav-heading">Navigation</h1>
      <p className="nav-subheading">Main system routes</p>

      <div className="module-grid">
        {modules.map((mod) => (
          <div className="module-card" key={mod.id} style={{ "--accent": mod.accent }}>
            <div className="module-accent-bar" />
            <h2 className="module-name">{mod.name}</h2>
            <p className="module-description">{mod.description}</p>
            <button
              className="module-open-btn"
              disabled={mod.status === "locked"}
              onClick={() => mod.status === "active" && navigate(`/${mod.id}`)}
            >
              {mod.status === "locked" ? "Locked" : "Open Module"}
            </button>
          </div>
        ))}
      </div>

      <div className="nav-footer">
        <button className="nav-back-btn" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <button className="nav-settings-btn" disabled>System Settings</button>
      </div>
    </div>
  );
}