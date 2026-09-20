import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  glareOpacity?: number;
  scale?: number;
  className?: string;
}

/**
 * Adds a subtle pointer-driven three-dimensional tilt and glare effect to a card.
 */
export default function TiltCard({
  children,
  maxTilt = 6,
  glareOpacity = 0.12,
  scale = 1.02,
  className = "",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const resetCard = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.setProperty("--tilt-glare-opacity", "0");
    card.style.setProperty("--tilt-glare-x", "50%");
    card.style.setProperty("--tilt-glare-y", "50%");
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    card.style.setProperty("--tilt-glare-opacity", String(glareOpacity));
    card.style.setProperty("--tilt-glare-x", `${x * 100}%`);
    card.style.setProperty("--tilt-glare-y", `${y * 100}%`);
  };

  const style = {
    "--tilt-glare-opacity": 0,
    "--tilt-glare-x": "50%",
    "--tilt-glare-y": "50%",
  } as CSSProperties;

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-500 ease-out will-change-transform ${className}`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCard}
      onPointerCancel={resetCard}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--tilt-glare-opacity)",
          background:
            "radial-gradient(circle at var(--tilt-glare-x) var(--tilt-glare-y), rgba(255,255,255,.9), transparent 42%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
