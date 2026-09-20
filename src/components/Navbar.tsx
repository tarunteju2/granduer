import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Users, Workflow, Info, CircleHelp } from "lucide-react";
import { NAV_LINKS } from "@/data/content";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const ease = [0.16, 1, 0.3, 1] as const;
const NAV_ICONS = [Home, Users, Workflow, Info, CircleHelp];
const TUBELIGHT_NAV_ITEMS = NAV_LINKS.map((link, index) => ({
  name: link.label,
  url: link.href,
  icon: NAV_ICONS[index],
}));

/** Grandeur's responsive navigation and primary conversion action. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_LINKS.forEach((link) => {
      const element = document.getElementById(link.href.slice(1));
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            setActiveSection(link.href.slice(1));
          }
        },
        { rootMargin: "-18% 0px -65% 0px", threshold: [0.25] },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const scrollToSection = (href: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);
    setActiveSection(href.slice(1));
    window.history.replaceState(null, "", href);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTubelightNavigate = (url: string, event: MouseEvent<HTMLAnchorElement>) => {
    scrollToSection(url, event);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease }}
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] px-4 sm:px-7"
    >
      <div
        className={`pointer-events-auto mx-auto max-w-320 border px-4 py-3 transition-all duration-700 lg:px-6 ${
          scrolled
            ? "border-white/20 bg-[#101416]/95 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md"
            : "border-white/12 bg-[#101416]/70 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={(event) => scrollToSection("#home", event)}
            className="flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a891]"
            aria-label="Grandeur home"
          >
            <img src="/grandeur-logo.png" alt="Grandeur" className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10" />
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-white/70 lg:inline">Grandeur</span>
          </a>

          <div className="hidden min-w-0 flex-1 justify-center xl:flex">
            <NavBar
              items={TUBELIGHT_NAV_ITEMS}
              activeName={NAV_LINKS.find((link) => link.href.slice(1) === activeSection)?.label ?? "Home"}
              onNavigate={handleTubelightNavigate}
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <a
              href="#request-staff"
              onClick={(event) => scrollToSection("#request-staff", event)}
              className="hidden min-h-10 items-center border border-[#e2a891]/70 px-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f1bba6] transition-colors hover:bg-[#e2a891] hover:text-[#101416] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a891] sm:inline-flex"
            >
              Request staff
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-[#e2a891]/60 hover:text-[#e2a891] xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" className="mt-4 grid grid-cols-2 gap-1 border-t border-white/10 pt-3 xl:hidden" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => scrollToSection(link.href, event)}
                className={`px-3 py-3 text-[10px] font-medium uppercase tracking-[0.14em] ${activeSection === link.href.slice(1) ? "text-[#e2a891]" : "text-white/60"}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </motion.header>
  );
}
