import { useState } from 'react'
import './EditPlayerModal.css'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB

export default function EditPlayerModal({ currentName, currentPhoto, onSave, onClose }) {
  const [name, setName] = useState(currentName);
  const [photo, setPhoto] = useState(currentPhoto);
  const [error, setError] = useState(null);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_BYTES) {
      setError("Photo is too large — 2 MB max.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setError(null);
    };
    reader.onerror = () => setError("Couldn't read that file. Try another.");
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!name.trim()) {
      setError("Name can't be empty.");
      return;
    }
    onSave({ name: name.trim(), photo });
  }

  const initials = name.trim()
    ? name.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <p className="edit-modal-title">Edit player</p>
          <button className="edit-modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="edit-modal-subtitle">The system will update your hunter record.</p>

        <div className="photo-row">
          <div className="photo-preview">
            {photo ? <img src={photo} alt="Player avatar" /> : initials}
          </div>
          <div className="photo-upload">
            <label className="upload-box">
              <input type="file" accept="image/png, image/jpeg" onChange={handlePhotoChange} />
              Upload photo
            </label>
            <p className="upload-hint">PNG or JPG, up to 2 MB</p>
          </div>
        </div>

        <p className="field-label label-cyan">Player name</p>
        <input
          className="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hunter name"
        />

        <p className="field-label">Title</p>
        <div className="locked-field">🔒 Unlocks with the reward system</div>

        {error && <p className="edit-error">{error}</p>}

        <div className="edit-modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}