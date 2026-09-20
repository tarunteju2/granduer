import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";


interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "article" | "section" | "li" | "span" | "p" | "h2" | "h3" | "h4";
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale";
  distance?: number;
  duration?: number;
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
 * Enhanced scroll reveal with multiple animation types using framer-motion.
 * Respects reduced-motion preferences automatically.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
  animation = "slide-up",
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const isInView = useInView(ref, {
    once: REVEAL_VIEWPORT.once,
    margin: REVEAL_VIEWPORT.margin,
    amount: 0.12,
  });

  // Callers pass delay in milliseconds; framer-motion expects seconds.
  const transition = {
    delay: reduced ? 0 : delay / 1000,
    duration: 0.7,
    ease: EASE_OUT,
  };

  // Under prefers-reduced-motion every variant collapses to opacity-only.
  const getVariants = (): Variants => {
    if (reduced) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition },
      };
    }
    switch (animation) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition },
        };
      case "slide-up":
        return {
          hidden: { opacity: 0, y: distance },
          visible: { y: 0, opacity: 1, transition },
        };
      case "slide-down":
        return {
          hidden: { opacity: 0, y: -distance },
          visible: { y: 0, opacity: 1, transition },
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: distance },
          visible: { x: 0, opacity: 1, transition },
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: -distance },
          visible: { x: 0, opacity: 1, transition },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.92 },
          visible: { scale: 1, opacity: 1, transition },
        };
      default:
        return {
          hidden: { opacity: 0, y: distance },
          visible: { y: 0, opacity: 1, transition },
        };
    }
  };

  const variants = getVariants();

  if (Component === "div") {
    return (
      <motion.div
        ref={ref}
        className={`scroll-reveal ${className}`}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
        data-revealed={isInView}
      >
        {children}
      </motion.div>
    );
  }

  if (Component === "section") {
    return (
      <motion.section
        ref={ref as React.RefObject<HTMLElement>}
        className={`scroll-reveal ${className}`}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
        data-revealed={isInView}
      >
        {children}
      </motion.section>
    );
  }

  if (Component === "article") {
    return (
      <motion.article
        ref={ref as React.RefObject<HTMLElement>}
        className={`scroll-reveal ${className}`}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
        data-revealed={isInView}
      >
        {children}
      </motion.article>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`scroll-reveal ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      data-revealed={isInView}
    >
      {children}
    </motion.div>
  );
}

/**
 * Multi-layer parallax effect component using framer-motion.
 * Uses useScroll for smooth performance.
 */
export function ParallaxLayer({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
  containerRef,
}: ParallaxLayerProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const getTransform = () => {
    const transformMap = {
      up: [speed * 50, -speed * 50],
      down: [-speed * 50, speed * 50],
      left: [speed * 50, -speed * 50],
      right: [-speed * 50, speed * 50],
    };
    return transformMap[direction];
  };

  const [start, end] = getTransform();
  const yValue = useTransform(scrollYProgress, [0, 1], [start, end]);
  const xValue = useTransform(scrollYProgress, [0, 1], [start, end]);

  return (
    <motion.div
      style={{
        y: direction === "up" || direction === "down" ? yValue : undefined,
        x: direction === "left" || direction === "right" ? xValue : undefined,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered reveal for lists of items using framer-motion.
 */
export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.08,
  animation = "slide-up",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const childrenArray = Array.isArray(children) ? children : [children];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
        delayChildren: 0,
      },
    },
  };

  const getItemVariants = (): Variants => {
    if (reduced) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
      };
    }
    switch (animation) {
      case "slide-up":
        return {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.92 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
        };
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
        };
      default:
        return {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`stagger-container ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          variants={getItemVariants()}
          className="stagger-item"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

