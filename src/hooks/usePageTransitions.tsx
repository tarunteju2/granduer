import { useEffect, useRef, useState, useCallback } from "react";

type TransitionType = "fade" | "slide" | "blur" | "scale" | "wipe";

interface PageTransitionOptions {
  type?: TransitionType;
  duration?: number;
  easing?: string;
}

interface TransitionState {
  isTransitioning: boolean;
  progress: number;
  direction: "in" | "out";
}

/**
 * Hook for smooth page/section transitions.
 * Uses View Transitions API where available with fallbacks.
 */
export function usePageTransitions(options: PageTransitionOptions = {}) {
  const { type = "fade", duration = 400, easing = "cubic-bezier(0.16, 1, 0.3, 1)" } = options;
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    progress: 0,
    direction: "in",
  });
  const transitionRef = useRef<{
    startTime: number;
    rafId: number | null;
    resolve: (() => void) | null;
  }>({
    startTime: 0,
    rafId: null,
    resolve: null,
  });

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Animate transition
  const animateTransition = useCallback(
    (direction: "in" | "out") => {
      if (prefersReducedMotion.current) {
        setState({ isTransitioning: false, progress: direction === "out" ? 1 : 0, direction });
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        setState((prev) => ({ ...prev, isTransitioning: true, direction, progress: direction === "out" ? 0 : 1 }));
        transitionRef.current.resolve = resolve;
        transitionRef.current.startTime = performance.now();

        const animate = (timestamp: number) => {
          const elapsed = timestamp - transitionRef.current.startTime;
          const rawProgress = Math.min(elapsed / duration, 1);

          // Ease function
          const easedProgress = direction === "out" ? 1 - rawProgress : rawProgress;

          setState((prev) => ({
            ...prev,
            progress: easedProgress,
          }));

          if (rawProgress < 1) {
            transitionRef.current.rafId = requestAnimationFrame(animate);
          } else {
            setState((prev) => ({ ...prev, isTransitioning: false }));
            if (transitionRef.current.resolve) {
              transitionRef.current.resolve();
              transitionRef.current.resolve = null;
            }
            resolve();
          }
        };

        if (transitionRef.current.rafId !== null) {
          cancelAnimationFrame(transitionRef.current.rafId);
        }
        transitionRef.current.rafId = requestAnimationFrame(animate);
      });
    },
    [duration]
  );

  // Transition out then in
  const transitionTo = useCallback(
    async (callback: () => void | Promise<void>) => {
      await animateTransition("out");
      await callback();
      await animateTransition("in");
    },
    [animateTransition]
  );

  // Apply CSS transition styles
  const getTransitionStyle = useCallback(
    (elementStyle: React.CSSProperties = {}): React.CSSProperties => {
      if (prefersReducedMotion.current) return elementStyle;

      const baseTransition = {
        transition: `all ${duration}ms ${easing}`,
      };

      switch (type) {
        case "fade":
          return {
            ...elementStyle,
            ...baseTransition,
            opacity: state.progress,
          };
        case "slide":
          return {
            ...elementStyle,
            ...baseTransition,
            opacity: state.progress,
            transform: `translateY(${(1 - state.progress) * 30}px)`,
          };
        case "blur":
          return {
            ...elementStyle,
            ...baseTransition,
            opacity: state.progress,
            filter: `blur(${(1 - state.progress) * 12}px)`,
          };
        case "scale":
          return {
            ...elementStyle,
            ...baseTransition,
            opacity: state.progress,
            transform: `scale(${0.92 + state.progress * 0.08})`,
          };
        case "wipe":
          return {
            ...elementStyle,
            ...baseTransition,
            opacity: 1,
            clipPath: state.direction === "out"
              ? `inset(0 ${(1 - state.progress) * 100}% 0 0)`
              : `inset(0 ${state.progress * 100}% 0 0)`,
          };
        default:
          return elementStyle;
      }
    },
    [type, duration, easing, state.progress, state.direction]
  );

  // Smooth scroll handler
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const section = document.querySelector(id);
      if (!section) return;

      e.preventDefault();

      // Check for View Transitions API
      if (typeof document.startViewTransition === "function" && !prefersReducedMotion.current) {
        document.startViewTransition(() => {
          section.scrollIntoView({ behavior: "instant", block: "start" });
        });
      } else {
        // Fallback: fade transition
        const main = document.querySelector("main");
        if (!main) {
          section.scrollIntoView({ behavior: prefersReducedMotion.current ? "auto" : "smooth", block: "start" });
          return;
        }

        main.style.transition = `opacity ${duration / 2}ms ${easing}`;
        main.style.opacity = "0";

        setTimeout(() => {
          section.scrollIntoView({ behavior: "instant", block: "start" });
          main.style.opacity = "1";
        }, duration / 2);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [duration, easing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionRef.current.rafId !== null) {
        cancelAnimationFrame(transitionRef.current.rafId);
      }
    };
  }, []);

  return {
    state,
    transitionTo,
    getTransitionStyle,
    animateTransition,
  };
}

/**
 * Section transition wrapper component
 */
interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  isActive?: boolean;
  transitionType?: TransitionType;
}

export function SectionTransition({
  children,
  className = "",
  id,
  isActive = true,
  transitionType = "fade",
}: SectionTransitionProps) {
  const { state, getTransitionStyle } = usePageTransitions({ type: transitionType });

  return (
    <section
      id={id}
      className={className}
      style={{
        ...getTransitionStyle(),
        willChange: state.isTransitioning ? "transform, opacity, filter" : "auto",
      }}
      data-active={isActive}
    >
      {children}
    </section>
  );
}

/**
 * Scroll-linked section transitions
 */
export function useScrollTransition(threshold = 0.5) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0, threshold, 1] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [threshold]);

  return activeSection;
}
