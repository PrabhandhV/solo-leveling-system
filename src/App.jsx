import { useState } from 'react'
import { usePlayer } from './context/PlayerContext'
import './App.css'
import Splash from './components/Splash/Splash'
import Dashboard from './components/Dashboard/Dashboard'
import { Route, Routes, useNavigate } from 'react-router-dom'
import SystemLog from './components/SystemLog/SystemLog'
import QuestsPage from './components/QuestsPage/QuestsPage'
import HabitsPage from './components/HabitsPage/HabitsPage'
import { useAuth } from './context/AuthContext'
import AuthPage from './components/Auth/AuthPage'

function App() {
  const { isLoggedIn } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const { loading, error } = usePlayer();
  const navigate = useNavigate();

  function handleSplashContinue() {
    setShowSplash(false);
    navigate('/');
  }
  return (
    <>
      {showSplash ? (
        <Splash onContinue={handleSplashContinue} />
      ) : !isLoggedIn ? (
        <AuthPage />
      ) : loading ? (
        <div className="app-status">Loading system data…</div>
      ) : error ? (
        <div className="app-status app-error">
          {error}
          <p className="status-hint">Is the API running? Try: npm run server</p>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/system-log" element={<SystemLog />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/habits" element={<HabitsPage />} />
        </Routes>
      )}
    </>
  );
}

export default App