import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getTokens } from '../../tokens'
import { usePlayer } from '../../context/PlayerContext'
import { useTheme } from '../../context/ThemeContext'
import { getTodayString, addDays } from '../../utils/streakTracker'
import './Statistics.css'

const DAYS_SHOWN = 14;

function buildActivityData(taskLog) {
  const today = getTodayString();
  const byDate = {};
  for (const entry of taskLog) {
    const bucket = byDate[entry.date] || { completed: 0, xp: 0 };
    bucket.completed += 1;
    bucket.xp += entry.xp || 0;
    byDate[entry.date] = bucket;
  }

  const days = [];
  for (let i = DAYS_SHOWN - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const weekday = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
    const bucket = byDate[date] || { completed: 0, xp: 0 };
    days.push({ date, label: weekday, completed: bucket.completed, xp: bucket.xp });
  }
  return days;
}

function ActivityTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { date, completed, xp } = payload[0].payload;
  return (
    <div className="activity-tooltip">
      <p className="tooltip-date">{date}</p>
      <p><span className="tooltip-dot tooltip-dot-quests" /> {completed} quest{completed === 1 ? "" : "s"} completed</p>
      <p><span className="tooltip-dot tooltip-dot-xp" /> {xp} XP earned</p>
    </div>
  );
}

export default function Statistics() {
  const { player, taskLog } = usePlayer();
  const { theme } = useTheme();
  const tokens = getTokens(theme);

  const activityData = buildActivityData(taskLog);
  const totalCompleted = activityData.reduce((sum, d) => sum + d.completed, 0);
  const totalXp = activityData.reduce((sum, d) => sum + d.xp, 0);
  const bestDay = Math.max(0, ...activityData.map((d) => d.completed));
  const isEmpty = totalCompleted === 0 && totalXp === 0;

  return (
    <div className="statistics-panel">
      <div className="activity-heading-row">
        <div>
          <p className="card-label">Activity</p>
          <p className="stats-subtitle">Progress telemetry, last {DAYS_SHOWN} days</p>
        </div>
        <div className="activity-legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: tokens.purple }} /> Quests</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: tokens.violet }} /> XP</span>
        </div>
      </div>

      <div className="activity-chart-wrap">
      {isEmpty && (
        <div className="activity-empty">
          <p className="activity-empty-title">Nothing logged yet</p>
          <p className="activity-empty-hint">Complete a quest to start lighting up the last {DAYS_SHOWN} days.</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={activityData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tokens.violet} stopOpacity={0.45} />
              <stop offset="100%" stopColor={tokens.violet} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={tokens.line} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: tokens.muted, fontSize: 12 }} axisLine={{ stroke: tokens.line }} tickLine={false} />
          <YAxis yAxisId="completed" hide domain={[0, (max) => Math.max(4, max + 1)]} />
          <YAxis yAxisId="xp" hide domain={[0, (max) => Math.max(10, max * 1.3)]} />
          <Tooltip content={<ActivityTooltip />} cursor={{ fill: tokens.surface3, opacity: 0.4 }} />
          <Bar yAxisId="completed" dataKey="completed" fill={tokens.purple} fillOpacity={0.55} radius={[5, 5, 0, 0]} barSize={16} />
          <Area yAxisId="xp" type="monotone" dataKey="xp" stroke={tokens.violet} strokeWidth={2.5}
            fill="url(#xpGradient)" dot={false} activeDot={{ r: 4, fill: tokens.violet }} />
        </ComposedChart>
      </ResponsiveContainer>
      </div>

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
          <span className="stat-name">XP earned ({DAYS_SHOWN}d)</span>
          <span className="stat-value">{totalXp}</span>
        </div>
        <div className="stat-item">
          <span className="stat-dot" style={{ background: tokens.cyan }} />
          <span className="stat-name">Best day</span>
          <span className="stat-value">{bestDay}</span>
        </div>
      </div>
    </div>
  );
}
