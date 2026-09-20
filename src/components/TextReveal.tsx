import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  triggerHook?: string;
  as?: any;
}

/**
 * Text reveal component using framer-motion whileInView.
 * Animates .reveal-word and .reveal-line elements on scroll.
 */
export default function TextReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.06,
  as: Component = "div",
}: TextRevealProps) {
  const reduced = useReducedMotion();
  // Observe the real container: the motion wrapper uses display:contents, so
  // whileInView's IntersectionObserver would never see it fire.
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12%" });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delay,
      },
    },
  };

  const Comp = Component;

  return (
    <Comp ref={ref} className={`reveal-container ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ display: "contents" }}
      >
        {children}
      </motion.div>
    </Comp>
  );
}

/**
 * RevealLine - Helper component to wrap lines in an overflow-hidden mask
 */
export function RevealLine({
  children,
  className = "",
  isGold = false,
}: {
  children: ReactNode;
  className?: string;
  isGold?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-1 ${className}`}>
      <motion.span
        variants={{
          hidden: reduced ? { y: "0%", opacity: 0 } : { y: "115%", opacity: 0 },
          visible: {
            y: "0%",
            opacity: 1,
            transition: reduced
              ? { duration: 0 }
              : { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        className={`reveal-line block will-change-transform ${
          isGold ? "italic text-gold-400 font-normal" : ""
        }`}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Word-by-word reveal animation variants
 */
export const wordRevealVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const wordVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Split text into words and wrap each in a motion span for animation
 */
export function SplitWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      variants={wordRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      style={{ display: "inline" }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={wordVariants}
            style={{ display: "inline-block" }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
