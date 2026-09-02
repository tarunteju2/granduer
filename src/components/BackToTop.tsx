import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <MagneticButton strength={0.3}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-[#090b10]/90 backdrop-blur-md text-neutral-400 hover:text-gold-300 hover:border-gold-400/50 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.5)] cursor-pointer"
              aria-label="Back to top of page"
            >
              <ArrowUp size={15} strokeWidth={1.75} />
            </button>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

