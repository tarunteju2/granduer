import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Phone, X } from "lucide-react";

export default function EmergencyStaffingCTA() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ delay: 3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm z-50"
        >
          <div className="relative border border-gold-400/35 bg-neutral-900/94 backdrop-blur-sm p-6 shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
            {/* Dismiss */}
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                setTimeout(() => setDismissed(true), 500);
              }}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center text-white/45 hover:text-white/80 transition-colors"
              aria-label="Dismiss emergency staffing notice"
            >
              <X size={14} strokeWidth={1.5} />
            </button>

            {/* Status icon */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-3 w-3 rounded-full border border-gold-400/60 bg-gold-400/80" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400/85 font-medium">
                Last-Minute Staffing
              </span>
            </div>

            <h3 className="font-serif text-xl font-light uppercase tracking-wider text-white/95 mb-2">
              Need Staff Today?
            </h3>
            <p className="text-[13px] text-white/72 font-light leading-relaxed mb-5">
              Emergency staffing available within hours. Call now for immediate
              placement.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="tel:18006730010"
                className="inline-flex items-center gap-2 border border-gold-400/45 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400/95 hover:bg-gold-400 hover:text-black transition-all duration-500"
              >
                <Phone size={12} strokeWidth={1.5} />
                Call Now
              </a>
              <a
                href="#request-staff"
                className="inline-flex items-center gap-2 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/75 hover:text-white transition-colors"
              >
                <Zap size={12} strokeWidth={1.5} />
                Rush Request
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
