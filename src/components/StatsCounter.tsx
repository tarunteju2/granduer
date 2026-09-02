import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  suffix: string;
  label: string;
  descriptor: string;
}

const STATS: Stat[] = [
  { value: 40, suffix: "+", label: "Years of Excellence", descriptor: "Founded 1985 in NYC" },
  { value: 10000, suffix: "+", label: "Events Staffed", descriptor: "Galas, Weddings & Summits" },
  { value: 50000, suffix: "+", label: "Staff Deployed", descriptor: "Vetted Captains & Servers" },
  { value: 98, suffix: "%", label: "Client Retention", descriptor: "Institutional Loyalty" },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

function StatItem({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: stat.value,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.floor(obj.val));
      },
    });

    return () => {
      tween.kill();
    };
  }, [isVisible, stat.value]);

  return (
    <div className="group px-4 text-left lg:text-center">
      <p className="font-serif text-[clamp(2.6rem,5.5vw,4.6rem)] font-light text-white leading-none tracking-tight">
        {stat.value >= 1000 ? formatNumber(count) : count}
        <span className="text-gold-400 font-normal ml-0.5">{stat.suffix}</span>
      </p>
      <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-champagne-300/90 font-medium">
        {stat.label}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-neutral-400 font-light">
        {stat.descriptor}
      </p>
    </div>
  );
}

export default function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => setIsVisible(true),
    });

    return () => st.kill();
  }, []);

  return (
    <section className="section-chapter relative py-28 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div
          ref={containerRef}
          className="grid grid-cols-2 gap-y-12 border-y border-white/[0.12] py-14 px-2 lg:grid-cols-4 lg:py-18"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={
                i < STATS.length - 1
                  ? "lg:border-r lg:border-white/[0.08]"
                  : ""
              }
            >
              <StatItem stat={stat} isVisible={isVisible} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

