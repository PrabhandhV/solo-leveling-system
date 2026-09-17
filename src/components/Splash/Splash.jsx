import './Splash.css'

export default function Splash({ onContinue }) {
  return (
    <div className="splash-screen" onClick={onContinue}>
      <h1 className="splash-title">SOLO LEVELING</h1>
      <p className="splash-subtitle">HABIT TRACKER APP</p>
      <p className="splash-hint">Click anywhere to continue</p>
    </div>
  );
}