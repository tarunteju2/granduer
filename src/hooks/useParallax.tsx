import { useEffect, useRef, useCallback, useState } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

interface ParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal";
  offset?: number;
  maxOffset?: number;
}

/**
 * Multi-layer parallax hook with performance optimizations.
 * Returns motion values for use with framer-motion components.
 */
export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = "vertical", offset = 0, maxOffset = 100 } = options;

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const scrollY = useMotionValue(0);
  const smoothScrollY = useSpring(scrollY, { damping: 30, stiffness: 100 });

  const parallaxY = useTransform(
    smoothScrollY,
    [0, typeof window !== "undefined" ? window.innerHeight : 1000],
    direction === "vertical"
      ? [offset, -maxOffset * speed]
      : [0, 0]
  );

  const parallaxX = useTransform(
    smoothScrollY,
    [0, typeof window !== "undefined" ? window.innerHeight : 1000],
    direction === "horizontal"
      ? [offset, -maxOffset * speed]
      : [0, 0]
  );

  useEffect(() => {
    if (prefersReducedMotion.current) return;

    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return {
    y: parallaxY,
    x: parallaxX,
    scrollY: smoothScrollY,
  };
}

/**
 * Section-specific parallax with depth layers.
 */
interface ParallaxLayer {
  speed: number;
  offset: number;
  children: React.ReactNode;
  className?: string;
}

interface MultiLayerParallaxProps {
  layers: ParallaxLayer[];
  className?: string;
}

export function MultiLayerParallax({ layers, className = "" }: MultiLayerParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId: number | null = null;

    const updateProgress = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Calculate progress as element enters and leaves viewport
      const start = viewportHeight;
      const end = -elementHeight;
      const progress = 1 - (elementTop - end) / (start - end);

      setScrollProgress(Math.min(1, Math.max(0, progress)));

      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {layers.map((layer, index) => {
        const offset = scrollProgress * layer.speed * 100;
        return (
          <div
            key={index}
            className={`absolute inset-0 ${layer.className || ""}`}
            style={{
              transform: `translateY(${layer.offset - offset}px)`,
              willChange: "transform",
            }}
          >
            {layer.children}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Scroll progress hook for triggering animations.
 */
export function useScrollProgress(options: { threshold?: number; rootMargin?: string } = {}) {
  const { threshold = 0, rootMargin = "0px" } = options;
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      setProgress(1);
      return;
    }

    let rafId: number | null = null;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Progress from 0 (element enters) to 1 (element leaves)
      const visibleTop = Math.max(0, -rect.top);
      const totalTravel = viewportHeight + rect.height;
      const currentProgress = Math.min(1, Math.max(0, visibleTop / totalTravel));

      setProgress(currentProgress);
      setIsInView(rect.top < viewportHeight && rect.bottom > 0);

      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return { ref, progress, isInView };
}

/**
 * Direction-aware scroll reveal.
 */
export function useDirectionalReveal() {
  const ref = useRef<HTMLElement>(null);
  const [revealDirection, setRevealDirection] = useState<"up" | "down" | "left" | "right" | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setRevealDirection("up");
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;

      if (Math.abs(deltaY) > 5) {
        setRevealDirection(deltaY > 0 ? "down" : "up");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { ref, revealDirection };
}
