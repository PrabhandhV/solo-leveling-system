import { useState } from 'react'
import './QuestsPage.css'
import FocusTimer from './FocusTimer'
import PageNav from '../PageNav/PageNav'
import NewQuestModal from './NewQuestModal'
import NewRewardModal from './NewRewardModal'
import { usePlayer } from '../../context/PlayerContext'

export default function QuestsPage() {
  const { player, quests, rewards, taskLog, addQuest, completeQuest, removeQuest, addReward, claimReward } = usePlayer();

  const [showForm, setShowForm] = useState(false);
  const [showRewardForm, setShowRewardForm] = useState(false);

  return (
    <div className="quests-page">
      <div className="quests-topbar">
        <div>
          <h1 className="quests-heading">Quests</h1>
          <p className="quests-subheading">Build the day. Complete the mission. Claim the reward.</p>
        </div>
      </div>

      <PageNav current="quests" />

      <div className="quests-main">
        <div className="quests-left">
          <div className="quests-list-header">
            <h2 className="panel-title">Today's Quests</h2>
            <button className="new-quest-btn" onClick={() => setShowForm(true)}>+ New Quest</button>
          </div>

          <div className="quest-cards">
            {quests.map((quest) => (
              <div className="quest-card" key={quest.id}>
                <p className="quest-card-name">{quest.name}</p>
                <span className={`difficulty-badge diff-${quest.difficulty}`}>{quest.difficulty}</span>
                <p className="quest-time">
                  <span className="quest-label">From</span> {quest.from} <span className="quest-label">To</span> {quest.to}
                </p>
                <p className="quest-meta">Credits: <span className="credits-value">{quest.credits}</span></p>
                <p className="quest-meta">XP: <span className="xp-value">{quest.xp}</span></p>

                {quest.status === "Completed" ? (
                  <div className="quest-card-footer">
                    <span className="completed-badge">Completed ●</span>
                    <button className="remove-btn" onClick={() => removeQuest(quest.id)}>✕</button>
                  </div>
                ) : (
                  <button className="complete-btn" onClick={() => completeQuest(quest)}>Complete</button>
                )}
              </div>
            ))}
            {quests.length === 0 && <p className="empty-note">No quests today. Add one.</p>}
          </div>
        </div>

        <div className="quests-right">
          <FocusTimer />
        </div>
      </div>

      <div className="quests-bottom">
        <div className="reward-centre">
          <div className="reward-header">
            <h2 className="panel-title">Reward Centre</h2>
            <div className="reward-header-right">
              <span className="available-gold">{player.credits} credits</span>
              <button className="add-reward-btn" onClick={() => setShowRewardForm(true)}>+ Add</button>
            </div>
          </div>
          <div className="reward-grid">
            {rewards.map((reward) => (
              <div className="reward-card" key={reward.id}>
                <div className="reward-banner" />
                <p className="reward-name">{reward.name}</p>
                <p className="reward-cost">{reward.cost} credits required</p>
                <button
                  className="claim-btn"
                  disabled={reward.status === "Claimed" || player.credits < reward.cost}
                  onClick={() => claimReward(reward)}
                >
                  {reward.status === "Claimed" ? "Claimed" : "Claim Reward"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="task-log">
          <div className="log-header">
            <h2 className="panel-title">Task Log</h2>
            {taskLog.length > 3 && <button className="show-more-btn">Show more</button>}
          </div>
          <div className="log-grid">
            {taskLog.length === 0 && <p className="empty-note">Completed quests will be archived here.</p>}
            {taskLog.slice(0, 3).map((entry) => (
              <div className="log-card" key={entry.id}>
                <p className="log-name">{entry.name}</p>
                <p className="log-date">{entry.date}</p>
                <p className="log-meta">Task XP: <span className="xp-value">{entry.xp} XP</span></p>
                <p className="log-meta">Credits: <span className="credits-value">{entry.credits}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && <NewQuestModal onAdd={addQuest} onClose={() => setShowForm(false)} />}
      {showRewardForm && <NewRewardModal onAdd={addReward} onClose={() => setShowRewardForm(false)} />}
    </div>
  );
}