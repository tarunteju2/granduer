import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/data/content";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * FAQ — hairline accordion (DESIGN.md directive 5).
 * 1px rules between rows, monospace Q-index (terracotta when open),
 * Outfit bone questions, chevron rotating 0 -> 45deg, one row open at a time.
 *
 * The disclosure animates transform/opacity only: the answer is measured once
 * (ref + offsetHeight) and that static value is applied as the clipping
 * wrapper's height, while the inner block slides in via translateY(-100% -> 0).
 * No height/width values ever appear in an animate/transition prop.
 */

function FaqAnswer({
  isOpen,
  reduced,
  answerId,
  buttonId,
  children,
}: {
  isOpen: boolean;
  reduced: boolean;
  answerId: string;
  buttonId: string;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const measure = () => setContentHeight(contentRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

  return (
    <div
      id={answerId}
      role="region"
      aria-labelledby={buttonId}
      className="overflow-hidden"
      style={{ height: isOpen ? contentHeight : 0 }}
      aria-hidden={!isOpen}
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            initial={{ y: reduced ? 0 : "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section id="faq" className="section-chapter relative overflow-hidden">
      <div className="shell">
        <div className="editorial-rule mb-20" />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL_VIEWPORT}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="mb-8 font-mono text-[10px] uppercase tracking-[0.35em] text-[#849093]"
        >
          Inquiries & Standards
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL_VIEWPORT}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="text-display-2 max-w-2xl font-legacy-serif font-light leading-[1.02] tracking-[-0.03em] text-[#f5f1e9]"
        >
          Asked, <em className="font-normal italic text-[#e2a891]">answered.</em>
        </motion.h2>

        <div className="mt-16">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;

            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL_VIEWPORT}
                transition={{ delay: reduced ? 0 : index * 0.12, duration: 0.7, ease: EASE_OUT }}
                className="border-t border-[rgba(245,241,233,0.12)] last:border-b"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group flex w-full items-center justify-between gap-8 py-6 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
                >
                  <span className="flex items-baseline gap-4 sm:gap-6">
                    <span
                      className={cn(
                        "font-mono text-[11px] tracking-[0.1em] transition-colors duration-300",
                        isOpen ? "text-[#e2a891]" : "text-[#849093]",
                      )}
                    >
                      Q.{String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[15px] font-medium leading-[1.5] transition-colors duration-200 sm:text-[17px]",
                        isOpen ? "text-[#f5f1e9]" : "text-[#f5f1e9]/80 group-hover:text-[#f5f1e9]",
                      )}
                    >
                      {item.question}
                    </span>
                  </span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className={cn(
                      "shrink-0 transition-colors duration-200",
                      isOpen ? "text-[#e2a891]" : "text-[#849093] group-hover:text-[#f5f1e9]",
                    )}
                  >
                    <ChevronDown size={16} strokeWidth={1.4} />
                  </motion.span>
                </button>

                <FaqAnswer
                  isOpen={isOpen}
                  reduced={!!reduced}
                  answerId={answerId}
                  buttonId={buttonId}
                >
                  <p className="max-w-3xl pb-7 pl-8 pr-8 text-[13px] font-light leading-[1.9] text-[#849093] sm:pl-[55px]">
                    {item.answer}
                  </p>
                </FaqAnswer>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
