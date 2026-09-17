import { useState } from 'react'
import './NewRewardModal.css'
import { makeId } from '../../utils/id'
import { usePlayer } from '../../context/PlayerContext'


export default function NewRewardModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState(null);

  const costNum = Number(cost) || 0;
  const { player } = usePlayer();
  const isAvailable = costNum > 0 && player.credits >= costNum;

  function handleAdd() {
    if (!name.trim()) { setError("Reward needs a name."); return; }
    if (costNum <= 0) { setError("Set a gold cost above zero."); return; }

    onAdd({
      id: makeId(),
      name: name.trim(),
      cost: costNum,
      status: "Not Claimed",
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-reward-modal" onClick={(e) => e.stopPropagation()}>
        <button className="nr-close" onClick={onClose}>✕</button>

        <div className="nr-badge">★</div>

        <input
          className="nr-title"
          type="text"
          placeholder="Reward name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div className="nr-rows">
          <div className="nr-row">
            <span className="nr-label"># Gold Required</span>
            <input className="nr-num" type="number" placeholder="0" value={cost}
              onChange={(e) => setCost(e.target.value)} />
          </div>

          <div className="nr-row">
            <span className="nr-label">◎ Available Gold</span>
            <span className="nr-static">{player.credits}</span>
          </div>

          <div className="nr-row">
            <span className="nr-label">Σ Availability</span>
            <span className={`nr-pill ${isAvailable ? "pill-available" : "pill-unavailable"}`}>
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <div className="nr-row">
            <span className="nr-label">Σ Gold Label</span>
            <span className="nr-pill pill-gold">
              {costNum > 0 ? `${costNum} Credits required` : "—"}
            </span>
          </div>

          <div className="nr-row">
            <span className="nr-label">◎ Status</span>
            <span className="nr-pill pill-neutral">Not Claimed</span>
          </div>
        </div>

        {error && <p className="nr-error">{error}</p>}

        <div className="nr-footer">
          <button className="nr-cancel" onClick={onClose}>Cancel</button>
          <button className="nr-save" onClick={handleAdd}>Add Reward</button>
        </div>
      </div>
    </div>
  );
}