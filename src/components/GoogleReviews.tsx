import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

/**
 * Testimonials — single-open editorial quote (DESIGN.md directive 3).
 * Left rail: monospace client index, terracotta only on the active row.
 * Main: oversized Fraunces light quote with one italic terracotta phrase and
 * a single monospace rating/data line matching the ledger language.
 * AnimatePresence mode="wait" crossfade — opacity and 12px y only.
 */

interface Review {
  name: string;
  role: string;
  venue: string;
  rating: number;
  text: string;
  /** Phrase rendered in italic terracotta within the quote. */
  emphasis: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    role: "Event Director",
    venue: "The Pierre Hotel",
    rating: 5,
    text: "Grandeur staffed our gala in under 48 hours. Every server arrived polished, prepared, and ready to work.",
    emphasis: "in under 48 hours",
    date: "2 weeks ago",
  },
  {
    name: "Michael R.",
    role: "General Manager",
    venue: "Westchester Country Club",
    rating: 5,
    text: "Their captains understand fine dining and consistently exceed our members' expectations.",
    emphasis: "understand fine dining",
    date: "1 month ago",
  },
  {
    name: "Jennifer L.",
    role: "Catering Director",
    venue: "Cipriani Wall Street",
    rating: 5,
    text: "Grandeur filled 30 positions overnight. The quality was indistinguishable from our own team.",
    emphasis: "overnight",
    date: "3 weeks ago",
  },
  {
    name: "David K.",
    role: "Operations Manager",
    venue: "Fontainebleau Miami",
    rating: 5,
    text: "From housekeeping to bartending, every person they send is trained, punctual, and hospitable.",
    emphasis: "every person they send",
    date: "1 month ago",
  },
  {
    name: "Amanda T.",
    role: "Wedding Planner",
    venue: "Independent",
    rating: 5,
    text: "Their attention to detail is unmatched. I recommend Grandeur to every bride I work with.",
    emphasis: "unmatched",
    date: "2 months ago",
  },
  {
    name: "Robert F.",
    role: "VP of Events",
    venue: "Fortune 500 company",
    rating: 5,
    text: "We trust Grandeur with every corporate event. Their security team handles VIPs with discretion.",
    emphasis: "with discretion",
    date: "3 weeks ago",
  },
];

export default function GoogleReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const active = REVIEWS[activeIndex];

  return (
    <section id="reviews" className="relative overflow-hidden">
      <div className="shell">
        <div className="editorial-rule mb-20" />

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="text-display-2 max-w-xl font-legacy-serif font-light leading-[1.02] tracking-[-0.03em] text-[#f5f1e9]"
        >
          What our clients <em className="font-normal italic text-[#e2a891]">are saying.</em>
        </motion.h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-20">
          {/* Left rail — monospace client index */}
          <ul className="flex flex-row gap-6 overflow-x-auto lg:flex-col lg:gap-0" aria-label="Client testimonials">
            {REVIEWS.map((review, index) => (
              <li key={review.name} className="lg:border-b lg:border-[rgba(245,241,233,0.12)] lg:last:border-b-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-current={activeIndex === index}
                  className={cn(
                    "relative flex items-baseline gap-3 whitespace-nowrap py-3 font-mono text-[11px] tracking-[0.08em] transition-colors duration-200 lg:w-full lg:py-4 lg:pl-6",
                    activeIndex === index
                      ? "text-[#f5f1e9]"
                      : "text-[#849093] hover:text-[#f5f1e9]/80",
                  )}
                >
                  {/* Terracotta 12px rule for the active index */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-1/2 hidden h-px w-3 -translate-y-1/2 bg-[#e2a891] transition-opacity duration-200 lg:block",
                      activeIndex === index ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "tabular-nums",
                      activeIndex === index ? "text-[#e2a891]" : "text-[#849093]",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {review.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Main — oversized editorial quote */}
          <div className="min-h-[320px] lg:min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.name}
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#849093] tabular-nums">
                  {active.rating.toFixed(1)} · Google · {active.date}
                </p>

                <blockquote className="mt-10">
                  <p className="max-w-3xl font-legacy-serif text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-[1.22] tracking-[-0.02em] text-[#f5f1e9]">
                    “
                    {active.emphasis.length > 0 && active.text.includes(active.emphasis) ? (
                      (() => {
                        const [before, after] = active.text.split(active.emphasis);
                        return (
                          <>
                            {before}
                            <em className="font-normal italic text-[#e2a891]">{active.emphasis}</em>
                            {after}
                          </>
                        );
                      })()
                    ) : (
                      active.text
                    )}
                    ”
                  </p>
                </blockquote>

                <div className="mt-12 border-t border-[rgba(245,241,233,0.12)] pt-6">
                  <p className="text-[13px] font-medium tracking-[0.02em] text-[#f5f1e9]">{active.name}</p>
                  <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[#849093]">
                    {active.role} · {active.venue}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-14"
        >
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-[#849093] transition-colors duration-200 hover:text-[#e2a891]"
          >
            Read more on Google
          </a>
        </motion.div>
      </div>
    </section>
  );
}
