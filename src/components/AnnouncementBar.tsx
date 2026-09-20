import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ANNOUNCEMENTS = [
  "Hospitality staffing for NYC, New Jersey, Long Island, and South Florida",
  "Trusted since 1994 by hotels, clubs, caterers, and event teams",
  "Share your brief and receive next steps from our staffing team",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative z-[90] flex items-center justify-center bg-neutral-800/96 border-b border-white/10 px-12 py-2.5">
      <button
        onClick={() => setIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
        className="absolute left-4 text-white/45 hover:text-white/80 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
      </button>

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/72 text-center"
        >
          {ANNOUNCEMENTS[index]}
        </motion.p>
      </AnimatePresence>

      <button
        onClick={() => setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
        className="absolute right-10 text-white/45 hover:text-white/80 transition-colors"
        aria-label="Next"
      >
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 text-white/45 hover:text-white/80 transition-colors"
        aria-label="Dismiss"
      >
        <X size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
}
