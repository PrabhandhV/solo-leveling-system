import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'
import { getTodayString, daysBetween } from '../utils/streakTracker'
import { useAuth } from './AuthContext'

export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { token } = useAuth();

  const [player, setPlayer] = useState(null);
  const [quests, setQuests] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [taskLog, setTaskLog] = useState([]);
  const [habits, setHabits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        setError(null);

        const [playerData, questData, rewardData, logData, habitData] = await Promise.all([
          api.get("/player"),
          api.get("/quests"),
          api.get("/rewards"),
          api.get("/taskLog"),
          api.get("/habits"),
        ]);

        if (cancelled) return;

        setPlayer(playerData);
        setQuests(questData);
        setRewards(rewardData);
        setTaskLog(logData);
        setHabits(habitData);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, [token]);

  async function savePlayer(updated) {
    setPlayer(updated);
    try {
      await api.put("/player", updated);
    } catch {
      setError("Couldn't save player progress.");
    }
  }

  function awardXp(amount) {
    if (!player) return;
    const gained = Math.round(amount * (1 + player.streak * 0.1));
    let newXp = player.xp + gained;
    let newLevel = player.level;
    while (newXp >= player.xpTotal) {
      newXp -= player.xpTotal;
      newLevel += 1;
    }
    savePlayer({ ...player, xp: newXp, level: newLevel, xpEarned: player.xpEarned + gained });
  }

  function loseXp(amount) {
    if (!player) return;
    savePlayer({
      ...player,
      xp: Math.max(0, player.xp - amount),
      xpEarned: Math.max(0, player.xpEarned - amount),
    });
  }

  function setStreak(value) {
    if (!player) return;
    savePlayer({ ...player, streak: value });
  }

  function setLastLoginDate(date) {
    if (!player) return;
    savePlayer({ ...player, lastLoginDate: date });
  }

  function updateProfile({ name, photo }) {
    if (!player) return;
    savePlayer({ ...player, name, photo: photo ?? player.photo });
  }

  async function addQuest(quest) {
    const created = await api.post("/quests", quest);
    setQuests((prev) => [...prev, created]);
  }

  async function completeQuest(quest) {
    if (quest.status === "Completed" || !player) return;

    const updated = { ...quest, status: "Completed" };
    setQuests((prev) => prev.map((q) => (q.id === quest.id ? updated : q)));
    await api.put(`/quests/${quest.id}`, updated);

    const entry = { name: quest.name, xp: quest.xp, credits: quest.credits, date: getTodayString() };
    const createdEntry = await api.post("/taskLog", entry);
    setTaskLog((prev) => [createdEntry, ...prev]);

    const gained = Math.round(quest.xp * (1 + player.streak * 0.1));
    let newXp = player.xp + gained;
    let newLevel = player.level;
    while (newXp >= player.xpTotal) {
      newXp -= player.xpTotal;
      newLevel += 1;
    }
    savePlayer({
      ...player,
      xp: newXp,
      level: newLevel,
      xpEarned: player.xpEarned + gained,
      credits: player.credits + quest.credits,
    });
  }

  async function removeQuest(id) {
    setQuests((prev) => prev.filter((q) => q.id !== id));
    await api.delete(`/quests/${id}`);
  }

  async function addReward(reward) {
    const created = await api.post("/rewards", reward);
    setRewards((prev) => [...prev, created]);
  }

  async function claimReward(reward) {
    if (!player || player.credits < reward.cost) return false;

    const updated = { ...reward, status: "Claimed" };
    setRewards((prev) => prev.map((r) => (r.id === reward.id ? updated : r)));
    await api.put(`/rewards/${reward.id}`, updated);

    savePlayer({ ...player, credits: player.credits - reward.cost });
    return true;
  }

  async function addHabit(habit) {
    const created = await api.post("/habits", habit);
    setHabits((prev) => [...prev, created]);
  }

  async function markHabit(habit, result) {
    const today = getTodayString();
    const dayIndex = daysBetween(habit.startDate, today);
    const isFinalDay = dayIndex >= habit.days - 1;

    const updated = {
      ...habit,
      record: { ...(habit.record || {}), [today]: result },
      status: isFinalDay ? "finished" : "active",
    };

    setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)));
    await api.put(`/habits/${habit.id}`, updated);

    if (result === "complete") awardXp(habit.winXp);
    else loseXp(habit.loseXp);
  }

  async function setHabitTracked(id, tracked) {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;
    const updated = { ...habit, inHeatmap: tracked };
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    await api.put(`/habits/${id}`, updated);
  }

  const value = {
    player: token ? player : null,
    quests: token ? quests : [],
    rewards: token ? rewards : [],
    taskLog: token ? taskLog : [],
    habits: token ? habits : [],
    loading: token ? loading : false,
    error,
    awardXp, loseXp, setStreak, setLastLoginDate, updateProfile,
    addQuest, completeQuest, removeQuest,
    addReward, claimReward,
    addHabit, markHabit, setHabitTracked,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside a PlayerProvider");
  return context;
}