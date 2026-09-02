import { motion } from "framer-motion";
import { GALLERY_ITEMS } from "@/data/content";
import TextReveal, { RevealLine } from "@/components/TextReveal";

export default function Gallery() {
  return (
    <section id="gallery" className="section-shell relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="editorial-label mb-8"
        >
          Portfolio & Engagements
        </motion.p>

        <TextReveal delay={0.1}>
          <h2 className="max-w-2xl font-serif text-[clamp(2.5rem,5vw,4.4rem)] font-light leading-none uppercase tracking-tight">
            <RevealLine>Work We</RevealLine>
            <RevealLine isGold className="mt-1">
              Support
            </RevealLine>
          </h2>
        </TextReveal>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-12 md:grid-flow-dense">
          {GALLERY_ITEMS.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: 0.1 + index * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`group glass-edge p-8 rounded-2xl border border-white/[0.08] bg-[#090b10]/95 hover:border-gold-400/40 transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${index % 2 === 0 ? "md:col-span-8" : "md:col-span-4"}`}
            >
              {/* Image with Cinematic Mask Wipe */}
              <div className="relative -mx-8 -mt-8 mb-7 overflow-hidden rounded-t-2xl border-b border-white/[0.08] aspect-16/10">
                <motion.div
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full w-full"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:translate-x-1"
                  />
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-transparent opacity-80" />
              </div>

              <div className="flex items-center justify-between mb-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-[-2px]">
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-champagne-300">
                  {item.tag}
                </span>

              </div>

              <h3 className="font-serif text-2xl font-light uppercase tracking-tight text-white group-hover:text-gold-300 transition-colors">
                {item.title}
              </h3>

              <p className="mt-3 text-[13.5px] text-neutral-300 leading-[1.9] font-light">
                {item.detail}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

