import './Splash.css'

export default function Splash({ onContinue }) {
  return (
    <div className="splash-screen" onClick={onContinue}>
      <div className="splash-scanline" />

      <div className="splash-frame">
        <span className="splash-bracket bracket-tl" />
        <span className="splash-bracket bracket-tr" />
        <span className="splash-bracket bracket-bl" />
        <span className="splash-bracket bracket-br" />

        <p className="splash-eyebrow">System online</p>
        <h1 className="splash-title">SOLO LEVELING</h1>
        <p className="splash-subtitle">Habit tracker app</p>
      </div>

      <p className="splash-hint">Click anywhere to continue</p>
    </div>
  );
}
