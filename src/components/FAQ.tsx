import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "@/data/content";
import TextReveal, { RevealLine } from "@/components/TextReveal";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-chapter relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="editorial-label mb-8"
        >
          Inquiries & Standards
        </motion.p>

        <TextReveal delay={0.1}>
          <h2 className="max-w-2xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-none uppercase tracking-tight">
            <RevealLine>Frequently Asked</RevealLine>
            <RevealLine isGold className="mt-1">
              Questions
            </RevealLine>
          </h2>
        </TextReveal>

        <div className="mt-16 divide-y divide-white/8 border-y border-white/8">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;

            return (
              <div key={item.question} className="py-5">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-8 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400/70"
                >
                  <span className="font-serif text-xl font-light text-white/85 uppercase tracking-wide">
                    {item.question}
                  </span>
                  <span className="text-gold-400/70">
                    {isOpen ? <Minus size={18} strokeWidth={1.4} /> : <Plus size={18} strokeWidth={1.4} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-5 max-w-3xl text-[14px] text-white/42 leading-[1.9] font-light">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
