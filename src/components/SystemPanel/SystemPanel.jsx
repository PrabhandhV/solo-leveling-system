import './SystemPanel.css'
import { useNavigate } from 'react-router-dom'

export default function SystemPanel({
  streak,
  xpMultiplier,
  gateXp = 4000,
  xpNeeded = 1210,
  dailyProgress = 25,
  penaltyNotice,
  isLoggedInToday,
  onLogin,
  remainingQuests,
}) {

  const navigate = useNavigate();

  return (
    <div className="system-panel">
      <div className="system-header">
        <span className="system-icon" />
        <h2 className="system-title">The System</h2>
      </div>
      <div className="system-divider" />

      <p className="section-label label-cyan">Streak status</p>
      <div className="system-row">
        <span className="system-label">Current streak</span>
        <span className="system-value">{streak} day{streak !== 1 ? "s" : ""}</span>
      </div>

      <p className="section-label label-yellow">System gift</p>
      <div className="system-row">
        <span className="system-label">XP multiplier</span>
        <span className="system-value gift">{xpMultiplier} active</span>
      </div>

      {!isLoggedInToday && (
        <button className="login-btn" onClick={onLogin}>Log in for today</button>
      )}

      {isLoggedInToday && (
        <>
          {penaltyNotice && (
            <>
              <p className="section-label label-orange">Login penalty</p>
              <div className="system-alert alert-penalty">
                <p className="alert-title">{penaltyNotice}</p>
              </div>
            </>
          )}

          {remainingQuests.length > 0 ? (
            <>
              <p className="section-label label-red">System warning</p>
              <div className="system-alert">
                <p className="alert-title">Your quest is not yet complete.</p>
                <p className="alert-subtitle">
                  {remainingQuests.length} task{remainingQuests.length !== 1 ? "s" : ""} remaining today.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="section-label label-green">Daily quests</p>
              <div className="system-alert alert-success">
                <p className="alert-title">All quests complete.</p>
                <p className="alert-subtitle">The System is satisfied. For now.</p>
              </div>
            </>
          )}

          
          <div className="progress-track">                                                {/* Progress bar for daily quests completion */}
            <div className="progress-fill" style={{ width: `${dailyProgress}%` }} />
          </div>

          <p className="system-subheading">Remaining quests</p>
          <ul className="remaining-list">
            {remainingQuests.length === 0 && <li className="remaining-empty">All quests complete.</li>}
            {remainingQuests.map((q) => (
              <li key={q.id}>
                <span className="quest-checkbox" />
                {q.name}
              </li>
            ))}
          </ul>

          <div className="system-divider" />

          <p className="section-label label-yellow">Next gate</p>
          <div className="system-row">
            <span className="system-label">Unlock requirement</span>
            <span className="system-value">{gateXp.toLocaleString()} XP</span>
          </div>
          <div className="system-row">
            <span className="system-label">XP needed</span>
            <span className="system-value needed">{xpNeeded.toLocaleString()} XP</span>
          </div>

          <button className="system-log-btn" onClick={() => navigate('/system-log')}>
            Open System Log
          </button>
        </>
      )}
    </div>
  );
}