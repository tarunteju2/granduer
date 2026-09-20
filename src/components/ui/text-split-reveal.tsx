"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextSplitRevealProps extends Omit<HTMLMotionProps<"p">, "children"> {
  children: string;
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  /** Split by word instead of character midpoint */
  splitWord?: boolean;
  /** Additional class on the inner spans */
  spanClassName?: string;
}

export function TextSplitReveal({
  children,
  className,
  spanClassName,
  duration = 0.7,
  delay = 0,
  staggerDelay = 0.12,
  splitWord = false,
  ...props
}: TextSplitRevealProps) {
  const leftHalf = splitWord ? children : children.slice(0, Math.ceil(children.length / 2));
  const rightHalf = splitWord ? "" : children.slice(Math.ceil(children.length / 2));

  return (
    <motion.p className={cn("overflow-hidden", className)} {...props}>
      <motion.span
        className={cn("inline-block", spanClassName)}
        initial={{ opacity: 0, y: 24, clipPath: "inset(0 100% 0 0)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {leftHalf}
      </motion.span>
      {rightHalf && (
        <motion.span
          className={cn("inline-block", spanClassName)}
          initial={{ opacity: 0, y: 24, clipPath: "inset(0 0 0 100%)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration, delay: delay + staggerDelay, ease: [0.16, 1, 0.3, 1] }}
        >
          {rightHalf}
        </motion.span>
      )}
    </motion.p>
  );
}
