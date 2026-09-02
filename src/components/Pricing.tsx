import { motion } from "framer-motion";
import { PRICING } from "@/data/content";
import TiltCard from "@/components/TiltCard";
import TextReveal, { RevealLine } from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";

export default function Pricing() {
  return (
    <section id="pricing" className="section-chapter relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="editorial-label mb-8"
            >
              Bespoke Proposals
            </motion.p>

            <TextReveal delay={0.1}>
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight">
                <RevealLine>Quotes Built</RevealLine>
                <RevealLine isGold className="mt-1">
                  Per Event
                </RevealLine>
              </h2>
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-8 text-[14px] text-white/50 leading-[2.0] font-light"
            >
              Grandeur tailors each engagement to the exact requirements of your venue, guest ratio, uniform standard, and culinary service timeline.
            </motion.p>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <TiltCard
              maxTilt={2.5}
              glareOpacity={0.06}
              className="luxury-card-surface p-8 lg:p-10 rounded-sm"
            >
              <div>
                <p className="text-[15px] text-white/75 leading-[2.0] font-light">
                  {PRICING.description}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {PRICING.categories.map((item) => (
                    <div
                      key={item}
                      className="border border-white/[0.07] bg-white/[0.015] p-4 rounded-sm hover:border-gold-400/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="h-1 w-1 rounded-full bg-gold-400/80" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">
                          {item}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-[13px] text-white/45 leading-[1.9] font-light border-t border-white/[0.07] pt-6">
                  {PRICING.note}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <MagneticButton strength={0.3}>
                    <a
                      href="#request-staff"
                      className="cta-premium inline-flex items-center gap-3 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.3em]"
                    >
                      Request Proposal
                    </a>
                  </MagneticButton>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-champagne-300/70">
                    Senior Account Manager Follow-Up
                  </span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}