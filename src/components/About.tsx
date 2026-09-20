import { motion } from "framer-motion";
import { ABOUT, COMPANY } from "@/data/content";
import TextReveal, { RevealLine } from "@/components/TextReveal";
import ScrollReveal from "@/components/ScrollReveal";

export default function About() {
  return (
    <section id="about" className="section-chapter relative overflow-hidden">
      <div className="shell">
        {/* Rule */}
        <div className="editorial-rule mb-24" />

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="editorial-label mb-8"
        >
          About the House
        </motion.p>

        {/* Two-column editorial layout */}
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          {/* Left - headline */}
          <div className="lg:col-span-5">
            <TextReveal delay={0.1}>
              <h2 className="text-display-2 font-serif font-light leading-none uppercase tracking-tight">
                <RevealLine>The Gold</RevealLine>
                <RevealLine>Standard</RevealLine>
                <RevealLine isGold className="mt-1">
                  Since {COMPANY.founded}
                </RevealLine>
              </h2>
            </TextReveal>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-14 flex gap-12 border-t border-white/6 pt-8"
            >
              <div>
                <p className="font-serif text-4xl font-light text-white">{COMPANY.growthRate}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/30">Annual Growth</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-light text-white">{COMPANY.regions.length}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/30">Regions</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-light text-white">{new Date().getFullYear() - COMPANY.founded}+</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/30">Years</p>
              </div>
            </motion.div>
          </div>

          {/* Right - body text */}
          <div className="lg:col-span-7 lg:pt-4">
            {ABOUT.paragraphs.map((p, i) => (
              <ScrollReveal key={i} as="section" delay={i * 90}>
                <p className="mb-8 text-[15px] text-white/40 leading-[2.0] font-light last:mb-0">
                  {p}
                </p>
              </ScrollReveal>
            ))}

            {/* Regions inline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              {COMPANY.regions.map((r) => (
                <span
                  key={r}
                  className="text-[10px] uppercase tracking-[0.3em] text-white/25 border-b border-white/6 pb-1"
                >
                  {r}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
