import React, { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import gsap from "gsap";
import { vec2, type Vector2 } from "vecteur";

interface MagneticCursorProps {
  children: ReactNode;
  magneticFactor?: number;
  lerpAmount?: number;
  hoverPadding?: number;
  hoverAttribute?: string;
  cursorSize?: number;
  cursorColor?: string;
  blendMode?: "difference" | "exclusion" | "normal" | "screen" | "overlay";
  cursorClassName?: string;
  shape?: "circle" | "square" | "rounded-square";
  disableOnTouch?: boolean;
  speedMultiplier?: number;
  maxScaleX?: number;
  maxScaleY?: number;
  contrastBoost?: number;
}

interface CursorState {
  el: HTMLDivElement | null;
  pos: { current: Vector2; target: Vector2; previous: Vector2 };
  hover: { isHovered: boolean };
  isDetaching: boolean;
}

export const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  magneticFactor = 0.2,
  hoverPadding = 12,
  hoverAttribute = "data-magnetic",
  cursorSize = 24,
  cursorColor = "white",
  blendMode = "exclusion",
  cursorClassName = "",
  shape = "circle",
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorStateRef = useRef<CursorState | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const configRef = useRef({
    magneticFactor,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
    cursorSize,
    lerpAmount,
    hoverPadding,
  });

  useEffect(() => {
    configRef.current = {
      magneticFactor,
      speedMultiplier,
      maxScaleX,
      maxScaleY,
      cursorSize,
      lerpAmount,
      hoverPadding,
    };
  }, [magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding]);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (disableOnTouch && isTouchDevice) return;
    const cursorEl = cursorRef.current;
    document.documentElement.classList.add("magnetic-cursor-enabled");
    if (!cursorEl) return;

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50 });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const detachDuration = reducedMotion ? 0.1 : 0.35;

    const state: CursorState = cursorStateRef.current ?? {
      el: cursorEl,
      pos: {
        current: vec2(-100, -100),
        target: vec2(-100, -100),
        previous: vec2(-100, -100),
      },
      hover: { isHovered: false },
      isDetaching: false,
    };
    cursorStateRef.current = state;

    const update = () => {
      if (state.hover.isHovered) return;
      const { speedMultiplier: speed, maxScaleX: maxX, maxScaleY: maxY, lerpAmount: lerp } = configRef.current;
      state.pos.current.lerp(state.pos.target, reducedMotion ? 1 : lerp);
      const delta = state.pos.current.clone().sub(state.pos.previous);
      state.pos.previous.copy(state.pos.current);
      if (state.isDetaching) {
        gsap.set(cursorEl, { x: state.pos.current.x, y: state.pos.current.y, scaleX: 1, scaleY: 1, rotate: 0, overwrite: "auto" });
        return;
      }
      const velocity = Math.hypot(delta.x, delta.y) * speed;
      gsap.set(cursorEl, {
        x: state.pos.current.x,
        y: state.pos.current.y,
        rotate: Math.atan2(delta.y, delta.x) * (180 / Math.PI),
        scaleX: 1 + Math.min(velocity, maxX),
        scaleY: 1 - Math.min(velocity, maxY),
        overwrite: "auto",
      });
    };

    const initializePosition = (event: PointerEvent) => {
      state.pos.current.x = event.clientX;
      state.pos.current.y = event.clientY;
      state.pos.target.x = event.clientX;
      state.pos.target.y = event.clientY;
      state.pos.previous.x = event.clientX;
      state.pos.previous.y = event.clientY;
      gsap.set(cursorEl, { x: event.clientX, y: event.clientY, opacity: 1 });
    };

    const onPointerMove = (event: PointerEvent) => {
      state.pos.target.x = event.clientX;
      state.pos.target.y = event.clientY;
      gsap.to(cursorEl, {
        opacity: event.clientX >= 0 && event.clientX <= window.innerWidth && event.clientY >= 0 && event.clientY <= window.innerHeight ? 1 : 0,
        duration: 0.2,
        overwrite: "auto",
      });
      const target = event.target as HTMLElement | null;
      if (target && ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6"].includes(target.tagName) && !state.hover.isHovered && !state.isDetaching) {
        gsap.to(cursorEl, { scaleX: 0.5, scaleY: 1.5, duration: 0.3, overwrite: "auto" });
      }
    };

    const handleMouseLeave = () => gsap.to(cursorEl, { opacity: 0, duration: 0.3 });
    const handleMouseEnter = () => gsap.to(cursorEl, { opacity: 1, duration: 0.3 });
    const cleanupFunctions: Array<() => void> = [];

    gsap.ticker.add(update);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointermove", initializePosition, { once: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const magneticElements = gsap.utils.toArray<HTMLElement>(`[${hoverAttribute}]`);
    magneticElements.forEach((element) => {
      const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
      let rafId: number | null = null;

      const handlePointerEnter = () => {
        const { magneticFactor: factor, hoverPadding: padding } = configRef.current;
        state.hover.isHovered = true;
        state.isDetaching = false;
        const bounds = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
          width: bounds.width + padding * (1 + factor) * 2,
          height: bounds.height + padding * (1 + factor) * 2,
          borderRadius: computedStyle.borderRadius,
          backgroundColor: element.getAttribute("data-magnetic-color") || cursorColor,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          duration: 0.3,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const handlePointerLeave = () => {
        const currentX = gsap.getProperty(cursorEl, "x") as number;
        const currentY = gsap.getProperty(cursorEl, "y") as number;
        state.pos.current.x = currentX;
        state.pos.current.y = currentY;
        state.pos.previous.x = currentX;
        state.pos.previous.y = currentY;
        state.hover.isHovered = false;
        state.isDetaching = true;
        const borderRadius = shape === "circle" ? "50%" : shape === "square" ? "0" : "8px";
        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          width: cursorSize,
          height: cursorSize,
          borderRadius,
          backgroundColor: cursorColor,
          scaleX: 1,
          scaleY: 1,
          duration: detachDuration,
          ease: "power3.out",
          overwrite: true,
          onComplete: () => { state.isDetaching = false; },
        });
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
          const bounds = element.getBoundingClientRect();
          const { magneticFactor: factor } = configRef.current;
          xTo((event.clientX - (bounds.left + bounds.width / 2)) * factor);
          yTo((event.clientY - (bounds.top + bounds.height / 2)) * factor);
          rafId = null;
        });
      };

      const resetElement = () => { xTo(0); yTo(0); };
      element.addEventListener("pointerenter", handlePointerEnter);
      element.addEventListener("pointerleave", handlePointerLeave);
      element.addEventListener("pointermove", handlePointerMove);
      element.addEventListener("pointerout", resetElement);
      cleanupFunctions.push(() => {
        element.removeEventListener("pointerenter", handlePointerEnter);
        element.removeEventListener("pointerleave", handlePointerLeave);
        element.removeEventListener("pointermove", handlePointerMove);
        element.removeEventListener("pointerout", resetElement);
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        xTo(0);
        yTo(0);
      });
    });

    return () => {
      document.documentElement.classList.remove("magnetic-cursor-enabled");
      gsap.ticker.remove(update);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [disableOnTouch, isTouchDevice, hoverAttribute, cursorColor, cursorSize, shape]);

  if (disableOnTouch && isTouchDevice) return <>{children}</>;

  const shapeBorderRadius = shape === "circle" ? "50%" : shape === "square" ? "0" : "8px";
  const styles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: "none",
    willChange: "transform, width, height, border-radius",
    backgroundColor: cursorColor,
    mixBlendMode: blendMode,
    width: cursorSize,
    height: cursorSize,
    borderRadius: shapeBorderRadius,
    backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none",
    WebkitBackdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none",
  };

  return (
    <>
      <div ref={cursorRef} className={`magnetic-cursor ${cursorClassName}`} style={styles} aria-hidden="true" />
      {children}
    </>
  );
};
