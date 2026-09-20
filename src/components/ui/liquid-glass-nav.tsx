/**
 * Liquid Glass Navigation — Grandeur hairline glass strip (DESIGN.md directive 4)
 *
 * - Single backdrop-blur layer, 8px max, rgba(16,20,22,0.72)
 * - Bottom hairline rule rgba(245,241,233,0.08)
 * - After the CTA: terracotta dot + Outfit uppercase micro-label "DESK OPEN"
 * - Link hover: bone -> terracotta 0.2s; 1px underline via scaleX only
 */

import { useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NAV_LINKS } from "@/data/content";
import { scrollTo } from "@/hooks/useSmoothScroll";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  label: string;
  href: string;
  isActive: boolean;
  onSelect: (href: string) => void;
}

function NavLink({ label, href, isActive, onSelect }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onSelect(href);
      }}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "group relative px-1 py-2 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors duration-200",
        isActive ? "text-[#f5f1e9]" : "text-[#f5f1e9]/70 hover:text-[#e2a891]",
      )}
    >
      {label}
      {/* 1px underline — scaleX only */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-1 bottom-0 h-px origin-left bg-[#e2a891] transition-transform duration-[250ms] ease-out",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </a>
  );
}

export default function LiquidGlassNav() {
  const [activeTab, setActiveTab] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const reduced = useReducedMotion();

  // Track scroll state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach((link) => {
      const element = document.getElementById(link.href.slice(1));
      if (!element) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            setActiveTab(link.href.slice(1));
          }
        },
        { rootMargin: "-18% 0px -65% 0px", threshold: [0.25] },
      );
      observer.observe(element);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const id = href.slice(1);
    setActiveTab(id);
    window.history.replaceState(null, "", href);
    scrollTo(href);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[100]"
    >
      <div
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16"
        style={{
          background: isScrolled ? "rgba(16, 20, 22, 0.78)" : "rgba(16, 20, 22, 0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(245, 241, 233, 0.08)",
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#home");
          }}
          data-magnetic
          data-magnetic-color="#f1bba6"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
          aria-label="Grandeur home"
        >
          <img src="/grandeur-logo.png" alt="Grandeur" className="h-10 w-10 object-contain" />
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-[#f5f1e9] lg:inline">
            Grandeur
          </span>
        </a>

        {/* Navigation links */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              label={link.label}
              href={link.href}
              isActive={activeTab === link.href.slice(1)}
              onSelect={scrollToSection}
            />
          ))}
        </nav>

        {/* CTA + desk status micro-label */}
        <div className="flex items-center gap-4">
          <a
            href="#request-staff"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#request-staff");
            }}
            data-magnetic
            data-magnetic-color="#f1bba6"
            className="border border-[#f5f1e9]/35 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f5f1e9] transition-colors duration-200 hover:border-[#e2a891] hover:text-[#e2a891] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
          >
            Request staff
          </a>

          {/* Desk status */}
          <span className="hidden items-center gap-2 lg:flex" aria-label="Reservations desk open">
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-[#e2a891]"
              animate={reduced ? { opacity: 1 } : { opacity: [1, 0.4, 1] }}
              transition={
                reduced ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#849093]">
              Desk open
            </span>
          </span>
        </div>
      </div>
    </motion.header>
  );
}
