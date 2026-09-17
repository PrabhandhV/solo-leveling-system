import { useState } from 'react'
import './HabitsPage.css'
import PageNav from '../PageNav/PageNav'
import NewHabitModal from './NewHabitModal'
import HabitHeatmap from './HabitHeatmap'
import { getTodayString, daysBetween } from '../../utils/streakTracker'
import { usePlayer } from '../../context/PlayerContext'

const MAX_HEATMAPS = 4;

export default function HabitsPage() {
  const { habits, addHabit, markHabit, setHabitTracked } = usePlayer();
  const [showHabitForm, setShowHabitForm] = useState(false);

  const today = getTodayString();
  const activeHabits = habits.filter((h) => h.status === "active");
  const trackedHabits = activeHabits.filter((h) => h.inHeatmap);
  const untrackedHabits = activeHabits.filter((h) => !h.inHeatmap);
  const milestoneReward = activeHabits.reduce((sum, h) => sum + h.loseXp, 0);

  return (
    <div className="habits-page">
      <div>
        <h1 className="habits-heading">Habits</h1>
        <p className="habits-subheading">Track consistency, streaks, milestones and consequences.</p>
      </div>

      <PageNav current="habits" />

      <div className="habits-main">
        <div className="heatmaps-panel">
          <h2 className="panel-title">Habit Heatmaps</h2>

          {trackedHabits.length === 0 && untrackedHabits.length === 0 && (
            <p className="empty-note">Create a habit goal first — then track it here.</p>
          )}

          {untrackedHabits.length > 0 && trackedHabits.length < MAX_HEATMAPS && (
            <div className="track-picker">
              <p className="picker-label">Choose habits to track ({trackedHabits.length}/{MAX_HEATMAPS}):</p>
              <div className="picker-buttons">
                {untrackedHabits.map((h) => (
                  <button 
                    key={h.id} 
                    className="picker-btn" 
                    disabled={trackedHabits.length >= MAX_HEATMAPS}
                    onClick={() => setHabitTracked(h.id, true)}
                  >
                    <span className="picker-dot" style={{ background: h.color }} /> {h.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="heatmap-grid">
            {trackedHabits.map((habit) => (
              <HabitHeatmap key={habit.id} habit={habit} onDone={() => setHabitTracked(habit.id, false)} />
            ))}
          </div>
        </div>

        <div className="goals-panel">
          <div className="goals-header">
            <h2 className="panel-title">Habit Goals</h2>
            <button className="new-habit-btn" onClick={() => setShowHabitForm(true)}>+ New Habit</button>
          </div>

          <div className="goal-list">
            {activeHabits.length === 0 && <p className="empty-note">No habit goals yet.</p>}
            {activeHabits.map((habit) => {
              const elapsed = daysBetween(habit.startDate, today);
              const remaining = Math.max(0, habit.days - elapsed);
              const markedToday = (habit.record || {})[today] !== undefined;

              return (
                <div className="goal-card" key={habit.id}>
                  <div className="goal-top">
                    <span className="goal-dot" style={{ background: habit.color }} />
                    <p className="goal-name">{habit.name}</p>
                  </div>
                  <p className="goal-remaining">{remaining} day{remaining !== 1 ? "s" : ""} remaining</p>
                  <p className="goal-stakes">
                    <span className="win-value">Win {habit.winXp} XP</span>
                    <span className="lose-value">Lose {habit.loseXp} XP</span>
                  </p>
                  <div className="goal-actions">
                    <button className="goal-complete" disabled={markedToday}
                      onClick={() => markHabit(habit, "complete")}>Complete</button>
                    <button className="goal-missed" disabled={markedToday}
                      onClick={() => markHabit(habit, "missed")}>Missed</button>
                  </div>
                  {markedToday && <p className="marked-note">Marked for today</p>}
                </div>
              );
            })}
          </div>

          <div className="milestone-card">
            <span className="milestone-label">Milestone reward</span>
            <span className="milestone-value">{milestoneReward} credits</span>
          </div>
        </div>
      </div>

      {showHabitForm && (
        <NewHabitModal onAdd={addHabit} onClose={() => setShowHabitForm(false)} />
      )}
    </div>
  );
}