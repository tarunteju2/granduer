import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EMPLOYEE_PROCESS } from "@/data/content";
import { REVEAL_VIEWPORT, revealContainer, revealItem } from "@/lib/motion";

export default function Process() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 35%"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="section-chapter relative overflow-hidden">
      <div className="shell">
        <div className="editorial-rule mb-20" />
        <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24 lg:items-start">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.p
              variants={revealItem(Boolean(reduced))}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              className="editorial-label mb-8"
            >
              How we work
            </motion.p>
            <motion.h2
              variants={revealItem(Boolean(reduced))}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: reduced ? 0 : 0.1 }}
              className="text-display-2 max-w-xl font-serif font-light leading-[.92] tracking-[-.05em] text-[#f5f1e9]"
            >
              Quality
              <br />
              <em className="font-normal italic text-[#e2a891]">assured.</em>
            </motion.h2>
            <motion.p
              variants={revealItem(Boolean(reduced))}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: reduced ? 0 : 0.2 }}
              className="mt-8 max-w-md text-[15px] leading-[1.9] text-[#849093]"
            >
              Every professional on our active roster passes a rigorous vetting, training, and evaluation protocol before representing your establishment.
            </motion.p>
          </div>

          <div ref={railRef} className="relative pl-10 sm:pl-14">
            <div className="absolute bottom-0 left-[11px] top-0 w-px border-l border-dashed border-[rgba(245,241,233,0.2)]" aria-hidden="true" />
            <motion.div
              className="absolute left-[11px] top-0 w-px origin-top bg-[#e2a891]"
              style={{ scaleY: reduced ? 0 : railScale, height: "100%" }}
              aria-hidden="true"
            />
            <motion.div
              variants={revealContainer(Boolean(reduced), 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              className="space-y-0"
            >
              {EMPLOYEE_PROCESS.map((step, index) => (
                <motion.article
                  key={step.title}
                  variants={revealItem(Boolean(reduced))}
                  className="relative border-b border-[rgba(245,241,233,0.12)] py-8 first:pt-0 last:border-b-0"
                >
                  <span className="absolute -left-[3.05rem] top-8 flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(245,241,233,0.32)] bg-[#151b1d] font-mono text-[10px] text-[#f5f1e9] first:top-0 sm:-left-[4.05rem]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-[22px] font-light leading-tight text-[#f5f1e9]">{step.title}</h3>
                  <p className="mt-3 max-w-2xl text-[14px] leading-[1.8] text-[#849093]">{step.summary}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
