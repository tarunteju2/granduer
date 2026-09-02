/**
 * Deterministic Aurora Veil accent for the hero.
 * Uses CSS only so the effect remains visible in embedded previews and browsers
 * without WebGL support, while reduced-motion rules flatten it to a still veil.
 */
export default function AmbientHeroAccent() {
  return (
    <div className="aurora-veil" aria-hidden="true">
      <span className="aurora-veil__bloom aurora-veil__bloom--primary" />
      <span className="aurora-veil__bloom aurora-veil__bloom--secondary" />
      <span className="aurora-veil__haze" />
    </div>
  );
}
