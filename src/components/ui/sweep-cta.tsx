import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { EASE_SWEEP } from "@/lib/motion";

interface SweepCtaProps {
  href: string;
  label: string;
  className?: string;
  arrowClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Bone outline button with a terracotta fill sweeping in on hover
 * via translateX only (DESIGN.md directive 1). Reduced motion keeps the
 * palette swap but drops the sweep travel.
 */
export default function SweepCta({
  href,
  label,
  className,
  arrowClassName,
  onClick,
}: SweepCtaProps) {
  const reduced = useReducedMotion();
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 22, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 240, damping: 22, mass: 0.35 });

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || !ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const distanceX = event.clientX - (rect.left + rect.width / 2);
    const distanceY = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(distanceX, distanceY);
    const radius = 140;
    const influence = distance < radius ? 1 - distance / radius : 0;
    x.set(distanceX * influence * 0.12);
    y.set(distanceY * influence * 0.12);
  };

  const resetMagnet = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ctaRef}
      style={reduced ? undefined : { x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetMagnet}
      onBlur={resetMagnet}
      onFocus={resetMagnet}
      onClick={onClick}
      href={href}
      data-magnetic
      data-magnetic-color="#f1bba6"
      className={cn(
        "group/cta relative inline-flex items-center gap-3 overflow-hidden border border-[#f5f1e9]/45 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#f5f1e9] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]",
        reduced
          ? "transition-colors duration-300 hover:border-[#e2a891] hover:text-[#e2a891]"
          : "transition-colors duration-500 hover:text-[#101416]",
        className,
      )}
      whileHover={reduced ? undefined : "sweep"}
      initial="rest"
      animate="rest"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 bg-[#e2a891]"
        variants={{
          rest: { x: reduced ? "0%" : "-100%", opacity: reduced ? 0 : 1 },
          sweep: { x: "0%", opacity: 1 },
        }}
        transition={{ duration: 0.35, ease: EASE_SWEEP }}
      />
      <span className="relative z-10">{label}</span>
      <ArrowUpRight
        size={15}
        strokeWidth={1.5}
        className={cn(
          "relative z-10 transition-transform duration-500 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5",
          arrowClassName,
        )}
      />
    </motion.a>
  );
}
