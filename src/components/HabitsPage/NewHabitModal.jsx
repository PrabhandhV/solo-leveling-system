import { useState } from 'react'
import './NewHabitModal.css'
import { makeId } from '../../utils/id'
import { getTodayString } from '../../utils/streakTracker'

const COLORS = ["#8C3DFF", "#2E7CFF", "#19D9FF", "#35D07F", "#F6C84C", "#FF8A2A", "#FF4D67", "#F63DAE"];

export default function NewHabitModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [winXp, setWinXp] = useState("");
  const [loseXp, setLoseXp] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState(null);

  function handleAdd() {
    if (!name.trim()) { setError("Habit needs a name."); return; }
    const daysNum = Number(days);
    if (!daysNum || daysNum < 1) { setError("Set how many days to track."); return; }

    onAdd({
      id: makeId(),
      name: name.trim(),
      days: daysNum,
      winXp: Number(winXp) || 0,
      loseXp: Number(loseXp) || 0,
      color,
      startDate: getTodayString(),
      record: {},
      inHeatmap: false,
      status: "active",
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-habit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="nh-close" onClick={onClose}>✕</button>

        <input className="nh-title" type="text" placeholder="Habit name"
          value={name} onChange={(e) => setName(e.target.value)} autoFocus />

        <div className="nh-rows">
          <div className="nh-row">
            <span className="nh-label">Σ Days to track</span>
            <input className="nh-num" type="number" placeholder="30" value={days}
              onChange={(e) => setDays(e.target.value)} />
          </div>
          <div className="nh-row">
            <span className="nh-label">Σ Win XP (daily)</span>
            <input className="nh-num" type="number" placeholder="0" value={winXp}
              onChange={(e) => setWinXp(e.target.value)} />
          </div>
          <div className="nh-row">
            <span className="nh-label">Σ Lose XP (on failure)</span>
            <input className="nh-num" type="number" placeholder="0" value={loseXp}
              onChange={(e) => setLoseXp(e.target.value)} />
          </div>
          <div className="nh-row">
            <span className="nh-label">◎ Color</span>
            <div className="nh-colors">
              {COLORS.map((c) => (
                <button key={c} type="button"
                  className={`nh-swatch ${color === c ? "swatch-active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)} />
              ))}
            </div>
          </div>
        </div>

        {error && <p className="nh-error">{error}</p>}

        <div className="nh-footer">
          <button className="nh-cancel" onClick={onClose}>Cancel</button>
          <button className="nh-save" onClick={handleAdd}>Add Habit</button>
        </div>
      </div>
    </div>
  );
}