"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CinematicHeroProps {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  metricValue?: string;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export default function CinematicHero({
  brandName = "Grandeur",
  tagline1 = "Hospitality,",
  tagline2 = "ready before arrival.",
  cardHeading = "People who make service feel effortless.",
  metricValue = "500+",
  metricLabel = "Staff placed weekly",
  ctaHeading = "Request Staff",
  ctaDescription = "Trained professionals, briefed precisely, ready wherever your service standard matters.",
}: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const metricRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax card reveal on scroll
      gsap.fromTo(
        cardRef.current,
        {
          y: 80,
          opacity: 0,
          scale: 0.92,
          rotateY: 8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1.2,
          },
        }
      );

      // Tagline fade up
      gsap.fromTo(
        taglineRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Metric counter animation
      gsap.fromTo(
        metricRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: metricRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Overlay fade
      gsap.to(overlayRef.current, {
        opacity: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse-reactive 3D card effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 16,
      rotateX: -y * 12,
      transformPerspective: 1200,
      duration: 0.5,
      ease: "power2.out",
    });

    // Update CSS custom properties for ambient glow
    const section = sectionRef.current;
    if (section) {
      section.style.setProperty("--mouse-x", `${e.clientX}px`);
      section.style.setProperty("--mouse-y", `${e.clientY}px`);
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="cinematic-hero-title"
      className="cinematic-hero relative min-h-[min(100dvh,900px)] overflow-hidden bg-transparent"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Mouse-reactive ambient glow */}
      <div
        className="pointer-events-none absolute -inset-20 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 60% 50% at var(--mouse-x) var(--mouse-y), rgba(226,168,145,0.18), transparent 70%)`,
        }}
      />

      {/* Film grain overlay */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(226,168,145,0.14),transparent_40%),linear-gradient(180deg,rgba(16,20,22,0.3)_0%,rgba(16,20,22,0.15)_60%,rgba(12,16,17,0.35)_100%)]" />
      </div>

      {/* Decorative border frame */}
      <div className="pointer-events-none absolute inset-x-8 inset-y-12 border border-[#e2a891]/8" />

      <div className="relative z-10 mx-auto flex min-h-[min(100dvh,900px)] max-w-7xl flex-col justify-center px-6 py-24 sm:px-10 lg:flex-row lg:items-center lg:gap-20 lg:px-16 xl:px-20">
        {/* Left: Taglines */}
        <div ref={taglineRef} className="max-w-3xl lg:w-1/2">
          <p className="mb-3 font-legacy-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#e2a891]/80">
            {brandName}
          </p>

          <h1
            id="cinematic-hero-title"
            className="font-legacy-sans text-[clamp(3rem,6.5vw,6rem)] font-semibold leading-[.92] tracking-[-.065em] text-[#f5f1e9]"
          >
            {tagline1}
            <span className="block font-normal text-[#e2a891]">{tagline2}</span>
          </h1>

          <p className="mt-8 max-w-md text-[15px] leading-[1.8] text-white/65 sm:text-base">
            {ctaDescription}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="#request-staff"
              className="group/btn inline-flex items-center gap-4 border border-[#e2a891]/70 bg-[#e2a891]/8 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[.28em] text-[#f1bba6] transition-all duration-500 hover:bg-[#e2a891] hover:text-[#101416] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a891]"
            >
              {ctaHeading}
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
              />
            </a>

            <a
              href="#services"
              className="group inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.28em] text-white/55 transition-colors hover:text-[#f1bba6]"
            >
              View services
              <span className="h-px w-8 bg-white/30 transition-all duration-500 group-hover:w-14 group-hover:bg-[#e2a891]" />
            </a>
          </div>

          {/* Metric */}
          <div ref={metricRef} className="mt-14 flex items-baseline gap-3">
            <span className="font-legacy-sans text-6xl font-semibold text-[#e2a891]">{metricValue}</span>
            <span className="font-legacy-sans text-sm text-white/50">{metricLabel}</span>
          </div>
        </div>

        {/* Right: 3D Card */}
        <div className="relative mt-16 lg:mt-0 lg:w-1/2">
          <div
            className="perspective-1200 relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Skeuomorphic frame */}
            <div className="relative rounded-2xl border border-[#e2a891]/20 bg-gradient-to-b from-[#1a2124] to-[#101416] p-1 shadow-[0_30px_80px_rgba(0,0,0,0.4),0_0_60px_rgba(226,168,145,0.08)]">
              {/* Card inner */}
              <div
                ref={cardRef}
                className="relative aspect-[.88] overflow-hidden rounded-xl border border-white/10"
              >
                <img
                  src="/videos/gala-toast-poster.jpg"
                  alt="Elegant hospitality event with staff serving guests"
                  className="h-full w-full object-cover grayscale-[.1] contrast-[1.08]"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101416]/90 via-[#101416]/20 to-transparent" />

                {/* Card content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="mb-4 h-px w-12 bg-gradient-to-r from-[#e2a891] to-transparent" />
                  <p className="font-legacy-serif text-2xl leading-[1.1] text-[#f5f1e9] sm:text-[1.6rem]">
                    {cardHeading}
                  </p>
                </div>

                {/* Glass reflection */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

                {/* Ambient corner glow */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#e2a891]/10 blur-3xl" />
                <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[#e2a891]/8 blur-2xl" />
              </div>

              {/* Hardware button accents (skeuomorphic detail) */}
              <div className="absolute -right-2 top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-full bg-[#2a3236] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
              <div className="absolute -right-2 top-[calc(50%-28px)] h-6 w-1.5 rounded-full bg-[#2a3236] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
              <div className="absolute -right-2 top-[calc(50%+28px)] h-6 w-1.5 rounded-full bg-[#2a3236] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Floating badge */}
            <div className="absolute -left-4 -top-4 rounded-xl border border-[#e2a891]/25 bg-[#101416]/90 px-4 py-3 shadow-lg backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[.2em] text-[#e2a891]/70">Premium Staffing</p>
              <p className="mt-0.5 font-legacy-serif text-lg text-[#f5f1e9]">Since 1994</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[.3em] text-white/30">Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
