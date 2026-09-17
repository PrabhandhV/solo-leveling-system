import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import tokens from '../../tokens'
import './Statistics.css'

const statData = [
  { stat: "FIT", value: 8.7, color: tokens.blue },
  { stat: "SOC", value: 4.4, color: tokens.orange },
  { stat: "INT", value: 9.2, color: tokens.purple },
  { stat: "DIS", value: 6.1, color: tokens.cyan },
  { stat: "FOC", value: 5.8, color: tokens.green },
  { stat: "FIN", value: 5.5, color: tokens.pink },
];

export default function Statistics() {
  return (
    <div className="statistics-panel">
      <p className="card-label">Statistics</p>
      <p className="stats-subtitle">The system levels the player</p>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={statData} outerRadius="75%">
          <PolarGrid stroke={tokens.line} />
          <PolarAngleAxis dataKey="stat" tick={{ fill: tokens.muted, fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke={tokens.purple} fill={tokens.purple} fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>

      <p className="stats-list-heading">Stat distribution</p>
      <div className="stat-grid">
        {statData.map((s) => (
          <div className="stat-item" key={s.stat}>
            <span className="stat-dot" style={{ background: s.color }} />
            <span className="stat-name">{s.stat}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}