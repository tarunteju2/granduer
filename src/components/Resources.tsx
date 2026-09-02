import { motion } from "framer-motion";
import { RESOURCES } from "@/data/content";

export default function Resources() {
  return (
    <section id="resources" className="section-shell relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="editorial-label mb-8"
            >
              Resources
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="max-w-2xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-none uppercase tracking-tight"
            >
              Planning
              <br />
              <span className="italic text-gold-400">Guides</span>
            </motion.h2>
          </div>

          <p className="max-w-md text-[14px] text-white/40 leading-[1.9] font-light">
            Build better event execution with practical hospitality staffing guidance and operational templates.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {RESOURCES.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 + index * 0.07, duration: 0.55 }}
              className="group border border-white/10 bg-white/[0.02] p-7 hover:border-gold-400/30 transition-colors"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/60">
                {item.type}
              </p>
              <h3 className="mt-4 font-serif text-2xl font-light uppercase tracking-wide text-white/90 group-hover:text-gold-400 transition-colors">
                {item.title}
              </h3>
              <p className="mt-4 text-[14px] text-white/40 leading-[1.9] font-light">
                {item.excerpt}
              </p>
              <a
                href="#contact"
                className="mt-6 inline-block text-[11px] uppercase tracking-[0.3em] text-white/45 hover:text-white transition-colors"
              >
                Request Access →
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
