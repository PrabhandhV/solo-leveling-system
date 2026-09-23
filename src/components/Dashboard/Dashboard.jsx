import { useState, useEffect } from 'react'
import './Dashboard.css'
import PlayerProfile from '../PlayerProfile/PlayerProfile'
import Statistics from '../Statistics/Statistics'
import SystemPanel from '../SystemPanel/SystemPanel'
import EditPlayerModal from '../PlayerProfile/EditPlayerModal'
import { getTodayString, daysBetween } from '../../utils/streakTracker'
import { usePlayer } from '../../context/PlayerContext'
import { useAuth } from '../../context/AuthContext'

const XP_PENALTY_PER_MISSED_DAY = 20;

export default function Dashboard() {
  const { logout } = useAuth();
  const { player, quests, loseXp, setStreak, setLastLoginDate, updateProfile } = usePlayer();
  const today = getTodayString();
  const remainingQuests = quests.filter((q) => q.status !== "Completed");

  const [penaltyNotice, setPenaltyNotice] = useState(null);
  const playerName = player.name || "Sung Jin-Woo";
  const playerPhoto = player.photo || null;
  const [isEditingPlayer, setIsEditingPlayer] = useState(false)

  // One-time migration: older builds kept the name/photo in localStorage.
  // Push them to the backend once, then rely on the server going forward.
  useEffect(() => {
    if (player.name) return;
    const legacyName = localStorage.getItem("playerName");
    const legacyPhoto = localStorage.getItem("playerPhoto");
    if (!legacyName && !legacyPhoto) return;

    updateProfile({ name: legacyName || "Sung Jin-Woo", photo: legacyPhoto || null });
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerPhoto");
  }, [player.name]);

  const [isLoggedInToday, setIsLoggedInToday] = useState(
    () => player.lastLoginDate === getTodayString()
  );

  function handleLogin() {
    const lastLogin = player.lastLoginDate;

    if (!lastLogin) {
      setStreak(1);
    } else {
      const gap = daysBetween(lastLogin, today);

      if (gap === 1) {
        setStreak(player.streak + 1);
      } else if (gap > 1) {
        const missedDays = gap - 1;
        const penalty = missedDays * XP_PENALTY_PER_MISSED_DAY;
        loseXp(penalty);
        setStreak(1);
        setPenaltyNotice(`Missed ${missedDays} day${missedDays > 1 ? "s" : ""} — lost ${penalty} XP.`);
      }
    }

    setLastLoginDate(today);
    setIsLoggedInToday(true);
  }

  function handleSavePlayer({ name, photo }) {
    updateProfile({ name, photo });
    setIsEditingPlayer(false);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="dashboard-column">
          <h1 className="section-heading heading-left">Player</h1>
          <PlayerProfile
            name={playerName}
            photo={playerPhoto}
            level={player.level}
            tagline="Rising from the Ashes"
            rank="C-Rank Hunter"
            questXpCurrent={player.xp}
            questXpTotal={player.xpTotal}
            xpRequired={player.xpTotal - player.xp}
            xpEarned={player.xpEarned}
            goldEarned={player.credits}
            onLogout={logout}
            onEdit={() => setIsEditingPlayer(true)}
          />
        </div>

        <div className="dashboard-column">
          <h1 className="section-heading heading-right">System</h1>
          <SystemPanel
            streak={player.streak}
            xpMultiplier={(1 + player.streak * 0.1).toFixed(1) + "x"}
            penaltyNotice={penaltyNotice}
            isLoggedInToday={isLoggedInToday}
            onLogin={handleLogin}
            remainingQuests={remainingQuests}
            dailyProgress={quests.length ? Math.round(((quests.length - remainingQuests.length) / quests.length) * 100) : 0}
          />
        </div>
      </div>

      <div className="dashboard-bottom">
        <h1 className="section-heading heading-center">Activity</h1>
        <Statistics />
      </div>

      {isEditingPlayer && (
        <EditPlayerModal
          currentName={playerName}
          currentPhoto={playerPhoto}
          onSave={handleSavePlayer}
          onClose={() => setIsEditingPlayer(false)}
        />
      )}
    </div>
  );
}