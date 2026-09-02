import { motion } from "framer-motion";
import { CLIENT_TYPES, CLIENTS_COPY } from "@/data/content";
import ClientWebGLAccent from "@/components/ClientWebGLAccent";

export default function Clients() {
  return (
    <section id="clients" className="section-chapter relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        {/* Rule */}
        <div className="editorial-rule mb-24" />

        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          {/* Left - heading */}
          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="editorial-label mb-8"
            >
              Clientele
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight"
            >
              Trusted by
              <br />
              <span className="italic text-gold-400">the Best</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 max-w-sm text-[15px] text-white/42 leading-[1.9] font-light"
            >
              {CLIENTS_COPY.description}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24, duration: 0.6 }}
              className="mt-5 max-w-sm text-[13px] text-white/26 leading-[1.9] font-light"
            >
              {CLIENTS_COPY.references}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.65 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative mt-10 max-w-md overflow-hidden border border-gold-400/20 bg-[linear-gradient(180deg,rgba(196,163,90,0.12),rgba(255,255,255,0.04))] px-6 py-6 transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(196,163,90,0.14)]"
            >
              <ClientWebGLAccent />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_70%)] opacity-60" />
              <motion.div
                aria-hidden="true"
                initial={{ x: "-130%", opacity: 0 }}
                whileHover={{ x: "130%", opacity: [0, 0.45, 0] }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-y-0 left-0 w-24 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]"
              />
              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-[0.34em] text-gold-400/85">
                  References
                </p>
                <p className="mt-4 font-serif text-[1.8rem] font-light uppercase tracking-[0.08em] text-white/95 transition-colors duration-500 group-hover:text-gold-400/95 sm:text-[2rem]">
                  Senior Account
                  <br />
                  Manager Review
                </p>
                <p className="mt-4 text-[14px] leading-[1.9] text-white/58">
                  {CLIENTS_COPY.closing}
                </p>
              </div>
            </motion.div>

            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="group mt-12 inline-flex items-center gap-3 border border-white/15 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-white/60 hover:bg-white hover:text-black transition-all duration-500"
            >
              Meet a Senior Account Manager
            </motion.a>
          </div>

          {/* Right - client type list */}
          <div className="lg:col-span-7 lg:pt-16">
            {CLIENT_TYPES.map((ct, i) => (
              <motion.div
                key={ct}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.5 }}
                whileHover={{ x: 6 }}
                className="group flex items-center justify-between border-t border-white/6 py-7 px-2 hover:bg-white/2 transition-colors last:border-b"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[11px] font-medium text-white/15 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-xl font-light text-white/60 group-hover:text-white transition-colors uppercase tracking-wider lg:text-2xl">
                    {ct}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/12 group-hover:text-white/30 transition-colors">
                  →
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
