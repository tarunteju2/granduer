import type { ComponentType, MouseEvent } from "react";
import { useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

type ClipSide = "left" | "bottom" | "top" | "right";
type IconComponent = ComponentType<{ className?: string }>;

const ENTRANCE_KEYFRAMES: Record<ClipSide, [string, string]> = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: Record<ClipSide, [string, string]> = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

export interface ClipPathLink {
  name: string;
  href: string;
  icon: IconComponent;
}

interface LinkBoxProps extends ClipPathLink {
  className?: string;
}

function getNearestSide(event: MouseEvent<HTMLAnchorElement>): ClipSide {
  const box = event.currentTarget.getBoundingClientRect();
  const distances: Array<{ proximity: number; side: ClipSide }> = [
    { proximity: Math.abs(box.left - event.clientX), side: "left" },
    { proximity: Math.abs(box.right - event.clientX), side: "right" },
    { proximity: Math.abs(box.top - event.clientY), side: "top" },
    { proximity: Math.abs(box.bottom - event.clientY), side: "bottom" },
  ];

  distances.sort((a, b) => a.proximity - b.proximity);
  return distances[0].side;
}

function LinkBox({ name, href, icon: Icon, className }: LinkBoxProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[getNearestSide(event)] }, { duration: 0.35, ease: "easeOut" });
  };

  const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    animate(scope.current, { clipPath: EXIT_KEYFRAMES[getNearestSide(event)] }, { duration: 0.3, ease: "easeIn" });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative grid min-h-20 w-full place-content-center border-white/10 bg-[#101416] text-white/45 transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a891] focus-visible:ring-inset sm:min-h-24",
        className,
      )}
    >
      <Icon className="h-5 w-5 transition-transform duration-300 sm:h-6 sm:w-6" />
      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-[#e2a891] text-[#101416]"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    </a>
  );
}

export interface ClipPathLinksProps {
  links: ClipPathLink[];
  className?: string;
}

/** Animated social-link grid with a nearest-edge clip-path hover reveal. */
export function ClipPathLinks({ links, className }: ClipPathLinksProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 overflow-hidden border border-white/15 bg-[#101416] sm:grid-cols-4",
        className,
      )}
    >
      {links.map((link) => (
        <LinkBox
          key={link.name}
          {...link}
          className="border-r border-b border-white/10 last:border-r-0 sm:border-b-0 sm:last:border-r-0"
        />
      ))}
    </div>
  );
}
