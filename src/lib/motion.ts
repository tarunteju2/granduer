import type { Variants } from "framer-motion";

/**
 * Shared motion tokens (DESIGN.md): transform/opacity only, staged reveals,
 * sweep fills. Every component pulls its timings from here so the site reads
 * as one calm system.
 */

/** Editorial ease-out used for all staged reveals. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Sweep-fill ease for outline CTA overlays. */
export const EASE_SWEEP: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Reveal item token: y 24 -> 0 / 0.7s / editorial ease. Opacity-only for reduced motion. */
export const revealItem = (reduced: boolean): Variants =>
  reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE_OUT },
        },
      };

/** Reveal container token: stagger 0.12 (collapsed to 0 for reduced motion). */
export const revealContainer = (
  reduced: boolean,
  stagger = 0.12,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : stagger,
      delayChildren: reduced ? 0 : delayChildren,
    },
  },
});

/** Viewport config shared by all scroll reveals. */
export const REVEAL_VIEWPORT = { once: true, margin: "-12% 0px" } as const;
