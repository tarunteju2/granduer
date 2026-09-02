import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  UtensilsCrossed,
  ChefHat,
  BedDouble,
  Sparkles,
  ShieldCheck,
  Phone
} from "lucide-react";
import { NAV_LINKS, SERVICES, OFFICES } from "@/data/content";

const menuEase = [0.16, 1, 0.3, 1] as const;
const panelEase = [0.76, 0, 0.24, 1] as const;
const primaryLinks = NAV_LINKS.filter((link) => link.href !== "#home");

// Service icons mapping
const SERVICE_ICONS = {
  servers: UtensilsCrossed,
  cooks: ChefHat,
  housekeepers: BedDouble,
  promo: Sparkles,
  security: ShieldCheck,
};

/** Section IDs for intersection observer */
const SECTION_IDS = primaryLinks.map(link => link.href.replace('#', ''));

/** Enhanced navigation with sticky blur, active section highlight, mega-menu, and full WCAG 2.1 AA accessibility */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection using Intersection Observer
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: [0.3],
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    // Set home as active initially
    setActiveSection('home');

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Handle mobile menu open/close with focus management
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }

      // Trap focus within mobile menu
      if (event.key === "Tab" && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    // Focus first item after animation
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 400);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Handle services dropdown with keyboard navigation
  useEffect(() => {
    if (!servicesOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [servicesOpen]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setMobileServicesOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  }, [closeMenu]);

  // Check if a link is active
  const isActive = (href: string) => {
    const sectionId = href.replace('#', '');
    return activeSection === sectionId;
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: menuEase }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-11 lg:px-7"
      >
        <nav
          aria-label="Primary navigation"
          className={`mx-auto flex max-w-320 items-center justify-between border px-5 py-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:px-7 ${
            scrolled
              ? "border-white/20 bg-neutral-900/95 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md"
              : "border-white/16 bg-neutral-900/82 backdrop-blur-md"
          }`}
        >
          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            className="group inline-flex items-center gap-3 text-white/80 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <Menu
                size={18}
                strokeWidth={1.4}
                className={`absolute transition-all duration-500 ${open ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
              />
              <X
                size={18}
                strokeWidth={1.4}
                className={`absolute transition-all duration-500 ${open ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0"}`}
              />
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] sm:inline">Menu</span>
          </button>

          {/* Logo - centered on mobile, left on desktop */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
            className="absolute left-1/2 -translate-x-1/1 lg:static lg:translate-x-0 lg:mx-auto"
            aria-label="Grandeur home"
          >
            <img
              src="/grandeur-logo.png"
              alt="Grandeur"
              className="h-10 w-10 rounded-full object-cover object-center sm:h-11 sm:w-11"
            />
          </a>

          {/* Desktop navigation - hidden on mobile */}
          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.href === '#services' ? (
                  // Services dropdown trigger
                  <div className="relative">
                    <button
                      ref={servicesButtonRef}
                      type="button"
                      onClick={() => setServicesOpen(!servicesOpen)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setServicesOpen(!servicesOpen);
                        }
                      }}
                      className={`flex items-center gap-1 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-lg ${
                        isActive(link.href)
                          ? "text-gold-400"
                          : "text-white/70 hover:text-white"
                      }`}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        size={12}
                        strokeWidth={2}
                        className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Services Mega Menu */}
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          ref={servicesMenuRef}
                          initial={{ opacity: 0, y: -8, scaleY: 0.94, transformOrigin: "top" }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
                          transition={{ duration: 0.32, ease: menuEase }}
                          className="absolute left-1/2 top-full mt-2 -translate-x-1/2"
                          role="menu"
                          aria-label="Services menu"
                        >
                          <div className="w-[min(90vw,560px)] rounded-2xl border border-white/12 bg-neutral-900/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                            <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-white/30">Our Services</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {SERVICES.map((service, index) => {
                                const Icon = SERVICE_ICONS[service.id as keyof typeof SERVICE_ICONS];
                                return (
                                  <motion.a
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.035, duration: 0.24, ease: menuEase }}
                                    key={service.id}
                                    href="#services"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      scrollToSection('#services');
                                      setServicesOpen(false);
                                    }}
                                    className="group flex items-start gap-4 rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-white/12 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                                    role="menuitem"
                                  >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] transition-colors group-hover:bg-gold-400/10">
                                      {Icon && <Icon size={18} strokeWidth={1.4} className="text-gold-400" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[11px] uppercase tracking-[0.2em] text-gold-400/80">{service.shortTitle}</p>
                                      <p className="mt-1 text-[13px] leading-snug text-white/70 group-hover:text-white">{service.title}</p>
                                    </div>
                                    <ArrowUpRight size={14} strokeWidth={1.5} className="mt-1 shrink-0 text-white/30 transition-colors group-hover:text-gold-400" />
                                  </motion.a>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded-lg ${
                      isActive(link.href)
                        ? "text-gold-400"
                        : "text-white/70 hover:text-white"
                    }`}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="#request-staff"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#request-staff');
            }}
            className="hidden border-b border-gold-400/60 pb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-400 transition-colors hover:border-white hover:text-white sm:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          >
            Request staff
          </a>
        </nav>
      </motion.header>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#080a0b]/72 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: menuEase }}
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.72, ease: panelEase }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(88vw,22rem)] flex-col overflow-y-auto border-r border-white/12 bg-[#101416] px-7 pb-8 pt-28 shadow-[20px_0_80px_rgba(0,0,0,.35)] sm:px-10"
          >
            <div className="mb-10 flex items-start justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src="/grandeur-logo.png"
                  alt=""
                  className="h-12 w-12 rounded-full object-cover object-center"
                />
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gold-400/75">Grandeur Hospitality</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/30">Navigate the house</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center text-white/55 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-lg"
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.25} />
              </button>
            </div>

            <nav aria-label="Menu links" className="flex-1">
              <ul className="space-y-1">
                {primaryLinks.map((link, index) => (
                  <li key={link.href}>
                    {link.href === '#services' ? (
                      // Services with expandable submenu
                      <div>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="group flex w-full items-center justify-between border-b border-white/8 py-4 text-[clamp(1.2rem,4vw,1.6rem)] font-light tracking-[-0.02em] text-white/76 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-lg"
                          aria-expanded={mobileServicesOpen}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            size={18}
                            strokeWidth={1.25}
                            className={`text-gold-400/0 transition-all duration-500 ${mobileServicesOpen ? 'rotate-180 text-gold-400' : 'group-hover:text-gold-400/60'}`}
                          />
                        </button>

                        {/* Mobile services submenu */}
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: menuEase }}
                              className="overflow-hidden"
                            >
                              <ul className="ml-4 space-y-1 border-l border-white/8 pl-4 py-2">
                                {SERVICES.map((service) => {
                                  const Icon = SERVICE_ICONS[service.id as keyof typeof SERVICE_ICONS];
                                  return (
                                    <li key={service.id}>
                                      <a
                                        href="#services"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          scrollToSection('#services');
                                        }}
                                        className="flex items-center gap-3 py-2 text-[13px] text-white/55 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                                      >
                                        {Icon && <Icon size={14} strokeWidth={1.4} className="text-gold-400/60" />}
                                        {service.shortTitle}
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.a
                        href={link.href}
                        ref={index === 0 ? firstFocusableRef : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ delay: 0.12 + index * 0.055, duration: 0.55, ease: menuEase }}
                        className={`group flex items-center justify-between border-b border-white/8 py-4 text-[clamp(1.2rem,4vw,1.6rem)] font-light tracking-[-0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-lg ${
                          isActive(link.href) ? 'text-gold-400' : 'text-white/76 hover:text-gold-400'
                        }`}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight
                          size={18}
                          strokeWidth={1.25}
                          className="translate-x-2 text-gold-400/0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-gold-400"
                          aria-hidden="true"
                        />
                      </motion.a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile CTA and contact */}
            <div className="mt-10 space-y-6 border-t border-white/10 pt-6">
              <a
                href="#request-staff"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#request-staff');
                }}
                className="flex items-center gap-3 border-b border-gold-400/50 pb-1 text-[11px] uppercase tracking-[0.22em] text-gold-400 transition-colors hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
              >
                Start a request
              </a>

              <div className="space-y-3">
                {OFFICES.map((office) => (
                  <a
                    key={office.name}
                    href={`tel:${office.phone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-2 text-[11px] text-white/40 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                  >
                    <Phone size={12} strokeWidth={1.5} />
                    <span>{office.phone}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Skip to main content link for accessibility */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('#home');
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
    </>
  );
}
