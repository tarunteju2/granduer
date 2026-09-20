import { motion, useReducedMotion } from "framer-motion";
import { SERVICES } from "@/data/content";
import { REVEAL_VIEWPORT } from "@/lib/motion";

/**
 * Services — indexed roster rows (DESIGN.md directive 2).
 * Full-width hairline rows with a monospace index, Outfit uppercase label,
 * Fraunces service name, muted one-liner. Hover: terracotta arrow slides in
 * and the row surface warms to slate — transform/opacity only.
 */

export default function Services() {
  const reduced = useReducedMotion();

  return (
    <section id="services" className="section-chapter relative overflow-hidden">
      <div className="shell">
        <div className="editorial-rule mb-20" />

        <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-display-2 max-w-lg font-legacy-serif font-light leading-[0.9] tracking-[-0.05em] text-[#f5f1e9]"
            >
              Staff who make service feel <em className="font-normal italic text-[#e2a891]">effortless.</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: reduced ? 0 : 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 max-w-sm text-[15px] leading-[1.9] text-[#849093]"
            >
              Briefed, vetted, and trained to your house standards across front-of-house, kitchens, hotels, and events.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: reduced ? 0 : 0.24, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              href="#request-staff"
              className="group mt-10 inline-flex items-center gap-3 border-b border-[#e2a891]/50 pb-2 text-[10px] font-medium uppercase tracking-[.28em] text-[#e2a891] transition-colors duration-300 hover:text-[#f5f1e9]"
            >
              Build your team
              <span
                aria-hidden="true"
                className="text-[#e2a891] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
              >
                →
              </span>
            </motion.a>
          </div>

          {/* Indexed roster rows */}
          <div>
            {SERVICES.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL_VIEWPORT}
                transition={{ delay: reduced ? 0 : index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group service-row relative border-t border-[rgba(245,241,233,0.12)] transition-colors duration-[250ms] last:border-b hover:bg-[rgba(21,27,29,0.6)]"
              >
                <a
                  href="#request-staff"
                  aria-label={`Inquire about ${service.title}`}
                  className="grid grid-cols-1 gap-3 px-1 py-10 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:gap-8"
                >
                  {/* Monospace index */}
                  <span className="font-mono text-[11px] tracking-[0.1em] text-[#849093] transition-colors duration-300 group-hover:text-[#e2a891]">
                    {String(index + 1).padStart(2, "0")} /
                  </span>

                  <div>
                    <p className="mb-2 text-[9px] font-medium uppercase tracking-[.26em] text-[#849093]">
                      {service.shortTitle}
                    </p>
                    <h3 className="font-legacy-serif text-[26px] font-light leading-[1.1] tracking-[-0.02em] text-[#f5f1e9] transition-colors duration-300 group-hover:text-[#e2a891] sm:text-[28px]">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[13px] leading-[1.8] text-[#849093]">
                      {service.description}
                    </p>
                  </div>

                  {/* Terracotta arrow — slides in on hover (x -8 -> 0, opacity only) */}
                  <span
                    aria-hidden="true"
                    className="hidden text-[18px] leading-none text-[#e2a891] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2 sm:block"
                  >
                    →
                  </span>
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
