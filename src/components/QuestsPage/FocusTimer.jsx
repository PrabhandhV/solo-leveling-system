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

      <p className="timer-display">{minutes}:{seconds}</p>

      <div className="timer-controls">
        <button className="timer-start" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="timer-reset" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}