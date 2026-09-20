import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TransitionType = "fade" | "slide" | "blur" | "scale" | "wipe";

interface PageTransitionOptions {
  type?: TransitionType;
  duration?: number;
  easing?: [number, number, number, number];
}

interface TransitionState {
  isTransitioning: boolean;
  progress: number;
  direction: "in" | "out";
}

/**
 * Hook for smooth page/section transitions using framer-motion.
 * Uses AnimatePresence for enter/exit animations.
 */
export function usePageTransitions(options: PageTransitionOptions = {}) {
  const {
    type = "fade",
    duration = 0.4,
  } = options;

  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    progress: 0,
    direction: "in",
  });

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Animate transition
  const animateTransition = useCallback(
    async (direction: "in" | "out") => {
      if (prefersReducedMotion.current) {
        setState({
          isTransitioning: false,
          progress: direction === "out" ? 1 : 0,
          direction
        });
        return Promise.resolve();
      }

      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        direction,
        progress: direction === "out" ? 0 : 1
      }));

      // Wait for animation to complete
      await new Promise<void>((resolve) => {
        setTimeout(resolve, duration * 1000);
      });

      setState((prev) => ({
        ...prev,
        isTransitioning: false,
        progress: direction === "out" ? 1 : 0
      }));
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

  // Get variant based on transition type
  const getVariant = useCallback(
    (direction: "in" | "out") => {
      switch (type) {
        case "fade":
          return {
            initial: { opacity: direction === "out" ? 1 : 0 },
            animate: { opacity: direction === "out" ? 0 : 1 },
          };
        case "slide":
          return {
            initial: { opacity: direction === "out" ? 1 : 0, y: direction === "out" ? 0 : 30 },
            animate: { opacity: direction === "out" ? 0 : 1, y: direction === "out" ? -30 : 0 },
          };
        case "blur":
          return {
            initial: { opacity: direction === "out" ? 1 : 0, filter: direction === "out" ? "blur(0px)" : "blur(12px)" },
            animate: { opacity: direction === "out" ? 0 : 1, filter: direction === "out" ? "blur(12px)" : "blur(0px)" },
          };
        case "scale":
          return {
            initial: { opacity: direction === "out" ? 1 : 0, scale: direction === "out" ? 1 : 0.92 },
            animate: { opacity: direction === "out" ? 0 : 1, scale: direction === "out" ? 0.92 : 1 },
          };
        case "wipe":
          return {
            initial: {
              clipPath: direction === "out" ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)"
            },
            animate: {
              clipPath: direction === "out" ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)"
            },
          };
        default:
          return {
            initial: { opacity: direction === "out" ? 1 : 0 },
            animate: { opacity: direction === "out" ? 0 : 1 },
          };
      }
    },
    [type]
  );

  // Apply transition styles
  const getTransitionStyle = useCallback(
    (elementStyle: React.CSSProperties = {}): React.CSSProperties => {
      if (prefersReducedMotion.current) return elementStyle;

      return elementStyle;
    },
    []
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
      if (
        typeof document.startViewTransition === "function" &&
        !prefersReducedMotion.current
      ) {
        document.startViewTransition(() => {
          section.scrollIntoView({ behavior: "instant", block: "start" });
        });
      } else {
        // Fallback: smooth scroll
        section.scrollIntoView({
          behavior: prefersReducedMotion.current ? "auto" : "smooth",
          block: "start"
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return {
    state,
    transitionTo,
    getTransitionStyle,
    animateTransition,
    getVariant,
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
}

export function SectionTransition({
  children,
  className = "",
  id,
  isActive = true,
}: SectionTransitionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        },
      }}
      data-active={isActive}
    >
      {children}
    </motion.section>
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

/**
 * AnimatePresence wrapper for page-level transitions
 */
export function PageTransition({
  children,
  mode = "wait",
}: {
  children: React.ReactNode;
  mode?: "wait" | "popLayout" | "sync";
}) {
  return (
    <AnimatePresence mode={mode}>
      {children}
    </AnimatePresence>
  );
}
