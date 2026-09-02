import { motion } from "framer-motion";
import { COMPANY_FACTS } from "@/data/content";
import TiltCard from "@/components/TiltCard";
import TextReveal, { RevealLine } from "@/components/TextReveal";

export default function EnterpriseProof() {
  return (
    <section className="relative overflow-hidden py-36">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="editorial-label mb-8"
            >
              The Grandeur Standard
            </motion.p>

            <TextReveal delay={0.1}>
              <h2 className="font-serif text-[clamp(2.4rem,5vw,4.3rem)] font-light leading-none uppercase tracking-tight">
                <RevealLine>How Grandeur</RevealLine>
                <RevealLine isGold className="mt-1">
                  Operates
                </RevealLine>
              </h2>
            </TextReveal>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-10 max-w-sm text-[14px] leading-[2.0] text-white/50 font-light"
            >
              A distinguished heritage of reliable execution, tailored training programs, and dedicated account management for the hospitality industry’s leading institutions.
            </motion.p>
          </div>

          <div className="grid gap-4 lg:col-span-7 lg:pt-8">
            {COMPANY_FACTS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.55 }}
              >
                <TiltCard
                  maxTilt={2.5}
                  glareOpacity={0.06}
                  scale={1.008}
                  className="luxury-card-surface px-8 py-7 rounded-sm group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-champagne-300/90 group-hover:text-gold-400 transition-colors">
                        {card.title}
                      </h3>
                      <span className="h-1 w-1 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors" />
                    </div>
                    <p className="max-w-xl text-[13px] leading-[1.9] text-white/65 font-light">
                      {card.detail}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
