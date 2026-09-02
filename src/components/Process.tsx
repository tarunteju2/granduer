import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal, { RevealLine } from "@/components/TextReveal";
import ScrollReveal from "@/components/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Recruit & Screen",
    tag: "Talent Acquisition",
    summary:
      "We source top hospitality talent through trusted industry networks and conduct rigorous telephone and in-person interviews to evaluate decorum, polish, and communication.",
  },
  {
    number: "02",
    title: "Verify & Vet",
    tag: "Security Compliance",
    summary:
      "Every candidate undergoes thorough background verification, reference cross-examination, SSA checks, and strict substance screening before onboarding.",
  },
  {
    number: "03",
    title: "Train & Equip",
    tag: "House Standards",
    summary:
      "Mandatory fine-dining seminars, client-specific manual coaching, and meticulous uniform inspections ensure your staff arrives impeccable.",
  },
  {
    number: "04",
    title: "Deploy & Evaluate",
    tag: "Quality Assurance",
    summary:
      "Post-event performance audits supervised by Senior Captains maintain our 98% satisfaction standard across every luxury engagement.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const stepsContainer = stepsContainerRef.current;
    if (!section || !line || !stepsContainer) return;

    const stepCards = stepsContainer.querySelectorAll(".process-step-card");

    const ctx = gsap.context(() => {
      // Animate the connecting gold line as user scrolls through
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stepsContainer,
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.8,
          },
        }
      );

      // Staggered activation of step cards
      stepCards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="section-chapter relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        {/* Rule */}
        <div className="editorial-rule mb-24" />

        <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="editorial-label mb-8"
            >
              How we work
            </motion.p>
            <TextReveal delay={0.1}>
              <h2 className="max-w-xl font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight">
                <RevealLine>Quality</RevealLine>
                <RevealLine isGold className="mt-1">
                  Assured
                </RevealLine>
              </h2>
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="mt-8 max-w-md text-[14px] text-white/60 leading-[2.0] font-light"
            >
              Every professional on our active roster passes a rigorous vetting, training, and evaluation protocol before representing your establishment.
            </motion.p>
          </div>

          {/* Interactive Timeline Container */}
          <div ref={stepsContainerRef} className="relative mt-2 lg:col-span-8 lg:mt-0">
          {/* Connecting Gold Timeline Bar (Desktop) */}
          <div className="hidden lg:block absolute top-[28px] left-0 right-0 h-[2px] bg-white/[0.08] z-0">
            <div
              ref={lineRef}
              className="h-full w-full bg-gradient-to-r from-gold-400 via-champagne-300 to-gold-500 origin-left"
            />
          </div>

          {/* 4 Process Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.title} as="article" delay={i * 90}>
                <div
                  className="process-step-card premium-card group relative flex h-full flex-col justify-between rounded-xl border border-white/[0.08] bg-[#090b10]/90 p-7 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-2 hover:border-gold-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                <div>
                  {/* Step Header Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/10 text-[12px] font-mono font-semibold text-gold-400 group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-neutral-950 transition-all duration-300">
                      {step.number}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-light uppercase tracking-tight text-white mb-3 group-hover:text-gold-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-[13px] leading-[1.85] text-neutral-300 font-light">
                    {step.summary}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400">
                    Phase 0{i + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[2.2] group-hover:bg-gold-400" />
                </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

