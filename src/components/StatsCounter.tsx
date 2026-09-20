import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { COMPANY } from "@/data/content";
import { REVEAL_VIEWPORT, revealItem } from "@/lib/motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  descriptor: string;
}

const STATS: Stat[] = [
  { value: new Date().getFullYear() - COMPANY.founded, suffix: "+", label: "Years in service", descriptor: `Since ${COMPANY.founded}` },
  { value: COMPANY.regions.length, suffix: "", label: "Coverage regions", descriptor: COMPANY.regions.join(" · ") },
  { value: Number.parseInt(COMPANY.growthRate, 10), suffix: "%+", label: "Annual growth", descriptor: "Average annual rate" },
  { value: COMPANY.founded, suffix: "", label: "One standard", descriptor: "House-led service" },
];

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? stat.value : 0);

  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      setCount(stat.value);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [isInView, reduced, stat.value]);

  return (
    <motion.div
      ref={ref}
      variants={revealItem(Boolean(reduced))}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      transition={{ delay: reduced ? 0 : 0.08 + index * 0.1 }}
      className="px-4 py-2 text-left lg:text-center"
    >
      <p className="font-serif text-[clamp(3.75rem,6vw,4.75rem)] font-light leading-none tracking-[-.06em] tabular-nums text-[#f5f1e9]">
        {count.toLocaleString()}
        <span className="ml-1 text-[#e2a891]">{stat.suffix}</span>
      </p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[.2em] text-[#f5f1e9]">{stat.label}</p>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[.14em] text-[#849093]">{stat.descriptor}</p>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="section-chapter relative overflow-hidden">
      <div className="shell">
        <div className="grid grid-cols-1 border-y border-[rgba(245,241,233,0.12)] py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="border-b border-[rgba(245,241,233,0.12)] py-5 last:border-b-0 sm:nth-[2n]:border-b-0 lg:border-b-0 lg:border-r lg:py-2 lg:last:border-r-0">
              <StatItem stat={stat} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
