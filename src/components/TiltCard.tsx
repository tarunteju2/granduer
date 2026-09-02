import React, { useRef, useState, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  scale?: number;
  perspective?: number;
}

/**
 * TiltCard
 * Understated, tactile depth for luxury editorial layouts.
 * Restrained physics, quiet specular highlights, zero exaggerated gaming tilt.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 3.5,
  glareOpacity = 0.12,
  scale = 1.01,
  perspective = 1400,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const percentX = (clientX / rect.width) * 2 - 1;
    const percentY = (clientY / rect.height) * 2 - 1;

    const rotX = -percentY * maxTilt;
    const rotY = percentX * maxTilt;

    setTilt({ x: rotX, y: rotY });
    setGlare({
      x: (clientX / rect.width) * 100,
      y: (clientY / rect.height) * 100,
      opacity: glareOpacity,
    });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="transform-gpu transition-all"
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered
            ? "transform 140ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`relative overflow-hidden ${className}`}
      >
        {/* Subtle, soft light shift */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.08) 0%, rgba(212, 175, 55, 0.04) 40%, transparent 70%)`,
          }}
        />
        {/* Card content */}
        <div className="relative z-10 h-full w-full [transform-style:preserve-3d]">
          {children}
        </div>
      </div>
    </div>
  );
}
