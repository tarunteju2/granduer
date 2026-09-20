'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SPRING_CONFIG = { damping: 15, stiffness: 150 };

type MagneticButtonProps = {
  children: React.ReactNode;
  distance?: number;
  className?: string;
};

export function MagneticButton({ children, distance = 0.4, className = "" }: MagneticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        if (isHovered) {
          x.set(distanceX * distance);
          y.set(distanceY * distance);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    document.addEventListener('mousemove', calculateDistance);

    return () => {
      document.removeEventListener('mousemove', calculateDistance);
    };
  }, [ref, isHovered, x, y, distance]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedArrow - An arrow that animates on hover
 */
export function AnimatedArrow({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      className={className}
      initial={{ x: 0, y: 0 }}
      whileHover={{ x: 3, y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <path
        d="M3.5 11.5L11.5 3.5M11.5 3.5H5.5M11.5 3.5V9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/**
 * AnimatedIconButton - A button with animated icon that responds to hover
 */
export function AnimatedIconButton({
  children,
  className = "",
  href,
  label,
  variant = "default"
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 12, stiffness: 180 });
  const springY = useSpring(y, { damping: 12, stiffness: 180 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      if (isHovered) {
        x.set((e.clientX - centerX) * 0.15);
        y.set((e.clientY - centerY) * 0.15);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, x, y]);

  const baseStyles = "relative flex items-center justify-center h-11 w-11 transition-all duration-500";

  const variantStyles = {
    default: "border border-white/15 text-white/50 hover:border-[#e2a891]/70 hover:bg-[#e2a891] hover:text-[#101416]",
    outline: "border border-[#e2a891]/40 text-[#f1bba6] hover:border-[#e2a891] hover:bg-[#e2a891] hover:text-[#101416]",
    ghost: "text-white/50 hover:text-white hover:bg-white/5"
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ x: springX, y: springY }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );

  if (href) {
    return <a href={href} aria-label={label}>{content}</a>;
  }

  return content;
}

/**
 * MagneticLink - A link with magnetic hover effect
 */
export function MagneticLink({
  children,
  href = "#",
  className = ""
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 15, stiffness: 200 });
  const springY = useSpring(y, { damping: 15, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      if (isHovered) {
        x.set((e.clientX - centerX) * 0.2);
        y.set((e.clientY - centerY) * 0.2);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/**
 * IconWithGlow - An icon that glows on hover
 */
export function IconWithGlow({
  children,
  className = "",
  glowColor = "#e2a891"
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`relative ${className}`}
    >
      <motion.div
        className="absolute inset-0 rounded-full blur-md opacity-0 transition-opacity duration-500"
        style={{ backgroundColor: glowColor }}
        whileHover={{ opacity: 0.4 }}
      />
      {children}
    </motion.div>
  );
}
