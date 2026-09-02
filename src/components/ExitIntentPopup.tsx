import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight } from "lucide-react";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const titleId = "exit-intent-title";
  const descriptionId = "exit-intent-description";

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 5 && !dismissed && !show) {
        setShow(true);
      }
    },
    [dismissed, show]
  );

  useEffect(() => {
    // Only trigger after user has been on page 10s
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const close = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(close, 2500);
  };

  if (dismissed && !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[71] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            <div className="relative my-auto w-full max-w-md border border-white/8 bg-neutral-950 p-6 sm:p-10">
              {/* Close */}
              <button
                type="button"
                onClick={close}
                className="absolute top-4 right-4 text-white/20 hover:text-white/45 transition-colors"
                aria-label="Close popup"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <Gift
                    size={36}
                    className="mx-auto text-gold-400/50 mb-6"
                    strokeWidth={1}
                  />
                  <h3 id={titleId} className="font-serif text-2xl font-light uppercase tracking-wider mb-3">
                    You&apos;re In
                  </h3>
                  <p className="text-[13px] text-white/30 font-light">
                    Check your inbox for your exclusive offer.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <p className="editorial-label mb-6">Before You Go</p>
                    <h3 id={titleId} className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-light uppercase tracking-tight leading-[1.1]">
                      Get Your
                      <br />
                      <span className="italic text-gold-400">Staffing Plan</span>
                    </h3>
                  </div>

                  <p id={descriptionId} className="text-center text-[13px] text-white/30 font-light leading-relaxed mb-8">
                    Leave your email and we&apos;ll help coordinate a staffing plan for your event within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      aria-label="Email address"
                      className="w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-colors font-light"
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-3 border border-gold-400/30 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400/80 hover:bg-gold-400 hover:text-black transition-all duration-500"
                    >
                      Request Staff
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </button>
                  </form>

                  <p className="mt-6 text-center text-[10px] text-white/18 uppercase tracking-[0.2em]">
                    No spam &middot; Unsubscribe anytime
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
