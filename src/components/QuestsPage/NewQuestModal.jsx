import { useState } from 'react'
import './NewQuestModal.css'
import { makeId } from '../../utils/id'

export default function NewQuestModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [credits, setCredits] = useState("");
  const [xp, setXp] = useState("");
  const [deadline, setDeadline] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [difficulty, setDifficulty] = useState("Normal");
  const [error, setError] = useState(null);

  function handleAdd() {
    if (!name.trim()) { setError("Quest needs a name."); return; }
    if (!from || !to) { setError("Set the time window."); return; }

    onAdd({
      id: makeId(),
      name: name.trim(),
      difficulty,
      from,
      to,
      credits: Number(credits) || 0,
      xp: Number(xp) || 0,
      deadline: deadline.trim(),
      dueDate,
      status: "Pending",
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-quest-modal" onClick={(e) => e.stopPropagation()}>
        <button className="nq-close" onClick={onClose}>✕</button>

        <input
          className="nq-title"
          type="text"
          placeholder="Quest name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div className="nq-rows">
          <div className="nq-row">
            <span className="nq-label">◎ Streak Multiplier</span>
            <span className="nq-empty">Empty</span>
          </div>

          <div className="nq-row">
            <span className="nq-label">Σ Time</span>
            <span className="nq-value">
              <span className="nq-inline-label">From</span>
              <input type="time" value={from} onChange={(e) => setFrom(e.target.value)} />
              <span className="nq-inline-label">To</span>
              <input type="time" value={to} onChange={(e) => setTo(e.target.value)} />
            </span>
          </div>

          <div className="nq-row">
            <span className="nq-label">Σ Task's Credits</span>
            <input className="nq-num" type="number" placeholder="0" value={credits}
              onChange={(e) => setCredits(e.target.value)} />
          </div>

          <div className="nq-row">
            <span className="nq-label">Σ Task's XP</span>
            <input className="nq-num" type="number" placeholder="0" value={xp}
              onChange={(e) => setXp(e.target.value)} />
          </div>

          <div className="nq-row">
            <span className="nq-label">Σ Deadline</span>
            <input className="nq-text" type="text" placeholder="e.g. 4 Hours" value={deadline}
              onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div className="nq-row">
            <span className="nq-label">▦ Due Date</span>
            <input className="nq-date" type="date" value={dueDate}
              onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="nq-row">
            <span className="nq-label">◎ Difficulty</span>
            <select className="nq-select" value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}>
              <option>Easy</option><option>Normal</option><option>Hard</option>
            </select>
          </div>

          <div className="nq-row">
            <span className="nq-label">🖇 Files & media</span>
            <span className="nq-empty">Unlocks later</span>
          </div>
        </div>

        {error && <p className="nq-error">{error}</p>}

        <div className="nq-footer">
          <button className="nq-cancel" onClick={onClose}>Cancel</button>
          <button className="nq-save" onClick={handleAdd}>Add Quest</button>
        </div>
      </div>
    </div>
  );
}