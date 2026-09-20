import { motion, useReducedMotion } from "framer-motion";
import AmbientHeroAccent from "@/components/AmbientHeroAccent";
import SweepCta from "@/components/ui/sweep-cta";
import { EASE_OUT, revealContainer, revealItem } from "@/lib/motion";

/**
 * Hero — asymmetric editorial split (DESIGN.md directive 1).
 * Left: bone Fraunces display with one italic emphasis word.
 * Right: ~300px "live staffing brief" ledger on slate with hairline rules,
 * monospace coverage rows and a pulsing terracotta availability dot.
 */

const LEDGER_ROWS = [
  { day: "MON", date: "06/10", coverage: "12 ON FLOOR", note: "Estate dinner" },
  { day: "TUE", date: "06/11", coverage: "08 ON FLOOR", note: "Club brunch" },
  { day: "THU", date: "06/13", coverage: "16 ON FLOOR", note: "Gala service" },
  { day: "FRI", date: "06/14", coverage: "24 ON FLOOR", note: "Hotel surge" },
  { day: "SAT", date: "06/15", coverage: "31 ON FLOOR", note: "Wedding" },
] as const;

export default function Hero() {
  const reduced = useReducedMotion();
  const stagger = revealContainer(!!reduced, 0.12, 0.05);
  const item = revealItem(!!reduced);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-transparent"
    >
      {/* Static gradient wash — the ledger is the hero now, keep the canvas quiet */}
      <AmbientHeroAccent />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="shell relative z-10 flex min-h-[min(100dvh,880px)] flex-col justify-center gap-16 py-28 lg:flex-row lg:items-start lg:justify-between lg:gap-20"
      >
        {/* Left — bone Fraunces display */}
        <div className="max-w-3xl lg:w-[58%]">
          <motion.p
            variants={item}
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-[#849093]"
          >
            Grandeur · Hospitality Staffing
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={item}
            className="font-legacy-serif text-[clamp(3rem,7vw,6.4rem)] font-light leading-[0.94] tracking-[-0.04em] text-[#f5f1e9]"
          >
            Service, staffed
            <br />
            <em className="font-normal italic text-[#e2a891]">before</em> it is
            asked for.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-md text-[15px] leading-[1.8] text-[#849093]"
          >
            Briefed, vetted, and trained to your house standards — captains,
            culinarians, and house staff ready wherever your service standard
            matters.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-5">
            <SweepCta href="#request-staff" label="Request staff" />
            <a
              href="#services"
              className="group inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.28em] text-[#849093] transition-colors duration-300 hover:text-[#e2a891]"
            >
              View roster
              <span className="h-px w-8 bg-[#849093]/40 transition-transform duration-500 group-hover:scale-x-[1.75] group-hover:bg-[#e2a891]/70" />
            </a>
          </motion.div>
        </div>

        {/* Right — live staffing brief ledger */}
        <motion.aside
          variants={item}
          aria-label="Live staffing brief"
          className="w-full max-w-[340px] shrink-0 border border-[rgba(245,241,233,0.12)] bg-[#151b1d] lg:pt-1 lg:w-[300px]"
        >
          <div className="flex items-center justify-between border-b border-[rgba(245,241,233,0.12)] px-5 py-4">
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#849093]">
              Live staffing brief
            </span>
            <span className="flex items-center gap-2">
              <motion.span
                className="block h-1.5 w-1.5 rounded-full bg-[#e2a891]"
                animate={reduced ? { opacity: 1 } : { opacity: [1, 0.4, 1] }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#e2a891]">
                Desk open
              </span>
            </span>
          </div>

          <ul>
            {LEDGER_ROWS.map((row) => (
              <li
                key={row.date}
                className="flex items-baseline justify-between gap-4 border-b border-[rgba(245,241,233,0.12)] px-5 py-3.5 last:border-b-0"
              >
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#f5f1e9]">
                  {row.day} {row.date}
                </span>
                <span className="text-right align-baseline">
                  <span className="block font-mono text-[11px] tracking-[0.08em] text-[#e2a891] tabular-nums">
                    {row.coverage}
                  </span>
                  <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#849093]">
                    {row.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[rgba(245,241,233,0.12)] px-5 py-4">
            <p className="font-mono text-[9px] uppercase leading-[1.8] tracking-[0.18em] text-[#849093]">
              Coverage confirmed nightly · NYC / LI / Hamptons
            </p>
          </div>
        </motion.aside>
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.9, duration: 0.7, ease: EASE_OUT }}
        className="pointer-events-none absolute bottom-8 left-[calc(50%+220px)] z-10 hidden lg:block"
      >
        <motion.span
          className="mx-auto block h-10 w-px bg-gradient-to-b from-[#f5f1e9]/25 to-transparent"
          animate={reduced ? {} : { scaleY: [0.3, 1, 0.3], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}

