import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";

export default function ReferralCTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative border border-gold-400/10 bg-gold-400/[0.02] p-12 lg:p-16"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold-400/20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-400/20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold-400/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold-400/20" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Gift
                  size={20}
                  className="text-gold-400/50"
                  strokeWidth={1.5}
                />
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400/50 font-medium">
                  Referral Program
                </span>
              </div>

              <h3 className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light uppercase tracking-tight leading-[1.1] mb-4">
                Refer a Client,
                <br />
                <span className="italic text-gold-400">Earn $500</span>
              </h3>

              <p className="max-w-lg text-[14px] text-white/30 leading-[1.9] font-light">
                Know a venue, hotel, or event planner who needs premium
                staffing? Refer them to Grandeur. When they book their first
                event, you receive a $500 referral bonus.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <a
                href="#contact"
                className="inline-flex items-center gap-3 border border-gold-400/30 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400/80 hover:bg-gold-400 hover:text-black transition-all duration-500"
              >
                Submit a Referral
                <ArrowRight size={14} strokeWidth={1.5} />
              </a>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                No limit on referrals
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-12 pt-10 border-t border-white/4 grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Refer", desc: "Share your contact's details with us" },
              { step: "02", title: "We Connect", desc: "Our team reaches out and provides a quote" },
              { step: "03", title: "Get Paid", desc: "Receive $500 after their first booked event" },
            ].map((item) => (
              <div key={item.step} className="text-center lg:text-left">
                <span className="text-[11px] font-medium text-gold-400/30 tabular-nums">
                  {item.step}
                </span>
                <h4 className="mt-2 font-serif text-lg font-light uppercase tracking-wider text-white/60">
                  {item.title}
                </h4>
                <p className="mt-2 text-[12px] text-white/25 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
