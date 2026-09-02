import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded options */}
      <AnimatePresence>
        {open && (
          <>
            <motion.a
              href="https://wa.me/18006730010?text=Hi%2C%20I%20need%20staffing%20for%20an%20upcoming%20event."
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0.05, duration: 0.25 }}
              className="group flex items-center gap-3"
            >
              <span className="px-4 py-2 bg-neutral-900 border border-white/6 text-[10px] uppercase tracking-[0.2em] text-white/45 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                WhatsApp
              </span>
              <span className="flex items-center justify-center w-12 h-12 border border-green-500/30 bg-neutral-950/90 backdrop-blur-sm text-green-400/70 hover:bg-green-500 hover:text-white transition-all duration-300">
                <MessageCircle size={18} strokeWidth={1.5} />
              </span>
            </motion.a>

            <motion.a
              href="tel:18006730010"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0, duration: 0.25 }}
              className="group flex items-center gap-3"
            >
              <span className="px-4 py-2 bg-neutral-900 border border-white/6 text-[10px] uppercase tracking-[0.2em] text-white/45 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Call Us
              </span>
              <span className="flex items-center justify-center w-12 h-12 border border-gold-400/30 bg-neutral-950/90 backdrop-blur-sm text-gold-400/70 hover:bg-gold-400 hover:text-black transition-all duration-300">
                <Phone size={18} strokeWidth={1.5} />
              </span>
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center w-14 h-14 border transition-all duration-500 ${open
            ? "border-white/20 bg-white/5 rotate-0"
            : "border-gold-400/30 bg-neutral-950/90 backdrop-blur-sm"
          }`}
        aria-label={open ? "Close contact options" : "Open contact options"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} strokeWidth={1.5} className="text-white/50" />
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Phone size={20} strokeWidth={1.5} className="text-gold-400/70" />
            </motion.div>
          )}
        </AnimatePresence>

        {!open && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-gold-400/45 bg-gold-400/75" />
        )}
      </motion.button>
    </div>
  );
}
