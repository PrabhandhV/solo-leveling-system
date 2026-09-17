import './PlayerProfile.css'

export default function PlayerProfile({ 
  name, 
  level, 
  tagline, 
  rank, 
  questXpCurrent, 
  questXpTotal, 
  xpRequired, 
  xpEarned, 
  goldEarned, 
  onEdit, 
  onLogout,
  photo 
}) {
  const percent = Math.round((questXpCurrent / questXpTotal) * 100);

  return (
    <div className="player-profile">
      <p className="card-label">Player Profile</p>
      <div className="profile-photo">
        {photo && <img src={photo} alt="Player avatar" className="profile-photo-img" />}
      </div>

      <h2 className="profile-name">{name.toUpperCase()}</h2>
      <p className="profile-tagline">Level {level} • {tagline}</p>
      <span className="profile-rank">{rank}</span>

      <div className="profile-progress">
        <p className="progress-heading">Quest completion</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="progress-footer">
          <span>{questXpCurrent} / {questXpTotal} XP</span>
          <span>{percent}%</span>
        </div>
      </div>

      <div className="profile-divider" />

      <div className="profile-stats-row">
        <div>
          <p className="profile-stat-label">XP required</p>
          <p className="profile-stat-value xp-required">{xpRequired} XP</p>
        </div>
        <div>
          <p className="profile-stat-label">XP earned</p>
          <p className="profile-stat-value xp-earned">{xpEarned} XP</p>
        </div>
        <div>
          <p className="profile-stat-label">Gold earned</p>
          <p className="profile-stat-value gold-earned">{goldEarned} credits</p>
        </div>
      </div>

      <div className="profile-buttons">
        <button className="btn-secondary" onClick={onEdit}>Edit Player</button>
        <button className="btn-primary" onClick={onLogout}>Log out</button>
      </div>
    </div>
  );
}