import { motion, useReducedMotion } from "framer-motion";
import { CLIENT_TYPES, CLIENTS_COPY } from "@/data/content";
import { REVEAL_VIEWPORT, revealItem } from "@/lib/motion";

/**
 * Clientele — a quiet, text-only marquee that keeps the roster legible and
 * avoids pretending that client names are logos.
 */
export default function Clients() {
  const reduced = useReducedMotion();
  const items = [...CLIENT_TYPES, ...CLIENT_TYPES];

  return (
    <section id="clients" className="section-chapter relative overflow-hidden">
      <div className="shell">
        <div className="editorial-rule mb-20" />

        <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24 lg:items-start">
          <div>
            <motion.p
              variants={revealItem(Boolean(reduced))}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              className="editorial-label mb-8"
            >
              Clientele
            </motion.p>
            <motion.h2
              variants={revealItem(Boolean(reduced))}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: reduced ? 0 : 0.1 }}
              className="text-display-2 font-serif font-light leading-[.92] tracking-[-.05em] text-[#f5f1e9]"
            >
              Trusted by
              <br />
              <em className="font-normal italic text-[#e2a891]">the best.</em>
            </motion.h2>
            <motion.p
              variants={revealItem(Boolean(reduced))}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: reduced ? 0 : 0.2 }}
              className="mt-8 max-w-sm text-[15px] leading-[1.9] text-[#849093]"
            >
              {CLIENTS_COPY.description}
            </motion.p>
            <motion.p
              variants={revealItem(Boolean(reduced))}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: reduced ? 0 : 0.28 }}
              className="mt-5 max-w-sm text-[13px] leading-[1.9] text-[#849093]/75"
            >
              {CLIENTS_COPY.references}
            </motion.p>
          </div>

          <motion.div
            variants={revealItem(Boolean(reduced))}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            className="min-w-0 lg:pt-16"
          >
            <div
              aria-label="Client types"
              tabIndex={0}
              className="clients-marquee relative overflow-hidden border-y border-[rgba(245,241,233,0.12)] py-8 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16 before:bg-gradient-to-r before:from-[#101416] before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16 after:bg-gradient-to-l after:from-[#101416] after:to-transparent"
            >
              <motion.div
                className={`clients-marquee-track flex w-max items-center${reduced ? " clients-marquee-track--reduced" : ""}`}
              >
                {items.map((client, index) => (
                  <div
                    key={`${client}-${index}`}
                    className="flex shrink-0 items-center gap-8 px-8 first:pl-16 last:pr-16"
                    aria-hidden={index >= CLIENT_TYPES.length}
                  >
                    <span className="font-mono text-[10px] tracking-[.16em] text-[#849093]">
                      {String((index % CLIENT_TYPES.length) + 1).padStart(2, "0")}
                    </span>
                    <span className="whitespace-nowrap font-sans text-[12px] font-medium uppercase tracking-[.24em] text-[#f5f1e9]">
                      {client}
                    </span>
                    <span aria-hidden="true" className="text-[#e2a891]">•</span>
                  </div>
                ))}
              </motion.div>
            </div>
            <p className="mt-5 max-w-lg text-[12px] leading-[1.8] text-[#849093]">
              {CLIENTS_COPY.closing}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
