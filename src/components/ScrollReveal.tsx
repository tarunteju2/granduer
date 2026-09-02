import { useEffect, useRef, useState, useCallback, type CSSProperties, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  as?: "div" | "article" | "section" | "li" | "span" | "p" | "h2" | "h3" | "h4";
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "blur";
  distance?: number;
}

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  containerRef?: React.RefObject<HTMLElement>;
}

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  animation?: ScrollRevealProps["animation"];
}

/**
 * Enhanced scroll reveal with multiple animation types.
 * Respects reduced-motion preferences.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
  rootMargin = "0px 0px -8% 0px",
  as: Component = "div",
  animation = "slide-up",
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const getAnimationStyles = (): CSSProperties => {
    const base: CSSProperties = {
      transitionDelay: `${delay}ms`,
    };

    if (revealed) {
      return base;
    }

    switch (animation) {
      case "fade":
        return { ...base, opacity: 0 };
      case "slide-up":
        return { ...base, opacity: 0, transform: `translateY(${distance}px)` };
      case "slide-down":
        return { ...base, opacity: 0, transform: `translateY(-${distance}px)` };
      case "slide-left":
        return { ...base, opacity: 0, transform: `translateX(${distance}px)` };
      case "slide-right":
        return { ...base, opacity: 0, transform: `translateX(-${distance}px)` };
      case "scale":
        return { ...base, opacity: 0, transform: "scale(0.92)" };
      case "blur":
        return { ...base, opacity: 0, filter: "blur(12px)" };
      default:
        return { ...base, opacity: 0, transform: `translateY(${distance}px)` };
    }
  };

  const revealedStyles = revealed ? { opacity: 1, transform: "translate(0) scale(1)", filter: "blur(0px)" } : {};

  return (
    <Component
      ref={ref as never}
      className={`scroll-reveal ${className}`}
      style={{
        ...getAnimationStyles(),
        ...revealedStyles,
        transition: revealed
          ? `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
          : undefined,
        willChange: revealed ? "auto" : "transform, opacity, filter",
      }}
      data-revealed={revealed}
    >
      {children}
    </Component>
  );
}

/**
 * Multi-layer parallax effect component.
 * Uses framer-motion for smooth performance.
 */
export function ParallaxLayer({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
  containerRef,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const target = containerRef?.current || element.parentElement;
    if (!target) return;

    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distanceFromCenter = elementCenter - viewportCenter;
        const normalizedPosition = distanceFromCenter / viewportHeight;

        let transformValue = 0;
        switch (direction) {
          case "up":
            transformValue = normalizedPosition * speed * 100;
            break;
          case "down":
            transformValue = -normalizedPosition * speed * 100;
            break;
          case "left":
            transformValue = normalizedPosition * speed * 100;
            break;
          case "right":
            transformValue = -normalizedPosition * speed * 100;
            break;
        }

        switch (direction) {
          case "up":
          case "down":
            element.style.transform = `translateY(${transformValue}px)`;
            break;
          case "left":
          case "right":
            element.style.transform = `translateX(${transformValue}px)`;
            break;
        }

        rafId = null;
        lastScrollY = window.scrollY;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [speed, direction, containerRef, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggered reveal for lists of items.
 */
export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 80,
  animation = "slide-up",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>("[data-stagger-item]");
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("stagger-revealed");
              }, prefersReducedMotion ? 0 : index * staggerDelay);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [staggerDelay, prefersReducedMotion]);

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={`stagger-container ${className}`}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          data-stagger-item
          className="stagger-item"
          style={{
            opacity: prefersReducedMotion ? 1 : 0,
            transform: prefersReducedMotion
              ? "none"
              : animation === "slide-up"
              ? "translateY(30px)"
              : animation === "scale"
              ? "scale(0.92)"
              : "translateY(30px)",
            transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * Progress-linked reveal - elements reveal based on scroll progress.
 */
export function ProgressReveal({
  children,
  className = "",
  start = 0,
  end = 1,
}: {
  children: ReactNode;
  className?: string;
  start?: number;
  end?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    let rafId: number | null = null;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementVisible = viewportHeight - elementTop;
      const progress = Math.min(1, Math.max(0, elementVisible / (viewportHeight + rect.height)));

      const mappedProgress = (progress - start) / (end - start);
      const clampedProgress = Math.min(1, Math.max(0, mappedProgress));

      element.style.setProperty("--reveal-progress", String(clampedProgress));
      element.style.opacity = String(clampedProgress);
      element.style.transform = `translateY(${(1 - clampedProgress) * 30}px)`;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [start, end, prefersReducedMotion]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
