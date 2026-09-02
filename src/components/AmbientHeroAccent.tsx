/**
 * Deterministic Aurora Veil accent for the hero.
 * Uses CSS only so the effect remains visible in embedded previews and browsers
 * without WebGL support, while reduced-motion rules flatten it to a still veil.
 */
export default function AmbientHeroAccent() {
  return (
    <div className="aurora-veil" aria-hidden="true">
      <span className="absolute left-[8%] top-[18%] h-2 w-2 border border-[#e2a891]" />
      <span className="absolute left-[8.35%] top-[calc(18%+2px)] h-24 w-px bg-[#e2a891]/30" />
      <span className="absolute right-[8%] top-[22%] h-px w-24 bg-[#e2a891]/30" />
      <span className="absolute bottom-[18%] left-[12%] h-px w-40 bg-white/15" />
    </div>
  );
}
