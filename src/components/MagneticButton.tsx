import { useRef, useState, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  enableChromatic?: boolean;
  enableGlow?: boolean;
}

/**
 * Enhanced magnetic button with cursor effects, chromatic aberration,
 * and glow effects on hover.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  enableChromatic = true,
  enableGlow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 14, stiffness: 140, mass: 0.12 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set(deltaX * strength);
    y.set(deltaY * strength);

    // Track relative mouse position for effects
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x: relativeX, y: relativeY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = "none";
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    document.body.style.cursor = "";
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`magnetic-button-container inline-block ${className}`}
    >
      {/* Chromatic aberration layers */}
      {enableChromatic && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            animate={{
              opacity: isHovered ? 0.12 : 0,
              x: isHovered ? mousePosition.x * 8 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "blur(1px)" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(226, 168, 145, 0.4) 0%, transparent 60%)",
                transform: "translateX(-3px)",
              }}
            />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            animate={{
              opacity: isHovered ? 0.08 : 0,
              x: isHovered ? mousePosition.x * -8 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "blur(1px)" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(241, 187, 166, 0.3) 0%, transparent 60%)",
                transform: "translateX(3px)",
              }}
            />
          </motion.div>
        </>
      )}

      {/* Glow effect */}
      {enableGlow && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.05 : 0.8,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "radial-gradient(ellipse at center, rgba(226, 168, 145, 0.15) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      )}

      {/* Inner light follow effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(226, 168, 145, 0.12) 0%, transparent 50%)`,
            transition: "background 0.15s ease-out",
          }}
        />
      )}

      {/* Main content */}
      <div
        className={`relative z-10 transition-transform duration-300 ${isHovered ? "scale-[1.02]" : "scale-100"}`}
      >
        {children}
      </div>
    </motion.div>
  );
}
