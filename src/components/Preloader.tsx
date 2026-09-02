import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "GRANDEUR".split("");

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.floor(eased * 100));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        timeoutRef.current = window.setTimeout(() => setVisible(false), 350);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col">
          {/* Top Curtain */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="flex-1 bg-[#08080a] border-b border-gold-400/20"
          />

          {/* Center Brand Overlay */}
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="flex items-center gap-2 overflow-hidden py-2">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    delay: 0.1 + i * 0.05,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-serif text-4xl sm:text-5xl font-light tracking-[0.25em] text-white"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-2 text-[10px] uppercase tracking-[0.35em] text-champagne-300/80 font-medium"
            >
              Hospitality Staffing · Est. 1985
            </motion.p>

            <div className="mt-10 w-48">
              <div className="h-[2px] w-full bg-white/[0.08] overflow-hidden rounded-full">
                <motion.div
                  className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-400 via-champagne-300 to-gold-500"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] tabular-nums tracking-[0.25em] text-neutral-400 font-mono">
                <span>NEW YORK</span>
                <span>{progress}%</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom Curtain */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="flex-1 bg-[#08080a] border-t border-gold-400/20"
          />
        </div>
      )}
    </AnimatePresence>
  );
}

