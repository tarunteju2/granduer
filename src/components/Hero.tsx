import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, MoveDownRight } from "lucide-react";
import { COMPANY } from "@/data/content";
import MagneticButton from "@/components/MagneticButton";
import AmbientHeroAccent from "@/components/AmbientHeroAccent";
import ThreeHeroScene from "@/components/ThreeHeroScene";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 0.8], [0, shouldReduceMotion ? 0 : -56]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.68, 1], [1, shouldReduceMotion ? 1 : 0.96, shouldReduceMotion ? 1 : 0]);
  const handoffOpacity = useTransform(scrollYProgress, [0.68, 0.92], [0, shouldReduceMotion ? 0 : 1]);
  const handoffY = useTransform(scrollYProgress, [0.68, 0.92], [8, shouldReduceMotion ? 8 : 0]);
  const motionStyle = shouldReduceMotion ? undefined : { willChange: "transform, opacity" };

  return (
    <section ref={sectionRef} id="home" aria-labelledby="hero-title" className="hero-section relative min-h-[100dvh] overflow-hidden bg-[#101416] pt-24 pb-14 lg:pt-28">
      <div className="absolute inset-0 overflow-hidden bg-[#101416]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_24%,rgba(226,168,145,.12),transparent_34%),linear-gradient(180deg,#101416_0%,#101416_72%,#0c1011_100%)]" />
      </div>
      <AmbientHeroAccent />
      <ThreeHeroScene />

      <div className="hero-orbit absolute -right-40 top-1/4 h-150 w-150 rounded-full border border-[#e2a891]/20" />
      <div className="hero-orbit hero-orbit-delayed absolute -right-24 top-[29%] h-118 w-118 rounded-full border border-white/10" />

      <motion.div style={{ y: contentY, opacity: contentOpacity, ...motionStyle }} className="relative z-10 mx-auto grid w-full max-w-350 gap-12 px-6 sm:px-10 lg:grid-cols-[minmax(0,1.16fr)_minmax(300px,.84fr)] lg:items-end lg:px-16 xl:px-20">
        <div className="max-w-6xl">
          <motion.div custom={0.15} initial="hidden" animate="visible" variants={reveal} className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 bg-[#e2a891]" />
            <p className="eyebrow text-[#f1bba6]">Est. {COMPANY.founded} · Private Hospitality</p>
          </motion.div>

          <motion.h1 id="hero-title" custom={0.28} initial="hidden" animate="visible" variants={reveal} className="max-w-6xl font-legacy-sans text-[clamp(3.2rem,7vw,7rem)] font-semibold leading-[.92] tracking-[-.065em] text-[#f5f1e9]">
            <span className="block">Hospitality,</span>
            <em className="block font-normal text-[#e2a891]">ready before arrival.</em>
          </motion.h1>

          <motion.p custom={0.5} initial="hidden" animate="visible" variants={reveal} className="mt-9 max-w-xl text-[15px] leading-[1.9] text-white/62 sm:text-base">
            Trained people, briefed precisely, ready wherever the standard is non-negotiable.
          </motion.p>

          <motion.div custom={0.68} initial="hidden" animate="visible" variants={reveal} className="mt-11 flex flex-wrap items-center gap-5">
            <MagneticButton strength={0.25}>
              <a href="#request-staff" className="cta-premium group inline-flex items-center gap-5 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[.28em]">
                Request staff
                <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </MagneticButton>
            <a href="#services" className="group inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.28em] text-white/60 transition-colors hover:text-[#f1bba6]">
              View services
              <span className="h-px w-8 bg-white/30 transition-all duration-500 group-hover:w-14 group-hover:bg-[#e2a891]" />
            </a>
          </motion.div>
        </div>

        <motion.div custom={0.82} initial="hidden" animate="visible" variants={reveal} className="relative ml-auto w-full max-w-105 lg:mb-5">
          <div className="relative aspect-[.82] overflow-hidden border border-white/20 bg-[#151b1d]/50 p-3 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
            <div className="relative h-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_28%,rgba(226,168,145,.16),transparent_34%),linear-gradient(135deg,#1a2224,#101416_62%,#0b0f10)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101416]/95 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 flex items-center gap-2 border border-white/20 bg-[#101416]/55 px-3 py-2 backdrop-blur-md">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#e2a891]" />
                <span className="text-[8px] uppercase tracking-[.25em] text-white/70">On call · 24/7</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="eyebrow text-[#f1bba6]">The Grandeur brief</p>
                  <p className="mt-2 max-w-45 font-legacy-serif text-2xl leading-none text-[#f5f1e9]">Poise in every detail.</p>
                </div>
                <MoveDownRight size={22} strokeWidth={1} className="text-[#e2a891]" />
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] gap-5 border-t border-white/15 pt-4">
            <div>
              <p className="text-[8px] uppercase tracking-[.28em] text-white/35">Current brief</p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/65">A polished team, ready before guests arrive.</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-[.28em] text-white/35">Coverage</p>
              <p className="mt-2 text-[11px] text-[#f1bba6]">NYC · FL</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity: handoffOpacity, y: handoffY, ...motionStyle }} className="hero-handoff pointer-events-none absolute inset-x-6 bottom-0 z-10 h-28 lg:inset-x-16">
        <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e2a891]/35 to-transparent" />
        <span className="absolute bottom-0 left-1/2 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-[#e2a891]/0 via-[#e2a891]/40 to-[#e2a891]/0" />
      </motion.div>
    </section>
  );
}
