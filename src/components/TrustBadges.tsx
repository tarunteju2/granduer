import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, FileCheck, Award, UserCheck, MapPin } from "lucide-react";

const PEDIGREE_PILLARS = [
  {
    icon: Award,
    title: "Est. 1994",
    description: "Four Decades of Distinction",
  },
  {
    icon: ShieldCheck,
    title: "Strict Discretion",
    description: "Private Estates & High-Profile Events",
  },
  {
    icon: FileCheck,
    title: "Fully Bonded & Insured",
    description: "Institutional COI Documentation",
  },
  {
    icon: UserCheck,
    title: "Vetted Professionals",
    description: "Fine Dining & Banquet Mastery",
  },
  {
    icon: MapPin,
    title: "Four Flagship Markets",
    description: "NYC · Hamptons · Palm Beach · Miami",
  },
];

export default function TrustBadges() {
  const reduced = useReducedMotion();
  return (
    <section className="relative border-y border-[rgba(245,241,233,0.12)] bg-[#151b1d] py-14">
      <div className="shell">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {PEDIGREE_PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : i * 0.08, duration: reduced ? 0 : 0.6 }}
                className="group flex flex-col items-start border-l border-white/[0.1] pl-5"
              >
                <div className="flex items-center gap-3 text-gold-400/80 mb-2.5">
                  <Icon size={15} strokeWidth={1.25} />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-champagne-300/90 font-medium">
                    {pillar.title}
                  </span>
                </div>
                <p className="text-[12px] text-white/55 font-light leading-relaxed group-hover:text-white/80 transition-colors">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
