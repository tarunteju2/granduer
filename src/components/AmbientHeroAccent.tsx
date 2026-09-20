/**
 * Static gradient wash behind the hero. The live staffing-brief ledger is the
 * hero's focal point now (DESIGN.md directive 1), so this stays a single,
 * non-blurred, low-opacity wash — transform/opacity-free and reduced-motion
 * safe by construction.
 */
export default function AmbientHeroAccent() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse 55% 45% at 78% 18%, rgba(226,168,145,0.10), transparent 62%), radial-gradient(ellipse 70% 60% at 20% 85%, rgba(21,27,29,0.85), transparent 70%), linear-gradient(180deg, rgba(16,20,22,0.55) 0%, rgba(16,20,22,0.2) 55%, rgba(16,20,22,0.75) 100%)",
      }}
    />
  );
}
