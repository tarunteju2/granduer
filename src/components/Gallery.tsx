import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GALLERY_ITEMS } from "@/data/content";
import { EASE_OUT, REVEAL_VIEWPORT, revealItem } from "@/lib/motion";

export default function Gallery() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (reduced) return;
    const observers = itemRefs.current.map((node, index) => {
      if (!node) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0.01 },
      );
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [reduced]);

  return (
    <section id="gallery" className="section-chapter relative overflow-hidden">
      <div className="shell">
        <div className="editorial-rule mb-20" />
        <motion.p
          variants={revealItem(Boolean(reduced))}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          className="editorial-label mb-8"
        >
          Portfolio & engagements
        </motion.p>
        <motion.h2
          variants={revealItem(Boolean(reduced))}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          className="text-display-2 max-w-2xl font-serif font-light leading-[.92] tracking-[-.05em] text-[#f5f1e9]"
        >
          Work we
          <br />
          <em className="font-normal italic text-[#e2a891]">support.</em>
        </motion.h2>
        <motion.p
          variants={revealItem(Boolean(reduced))}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          className="mt-8 max-w-xl text-[15px] leading-[1.9] text-[#849093]"
        >
          A selection of environments where Grandeur teams deliver composed, detail-driven hospitality support.
        </motion.p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
          <div className={reduced ? "lg:relative" : "lg:sticky lg:top-32 lg:self-start"}>
            <div className="relative aspect-[4/3] overflow-hidden border border-[rgba(245,241,233,0.12)] bg-[#151b1d]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={GALLERY_ITEMS[activeIndex].imageUrl}
                  src={GALLERY_ITEMS[activeIndex].imageUrl}
                  alt={GALLERY_ITEMS[activeIndex].imageAlt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.55, ease: EASE_OUT }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101416]/60 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[.18em] text-[#f5f1e9]/75">
                {String(activeIndex + 1).padStart(2, "0")} / {String(GALLERY_ITEMS.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div>
            {GALLERY_ITEMS.map((item, index) => (
              <motion.article
                key={item.title}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                variants={revealItem(Boolean(reduced))}
                initial="hidden"
                whileInView="visible"
                viewport={REVEAL_VIEWPORT}
                className="border-t border-[rgba(245,241,233,0.12)] py-10 first:pt-0 last:border-b"
              >
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#849093]">
                  {String(index + 1).padStart(2, "0")} &nbsp; {item.tag}
                </p>
                <h3 className={`mt-5 font-serif text-[26px] font-light leading-tight transition-colors duration-300 ${activeIndex === index || reduced ? "text-[#f5f1e9]" : "text-[#849093]"}`}>
                  {item.title}
                </h3>
                <p className="mt-3 max-w-lg text-[14px] leading-[1.8] text-[#849093]">{item.detail}</p>
                {reduced && (
                  <img src={item.imageUrl} alt={item.imageAlt} className="mt-6 aspect-[4/3] w-full border border-[rgba(245,241,233,0.12)] object-cover" />
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
