import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  triggerHook?: string;
  as?: any;
}

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.06,
  triggerHook = "top 88%",
  as: Component = "div",
}: TextRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const targets = el.querySelectorAll(".reveal-word, .reveal-line");
    if (!targets.length) return;

    gsap.set(targets, { y: "115%", opacity: 0 });

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        y: "0%",
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        stagger: stagger,
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: triggerHook,
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, triggerHook]);

  const Comp = Component;

  return (
    <Comp ref={elRef} className={`reveal-container ${className}`}>
      {children}
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
  return (
    <span className={`block overflow-hidden pb-1 ${className}`}>
      <span
        className={`reveal-line block will-change-transform ${
          isGold ? "italic text-gold-400 font-normal" : ""
        }`}
      >
        {children}
      </span>
    </span>
  );
}
