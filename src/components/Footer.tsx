import { motion, useReducedMotion } from "framer-motion";
import { BackgroundPaths } from "@/components/ui/background-paths";
import SweepCta from "@/components/ui/sweep-cta";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Footer — conversation billboard (DESIGN.md directive 6).
 * Charcoal py-40 rhythm, oversized Fraunces line with italic emphasis,
 * outline sweep CTA, monospace meta row, and one low-opacity terracotta
 * radial wash drifting via scale only. Link columns are muted Outfit small
 * caps that resolve to bone on hover.
 */

const INSTAGRAM_HREF =
  "https://www.instagram.com/grandeur.hospitality?stkn=d2I1ZWZtNzdzYjhz";

const LINK_COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Servers & Bartenders", href: "#services" },
      { label: "Culinary Staff", href: "#services" },
      { label: "Housekeeping", href: "#services" },
      { label: "Event Security", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Process", href: "#process" },
      { label: "Client Reviews", href: "#reviews" },
      { label: "FAQ", href: "#faq" },
      { label: "Request Staff", href: "#request-staff" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: INSTAGRAM_HREF, external: true },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/grandeur-hospitality-consulting", external: true },
      { label: "Twitter", href: "https://x.com/grandeurstaffing", external: true },
      { label: "Facebook", href: "https://facebook.com/grandeurhospitality", external: true },
    ],
  },
];

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={
          external
            ? undefined
            : (e) => {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
              }
        }
        className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#aeb8b8] transition-colors duration-200 hover:text-[#f5f1e9]"
      >
        {label}
      </a>
    </li>
  );
}

export default function Footer() {
  const reduced = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#101416]">
      {/* 21st-inspired editorial motion layer: ghost type + a restrained values ticker. */}
      <div aria-hidden="true" className="footer-art-word pointer-events-none absolute inset-x-0 bottom-2 z-[3] select-none text-center">
        GRANDEUR
      </div>
      <div aria-hidden="true" className="footer-art-marquee pointer-events-none absolute inset-x-0 top-5 z-[4] overflow-hidden">
        <div className="footer-art-marquee-track flex w-max items-center gap-10 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.35em] text-[#f1bba6]/55">
          <span>Private hospitality staffing</span><span>✦</span>
          <span>Precision in every detail</span><span>✦</span>
          <span>NYC · Long Island · Hamptons</span><span>✦</span>
          <span>Private hospitality staffing</span><span>✦</span>
          <span>Precision in every detail</span><span>✦</span>
          <span>NYC · Long Island · Hamptons</span><span>✦</span>
        </div>
      </div>

      {/* Animated path field keeps the footer tied to the site's cinematic background language. */}
      <BackgroundPaths
        showContent={false}
        intensity={1.1}
        className="pointer-events-none z-0 opacity-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,20,22,0.42), rgba(16,20,22,0.18) 55%, rgba(16,20,22,0.46))",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 12%, rgba(226,168,145,0.12), transparent 62%)",
        }}
      />

      {/* One low-opacity terracotta radial wash — scale drift only, no blur */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-15%] top-[8%] h-[46rem] w-[46rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,168,145,0.10) 0%, rgba(226,168,145,0.04) 42%, transparent 68%)",
        }}
        animate={reduced ? {} : { scale: [1, 1.06] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Billboard */}
      <section className="shell relative z-10 pb-24 pt-40" aria-labelledby="footer-cta-title">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="mb-10 font-mono text-[10px] uppercase tracking-[0.35em] text-[#aeb8b8]"
          >
            Grandeur · Since 1994
          </motion.p>

          <motion.h2
            id="footer-cta-title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="text-display-2 max-w-4xl font-legacy-serif font-light leading-[0.98] tracking-[-0.04em] text-[#f5f1e9]"
          >
            Begin the <em className="font-normal italic text-[#e2a891]">conversation.</em>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ delay: reduced ? 0 : 0.12, duration: 0.7, ease: EASE_OUT }}
            className="mt-12"
          >
            <SweepCta href="#request-staff" label="Request staff" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ delay: reduced ? 0 : 0.16, duration: 0.5, ease: EASE_OUT }}
            className="mt-16 font-mono text-[10px] uppercase tracking-[0.24em] text-[#aeb8b8]"
          >
            EST. COVERAGE · NYC / LI / HAMPTONS · 24H DESK
          </motion.p>
        </div>
      </section>

      {/* Link columns */}
      <section className="shell relative z-10 border-t border-[rgba(245,241,233,0.12)] py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr]">
          {LINK_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-[#aeb8b8]">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <FooterLink key={link.label} label={link.label} href={link.href} external={link.external} />
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>

      {/* Utility bar */}
      <div className="shell relative z-10 border-t border-[rgba(245,241,233,0.08)] py-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className={cn("font-mono text-[10px] tracking-[0.12em] text-[#aeb8b8]")}>
            © {currentYear} GRANDEUR. All rights reserved.
          </p>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#aeb8b8] transition-colors duration-200 hover:text-[#f5f1e9]"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
