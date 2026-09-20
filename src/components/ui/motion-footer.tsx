"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Instagram, Linkedin, Twitter, Facebook } from "lucide-react";
import { ClipPathLinks } from "@/components/ui/clip-path-links";
import { cn } from "@/lib/utils";

const INSTAGRAM_HREF =
  "https://www.instagram.com/grandeur.hospitality?stkn=d2I1ZWZtNzdzYjhz";

const FOOTER_SOCIAL_LINKS: { name: string; href: string; icon: typeof Instagram }[] = [
  { name: "Instagram", href: INSTAGRAM_HREF,                              icon: Instagram },
  { name: "LinkedIn",  href: "https://www.linkedin.com/company/grandeur-hospitality-consulting", icon: Linkedin  },
  { name: "Twitter",   href: "https://x.com/grandeurstaffing",            icon: Twitter   },
  { name: "Facebook",  href: "https://facebook.com/grandeurhospitality",  icon: Facebook  },
];

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Sora:wght@200;300;400;500;600;700&display=swap');

.motion-footer-wrapper {
  font-family: 'Cormorant Garamond', Georgia, serif;
  -webkit-font-smoothing: antialiased;
}

.motion-footer-glass-pill {
  background: linear-gradient(145deg, rgba(240,238,231,0.04) 0%, rgba(240,238,231,0.02) 100%);
  box-shadow:
    0 10px 30px -10px rgba(0,0,0,0.5),
    inset 0 1px 1px rgba(240,238,231,0.06),
    inset 0 -1px 2px rgba(0,0,0,0.3);
  border: 1px solid rgba(240,238,231,0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.motion-footer-glass-pill:hover {
  background: linear-gradient(145deg, rgba(240,238,231,0.08) 0%, rgba(240,238,231,0.04) 100%);
  border-color: rgba(240,238,231,0.18);
  box-shadow:
    0 20px 40px -10px rgba(0,0,0,0.6),
    inset 0 1px 1px rgba(240,238,231,0.12);
  color: rgba(240,238,231,0.92);
}

.footer-giant-bg-text {
  font-size: 20vw;
  line-height: 0.75;
  font-weight: 300;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(240,238,231,0.05);
  background: linear-gradient(180deg, rgba(240,238,231,0.08) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, rgba(240,238,231,0.92) 0%, rgba(240,238,231,0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(226,168,145,0.15));
}

.footer-bg-grid {
  background-size: 72px 72px;
  background-image:
    linear-gradient(to right, rgba(240,238,231,0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(240,238,231,0.025) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(226,168,145,0.06) 0%,
    rgba(213,143,120,0.04) 40%,
    transparent 70%
  );
}

.footer-marquee {
  animation: footer-marquee 50s linear infinite;
}

@keyframes footer-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

interface CinematicFooterProps {
  className?: string;
}

export function CinematicFooter({ className }: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  const giantTextY = useTransform(scrollYProgress, [0, 1], ["8vh", "0vh"]);
  const giantTextScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const giantTextOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.2, 0.8], [50, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        className={cn("relative w-full motion-footer-wrapper", className)}
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-[#0d1112] text-[#f0eee7]">

          {/* Ambient background layers */}
          <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          {/* Giant background text with parallax */}
          <motion.div
            className="footer-giant-bg-text pointer-events-none absolute -bottom-[5vh] left-1/2 z-0 whitespace-nowrap select-none"
            style={{ y: giantTextY, scale: giantTextScale, opacity: giantTextOpacity, x: "-50%" }}
          >
            GRANDEUR
          </motion.div>

          {/* Diagonal marquee */}
          <div className="absolute left-0 top-10 z-10 w-full scale-[1.02] overflow-hidden border-y border-[rgba(240,238,231,0.06)] bg-[rgba(13,17,18,0.7)] py-3.5 -rotate-[0.5deg] backdrop-blur-md">
            <div className="footer-marquee flex w-max items-center gap-12 text-[10px] font-medium uppercase tracking-[0.3em] text-[rgba(240,238,231,0.3)]">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  <span>Private Hospitality Staffing</span>
                  <span className="text-[#d58f78]/40">✦</span>
                  <span>Est. 1994</span>
                  <span className="text-[#d58f78]/40">✦</span>
                  <span>NYC · Long Island · New Jersey</span>
                  <span className="text-[#d58f78]/40">✦</span>
                  <span>South Florida</span>
                  <span className="text-[#d58f78]/40">✦</span>
                  <span>Premium Event Staff</span>
                  <span className="text-[#d58f78]/40">✦</span>
                  <span>The Standard Behind the Standard</span>
                  <span className="text-[#d58f78]/40">✦</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Main center content with scroll reveal */}
          <motion.div
            className="relative z-10 mx-auto mt-24 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <h2 className="mb-12 text-center font-legacy-serif text-5xl tracking-tight text-white md:text-7xl lg:text-8xl footer-text-glow">
              Ready to begin?
            </h2>

            {/* CTA Pills */}
            <motion.div
              className="mb-8 flex w-full flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <button
                onClick={() => document.getElementById("request-staff")?.scrollIntoView({ behavior: "smooth" })}
                className="motion-footer-glass-pill flex items-center gap-3 rounded-full px-10 py-4.5 font-sans text-[11px] font-medium uppercase tracking-[.25em] text-[rgba(240,238,231,0.92)] group"
              >
                Request Staff
                <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </button>

              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="motion-footer-glass-pill flex items-center gap-3 rounded-full px-10 py-4.5 font-sans text-[11px] font-medium uppercase tracking-[.25em] text-[rgba(240,238,231,0.92)]"
              >
                Contact Us
              </button>
            </motion.div>

            {/* Social links */}
            <div className="w-full max-w-xl">
              <ClipPathLinks links={FOOTER_SOCIAL_LINKS} />
            </div>

            {/* Secondary links */}
            <div className="mt-6 flex w-full flex-wrap justify-center gap-6">
              {["Privacy Policy", "Terms of Service", "Sitemap"].map((label) => (
                <button
                  key={label}
                  className="motion-footer-glass-pill rounded-full px-5 py-2.5 font-sans text-[10px] font-medium uppercase tracking-[.2em] text-[rgba(240,238,231,0.35)] hover:text-[rgba(240,238,231,0.7)]"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Bottom bar */}
          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 pb-8 px-6 md:flex-row md:px-12">
            <div className="order-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[rgba(240,238,231,0.25)] md:order-1 font-sans">
              © {new Date().getFullYear()} Grandeur Hospitality Staffing. All rights reserved.
            </div>

            <div className="motion-footer-glass-pill order-1 flex items-center gap-2 rounded-full px-6 py-2.5 md:order-2">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#e2a891]" />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[rgba(240,238,231,0.5)]">
                Private Hospitality Staffing
              </span>
            </div>

            <button
              onClick={scrollToTop}
              className="motion-footer-glass-pill order-3 flex h-11 w-11 items-center justify-center rounded-full group"
            >
              <svg className="w-4 h-4 text-[rgba(240,238,231,0.4)] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[rgba(240,238,231,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
