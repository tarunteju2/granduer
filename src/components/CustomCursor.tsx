import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type CursorMode = "default" | "link" | "button" | "input" | "drag" | "zoom" | "text";

/**
 * Enhanced custom cursor with state changes on hover,
 * performance optimizations, and smooth animations.
 */
export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");

  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Fast spring for dot (inner cursor)
  const springDotX = useSpring(cursorX, { damping: 35, stiffness: 400, mass: 0.2 });
  const springDotY = useSpring(cursorY, { damping: 35, stiffness: 400, mass: 0.2 });

  // Slower spring for ring (outer cursor)
  const springRingX = useSpring(cursorX, { damping: 25, stiffness: 180, mass: 0.5 });
  const springRingY = useSpring(cursorY, { damping: 25, stiffness: 180, mass: 0.5 });

  // Scale and rotation for dynamic effects
  const scale = useMotionValue(1);
  const stretchX = useMotionValue(1);
  const stretchY = useMotionValue(1);
  const rotate = useMotionValue(0);
  const ringScale = useMotionValue(1);

  const springScale = useSpring(scale, { damping: 20, stiffness: 300 });
  const springStretchX = useSpring(stretchX, { damping: 22, stiffness: 250 });
  const springStretchY = useSpring(stretchY, { damping: 22, stiffness: 250 });
  const springRotate = useSpring(rotate, { damping: 28, stiffness: 200 });
  const springRingScale = useSpring(ringScale, { damping: 22, stiffness: 200 });

  // State tracking
  const lastPoint = useRef({ x: 0, y: 0, time: 0 });
  const rafRef = useRef<number | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Detect touch device
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(isCoarse);
    if (isCoarse) return;
  }, []);

  // Get mode-specific styles
  const getModeConfig = useCallback((currentMode: CursorMode) => {
    switch (currentMode) {
      case "link":
        return { dotSize: 2, ringSize: 48, ringOpacity: 0.5, ringBorder: "rgba(226, 168, 145, 0.6)", hasGlow: true, dotColor: "#e2a891" };
      case "button":
        return { dotSize: 2, ringSize: 42, ringOpacity: 0.45, ringBorder: "rgba(226, 168, 145, 0.5)", hasGlow: true, dotColor: "#e2a891" };
      case "input":
        return { dotSize: 1, ringSize: 36, ringOpacity: 0.4, ringBorder: "rgba(226, 168, 145, 0.4)", hasGlow: false, dotColor: "#e2a891" };
      case "drag":
        return { dotSize: 2, ringSize: 56, ringOpacity: 0.6, ringBorder: "rgba(226, 168, 145, 0.7)", hasGlow: true, dotColor: "#f1bba6" };
      case "zoom":
        return { dotSize: 2, ringSize: 64, ringOpacity: 0.5, ringBorder: "rgba(226, 168, 145, 0.5)", hasGlow: true, dotColor: "#e2a891" };
      case "text":
        return { dotSize: 1, ringSize: 24, ringOpacity: 0.35, ringBorder: "rgba(226, 168, 145, 0.3)", hasGlow: false, dotColor: "#e2a891" };
      default:
        return { dotSize: 4, ringSize: 28, ringOpacity: 0.35, ringBorder: "rgba(196, 163, 90, 0.25)", hasGlow: false, dotColor: "#c4a35a" };
    }
  }, []);

  const config = getModeConfig(mode);

  // Set cursor state based on element
  const setCursorState = useCallback((target: HTMLElement | null) => {
    if (!target) return;

    // Check for specific data attributes
    if (target.dataset.cursor) {
      setMode(target.dataset.cursor as CursorMode);
      scale.set(1.3);
      return;
    }

    // Check for draggable elements
    if (target.closest("[data-cursor='drag']")) {
      setMode("drag");
      scale.set(1.5);
      return;
    }

    // Check for zoom elements
    if (target.closest("[data-cursor='zoom']")) {
      setMode("zoom");
      scale.set(1.6);
      return;
    }

    // Check for links
    if (target.closest("a")) {
      setMode("link");
      scale.set(1.6);
      return;
    }

    // Check for buttons
    if (target.closest("button, [role='button'], [data-cursor='button']")) {
      setMode("button");
      scale.set(1.4);
      return;
    }

    // Check for inputs
    if (target.closest("input, textarea, select, [contenteditable='true']")) {
      setMode("input");
      scale.set(1.2);
      return;
    }

    // Check for text selection
    if (window.getSelection()?.toString()) {
      setMode("text");
      scale.set(0.9);
      return;
    }

    // Default
    setMode("default");
    scale.set(1);
  }, [scale]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);

    if (prefersReducedMotion) return;

    const now = performance.now();
    const deltaTime = Math.max(now - lastPoint.current.time, 16);
    const deltaX = e.clientX - lastPoint.current.x;
    const deltaY = e.clientY - lastPoint.current.y;
    const speed = Math.min(Math.hypot(deltaX, deltaY) / deltaTime, 2);

    // Apply stretch effect based on movement speed
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    rotate.set(angle);
    stretchX.set(1 + speed * 0.6);
    stretchY.set(1 - Math.min(speed * 0.25, 0.2));

    // Ring follows with delay
    ringScale.set(1 + speed * 0.3);

    lastPoint.current = { x: e.clientX, y: e.clientY, time: now };
    setCursorState(e.target as HTMLElement);

    if (!isVisible) {
      setIsVisible(true);
    }
  }, [cursorX, cursorY, prefersReducedMotion, rotate, stretchX, stretchY, ringScale, setCursorState, isVisible]);

  // Mouse down/up handlers
  const handleMouseDown = useCallback(() => {
    scale.set(mode === "default" ? 0.75 : 1.1);
  }, [scale, mode]);

  const handleMouseUp = useCallback(() => {
    const scales: Record<CursorMode, number> = {
      default: 1,
      link: 1.6,
      button: 1.4,
      input: 1.2,
      drag: 1.5,
      zoom: 1.6,
      text: 0.9,
    };
    scale.set(scales[mode]);
  }, [scale, mode]);

  // Reset stretch effect
  const handleMouseOut = useCallback(() => {
    if (!prefersReducedMotion) {
      stretchX.set(1);
      stretchY.set(1);
    }
  }, [prefersReducedMotion, stretchX, stretchY]);

  // Hide cursor
  const handleHide = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Event listeners
  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleHide);
    window.addEventListener("blur", handleHide);
    document.addEventListener("mouseover", (e) => setCursorState(e.target as HTMLElement));
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleHide);
      window.removeEventListener("blur", handleHide);
      document.removeEventListener("mouseover", (e) => setCursorState(e.target as HTMLElement));
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [
    isTouchDevice,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleHide,
    handleMouseOut,
    setCursorState,
  ]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot - inner cursor */}
      <motion.div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{
          x: springDotX,
          y: springDotY,
          scale: springScale,
          opacity: isVisible ? 1 : 0,
          zIndex: 9998,
          width: config.dotSize,
          height: config.dotSize,
          backgroundColor: config.dotColor,
          borderRadius: "50%",
          boxShadow: config.hasGlow
            ? "0 0 12px rgba(226, 168, 145, 0.5), 0 0 24px rgba(226, 168, 145, 0.25)"
            : "0 0 8px rgba(196, 163, 90, 0.35)",
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "screen",
        }}
        transition={{ boxShadow: { duration: 0.3 } }}
      />

      {/* Ring - outer cursor */}
      <motion.div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden md:block"
        style={{
          x: springRingX,
          y: springRingY,
          scale: mode === "drag" ? [springRingScale, springScale] : [1, springScale],
          opacity: isVisible ? config.ringOpacity : 0,
          zIndex: 9997,
          width: config.ringSize,
          height: config.ringSize,
          rotate: springRotate,
          scaleX: springStretchX,
          scaleY: springStretchY,
          borderRadius: mode === "text" ? "2px" : "999px",
          border: `1px solid ${config.ringBorder}`,
          backgroundColor:
            mode === "default" ? "transparent" : "rgba(226, 168, 145, 0.03)",
          boxShadow: config.hasGlow
            ? "0 0 20px rgba(226, 168, 145, 0.15), inset 0 0 0 1px rgba(255,255,255,0.03)"
            : "0 0 0 1px rgba(255,255,255,0.02) inset",
          translateX: "-50%",
          translateY: "-50%",
          transition: {
            opacity: { duration: 0.2 },
            border: { duration: 0.3 },
            backgroundColor: { duration: 0.3 },
            boxShadow: { duration: 0.3 },
          },
        }}
      />

      {/* Mode indicator dot for special modes */}
      {mode !== "default" && isVisible && (
        <motion.div
          className="pointer-events-none fixed z-[9999] hidden md:block"
          style={{
            x: springRingX,
            y: springRingY,
            width: 6,
            height: 6,
            backgroundColor: config.dotColor,
            borderRadius: "50%",
            translateX: "-50%",
            translateY: "-50%",
            opacity: 0.8,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      )}
    </>
  );
}
