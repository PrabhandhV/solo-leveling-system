import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import tokens from '../../tokens'
import { usePlayer } from '../../context/PlayerContext'
import { getTodayString, addDays } from '../../utils/streakTracker'
import './Statistics.css'

const DAYS_SHOWN = 14;

function buildActivityData(taskLog) {
  const today = getTodayString();
  const countsByDate = {};
  for (const entry of taskLog) {
    countsByDate[entry.date] = (countsByDate[entry.date] || 0) + 1;
  }

  const days = [];
  for (let i = DAYS_SHOWN - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const weekday = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
    days.push({ date, label: weekday, completed: countsByDate[date] || 0 });
  }
  return days;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { date, completed } = payload[0].payload;
  return (
    <div className="activity-tooltip">
      <p>{date}</p>
      <p>{completed} quest{completed === 1 ? "" : "s"} completed</p>
    </div>
  );
}

export default function Statistics() {
  const { player, taskLog } = usePlayer();
  const activityData = buildActivityData(taskLog);
  const totalCompleted = activityData.reduce((sum, d) => sum + d.completed, 0);
  const bestDay = Math.max(0, ...activityData.map((d) => d.completed));

  return (
    <div className="statistics-panel">
      <p className="card-label">Activity</p>
      <p className="stats-subtitle">Quests completed, last {DAYS_SHOWN} days</p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={activityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={tokens.line} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: tokens.muted, fontSize: 12 }} axisLine={{ stroke: tokens.line }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: tokens.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: tokens.surface2 }} />
          <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
            {activityData.map((d) => (
              <Cell key={d.date} fill={d.date === getTodayString() ? tokens.violet : tokens.purple} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-dot" style={{ background: tokens.purple }} />
          <span className="stat-name">Login streak</span>
          <span className="stat-value">{player.streak} day{player.streak === 1 ? "" : "s"}</span>
        </div>
        <div className="stat-item">
          <span className="stat-dot" style={{ background: tokens.violet }} />
          <span className="stat-name">Completed ({DAYS_SHOWN}d)</span>
          <span className="stat-value">{totalCompleted}</span>
        </div>
        <div className="stat-item">
          <span className="stat-dot" style={{ background: tokens.blue }} />
          <span className="stat-name">Best day</span>
          <span className="stat-value">{bestDay}</span>
        </div>
      </div>
    </div>
  );
}
