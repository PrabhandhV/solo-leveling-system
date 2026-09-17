import { useNavigate } from 'react-router-dom'
import './PageNav.css'

const links = [
  { id: "dashboard", label: "Dashboard", path: "/", locked: false },
  { id: "awakening", label: "Awakening", path: "/awakening", locked: true },
  { id: "quests", label: "Quests", path: "/quests", locked: false },
  { id: "habits", label: "Habits", path: "/habits", locked: false },
  { id: "gates", label: "Gates", path: "/gates", locked: true },
];

export default function PageNav({ current }) {
  const navigate = useNavigate();

  return (
    <div className="page-nav">
      {links
        .filter((link) => link.id !== current)
        .map((link) => (
          <button
            key={link.id}
            className="page-nav-btn"
            disabled={link.locked}
            onClick={() => !link.locked && navigate(link.path)}
          >
            {link.label}
            {link.locked && <span className="nav-lock"> 🔒</span>}
          </button>
        ))}
    </div>
  );
}