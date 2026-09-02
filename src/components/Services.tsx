import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/content";
import ScrollReveal from "@/components/ScrollReveal";

const SERVICE_IMAGES = [
  "/images/culinary-operations.jpeg",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
  "/images/pine-hollow-club.webp",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85",
  "/images/pine-hollow-club.webp",
];

export default function Services() {
  return (
    <section id="services" className="section-chapter relative overflow-hidden py-36">
      <div className="mx-auto max-w-350 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="editorial-rule mb-20" />
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }} className="editorial-label mb-7">
              The roster
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .08, duration: .8 }} className="max-w-lg font-legacy-serif text-[clamp(3rem,5.6vw,6.2rem)] font-light leading-[.88] tracking-[-.055em] text-[#f5f1e9]">
              The right person changes <em className="text-[#e2a891]">everything.</em>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2, duration: .7 }} className="mt-9 max-w-sm text-[15px] leading-[1.9] text-white/52">
              One trusted partner for the people behind unforgettable hospitality. Every role is briefed, vetted, and ready for your house standards.
            </motion.p>
            <a href="#request-staff" className="group mt-10 inline-flex items-center gap-3 border-b border-[#e2a891]/50 pb-2 text-[10px] uppercase tracking-[.28em] text-[#f1bba6] transition-colors hover:text-white">
              Build your team
              <ArrowUpRight size={15} strokeWidth={1.4} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          <div className="divide-y divide-white/12 border-y border-white/12">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.id} as="article" delay={index * 70}>
                  <article className="service-row group relative grid gap-6 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8">
                  <div className="flex items-center gap-4 sm:block">
                    <span className="font-mono text-[10px] text-[#e2a891]">0{index + 1}</span>
                    <Icon size={18} strokeWidth={1.2} className="text-white/35 transition-colors duration-500 group-hover:text-[#e2a891] sm:mt-5" />
                  </div>
                  <div>
                    <p className="mb-2 text-[9px] uppercase tracking-[.26em] text-white/35">{service.shortTitle}</p>
                    <h3 className="font-legacy-serif text-2xl font-light tracking-[-.02em] text-white transition-colors duration-500 group-hover:text-[#f1bba6] sm:text-3xl">{service.title}</h3>
                    <p className="mt-3 max-w-xl text-[13px] leading-[1.8] text-white/45 transition-colors duration-500 group-hover:text-white/65">{service.description}</p>
                  </div>
                  <a href="#request-staff" aria-label={`Inquire about ${service.title}`} className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/50 transition-all duration-500 group-hover:border-[#e2a891]/70 group-hover:bg-[#e2a891] group-hover:text-[#101416] sm:self-center">
                    <ArrowUpRight size={17} strokeWidth={1.3} />
                  </a>
                  <div className="pointer-events-none absolute right-20 top-1/2 hidden h-24 w-36 -translate-y-1/2 translate-x-5 overflow-hidden opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-100 lg:block">
                    <img src={SERVICE_IMAGES[index]} alt="" className="h-full w-full object-cover grayscale-[.25]" />
                  </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
