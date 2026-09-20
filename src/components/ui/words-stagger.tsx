"use client";

import React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

type ElementType = "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface WordsStaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  speed?: number;
  once?: boolean;
  as?: ElementType;
}

export function WordsStagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  speed = 0.55,
  once = true,
}: WordsStaggerProps) {
  const transition: Transition = {
    type: "tween",
    ease: [0.16, 1, 0.3, 1],
    duration: speed,
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 14,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition,
    },
  };

  // Handle non-string children (elements inside)
  const stringChild = React.Children.toArray(children).find((c) => typeof c === "string") as string | undefined;
  const elementChildren = React.Children.toArray(children).filter((c) => typeof c !== "string");

  return (
    <motion.div
      className={cn("flex flex-wrap", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
    >
      {stringChild
        ? stringChild.split(" ").filter((w) => w.length > 0).map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block"
              variants={wordVariants}
            >
              {word}
              {index < stringChild.split(" ").filter((w) => w.length > 0).length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </motion.span>
          ))
        : elementChildren.map((child, index) => (
            <motion.span key={index} className="inline-block" variants={wordVariants}>
              {child}
              {index < elementChildren.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </motion.span>
          ))}
    </motion.div>
  );
}
