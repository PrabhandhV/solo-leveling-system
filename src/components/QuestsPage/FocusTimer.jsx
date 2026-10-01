import { useState, useEffect } from 'react'

const MODES = {
  pomodoro: { label: "Pomodoro", seconds: 50 * 60 },
  short: { label: "Short Break", seconds: 10 * 60 },
  long: { label: "Long Break", seconds: 30 * 60 },
};

export default function FocusTimer() {
  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(MODES.pomodoro.seconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  function switchMode(newMode) {
    setMode(newMode);
    setSecondsLeft(MODES[newMode].seconds);
    setIsRunning(false);
  }

  function reset() {
    setSecondsLeft(MODES[mode].seconds);
    setIsRunning(false);
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const fraction = secondsLeft / MODES[mode].seconds;
  const dashoffset = circumference * (1 - fraction);

  return (
    <div className="focus-timer">
      <div className="timer-modes">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            className={`mode-btn ${mode === key ? "mode-active" : ""}`}
            onClick={() => switchMode(key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="timer-ring">
        <svg width="210" height="210" viewBox="0 0 210 210">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--purple)" />
              <stop offset="100%" stopColor="var(--blue)" />
            </linearGradient>
          </defs>
          <circle className="timer-ring-track" cx="105" cy="105" r={radius} />
          <circle
            className="timer-ring-progress"
            cx="105" cy="105" r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
          />
        </svg>
        <p className="timer-display">{minutes}:{seconds}</p>
      </div>

      <div className="timer-controls">
        <button className="timer-start" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="timer-reset" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}