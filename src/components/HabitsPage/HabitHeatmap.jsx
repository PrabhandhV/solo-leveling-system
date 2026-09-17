import { getTodayString, daysBetween, addDays } from '../../utils/streakTracker'
import './HabitsPage.css'

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MAX_CELLS = 28;

export default function HabitHeatmap({ habit, onDone }) {
  const today = getTodayString();
  const todayIndex = daysBetween(habit.startDate, today);
  const offset = new Date(habit.startDate + "T00:00:00").getDay();

  let windowStart = 0;
  if (offset + habit.days > MAX_CELLS && todayIndex > MAX_CELLS - offset - 7) {
    windowStart = Math.min(todayIndex - (MAX_CELLS - 14), habit.days - MAX_CELLS);
    windowStart = Math.max(0, windowStart);
  }

  const showOffset = windowStart === 0 ? offset : 0;
  const visibleDays = Math.min(habit.days - windowStart, MAX_CELLS - showOffset);

  const cells = [];
  for (let i = 0; i < showOffset; i++) {
    cells.push(<div key={`lock-${i}`} className="hm-cell hm-locked" />);
  }
  for (let i = 0; i < visibleDays; i++) {
    const dayIndex = windowStart + i;
    const cellDate = addDays(habit.startDate, dayIndex);
    const mark = (habit.record || {})[cellDate];

    let cls = "hm-future";
    let style = {};
    if (mark === "complete") { cls = "hm-complete"; style = { background: habit.color }; }
    else if (mark === "missed") { cls = "hm-missed"; style = { borderColor: habit.color }; }
    else if (cellDate === today) { cls = "hm-today"; style = { borderColor: habit.color }; }
    else if (cellDate < today) { cls = "hm-past"; }

    cells.push(<div key={cellDate} className={`hm-cell ${cls}`} style={style} title={cellDate} />);
  }

  return (
    <div className="heatmap-card">
      <div className="heatmap-header">
        <span className="hm-dot" style={{ background: habit.color }} />
        <p className="hm-name">{habit.name}</p>
      </div>
      <div className="hm-weekdays">
        {WEEKDAYS.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="hm-grid">{cells}</div>
      <button className="hm-done-btn" onClick={onDone}>Done</button>
    </div>
  );
}