import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  GalleryHorizontalEnd,
  HelpCircle,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { scrollTo } from "@/hooks/useSmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

function formatNewYorkTime() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());
}

type MenuKey = "services" | "showcase" | "resources" | null;
type ServicePreview = "services" | "process";

interface MenuItem {
  label: string;
  href: string;
  eyebrow: string;
  description: string;
  icon: typeof Sparkles;
}

const SERVICE_ITEMS: MenuItem[] = [
  {
    label: "Services",
    href: "#services",
    eyebrow: "Capability",
    description: "Front-of-house, culinary, hotel, promotional, and security teams.",
    icon: Sparkles,
  },
  {
    label: "Process",
    href: "#process",
    eyebrow: "Methodology",
    description: "A disciplined path from discovery to a fully briefed deployment.",
    icon: Workflow,
  },
];

const RESOURCE_ITEMS: MenuItem[] = [
  {
    label: "Resources",
    href: "#resources",
    eyebrow: "Playbooks",
    description: "Practical guides for planning polished hospitality operations.",
    icon: BookOpen,
  },
  {
    label: "FAQ",
    href: "#faq",
    eyebrow: "Quick answers",
    description: "The essential answers before you brief your account executive.",
    icon: HelpCircle,
  },
];

const FAQ_PREVIEW = [
  {
    question: "How quickly can staff be deployed?",
    answer: "Lead time depends on role and headcount; rapid-response requests are reviewed by the desk immediately.",
  },
  {
    question: "What engagement models do you support?",
    answer: "Planned event teams, recurring coverage, seasonal surges, and project-based hospitality support.",
  },
];

function scrollToSection(href: string, event?: MouseEvent<HTMLAnchorElement>) {
  event?.preventDefault();
  window.history.replaceState(null, "", href);
  scrollTo(href);
}

function PanelLink({ item, active, onHover }: { item: MenuItem; active: boolean; onHover: () => void }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      onClick={(event) => scrollToSection(item.href, event)}
      onMouseEnter={onHover}
      onFocus={onHover}
      className="group relative flex min-h-11 items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-xl bg-white/[0.08]"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <span className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#e2a891]">
        <Icon size={15} strokeWidth={1.5} />
      </span>
      <span className="relative min-w-0">
        <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#f5f1e9]">{item.label}</span>
        <span className="mt-1 block text-[11px] leading-[1.55] text-white/45 transition-colors group-hover:text-white/70">{item.description}</span>
      </span>
      <ArrowUpRight className="relative ml-auto mt-1 shrink-0 text-white/25 transition-colors group-hover:text-[#e2a891]" size={14} strokeWidth={1.5} />
    </a>
  );
}

function ServicesPanel({ reduced }: { reduced: boolean }) {
  const [preview, setPreview] = useState<ServicePreview>("services");
  const activeItem = SERVICE_ITEMS.find((item) => item.label.toLowerCase() === preview) ?? SERVICE_ITEMS[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
      <div>
        <p className="mb-3 px-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#e2a891]/75">Our approach</p>
        <div className="space-y-1">
          {SERVICE_ITEMS.map((item) => (
            <PanelLink
              key={item.label}
              item={item}
              active={preview === item.label.toLowerCase()}
              onHover={() => setPreview(item.label.toLowerCase() as ServicePreview)}
            />
          ))}
        </div>
      </div>

      <motion.div layout className="relative min-h-[212px] overflow-hidden rounded-2xl border border-white/10 bg-[#151b1d] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(226,168,145,0.26),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={preview}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="rounded-full border border-[#e2a891]/30 bg-[#e2a891]/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f1bba6]">
                  {activeItem.eyebrow}
                </span>
                <ShieldCheck size={18} className="text-[#e2a891]/70" strokeWidth={1.4} />
              </div>
              <p className="max-w-sm font-legacy-serif text-[27px] font-light leading-[1.05] tracking-[-0.03em] text-[#f5f1e9]">
                {preview === "services" ? "The right people, precisely briefed." : "A clear path to confident execution."}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="relative mt-8 flex items-end justify-between gap-5 border-t border-white/10 pt-4">
            <span className="max-w-[15rem] text-[11px] leading-[1.55] text-white/45">
              {preview === "services"
                ? "48h placement guarantee on select roles and markets."
                : "Discovery → Talent match → Deployment → Review."}
            </span>
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-[#e2a891]">
              {preview === "services" ? "01 / 02" : "03 / 03"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ShowcasePanel({ reduced }: { reduced: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <a
        href="#gallery"
        onClick={(event) => scrollToSection("#gallery", event)}
        className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151b1d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
      >
        <div className="relative h-36 overflow-hidden">
          <video
            className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
            src="/videos/morphing-nav-preview.mp4"
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151b1d] via-transparent to-transparent" />
          <GalleryHorizontalEnd className="absolute right-4 top-4 text-white/70" size={18} strokeWidth={1.4} />
        </div>
        <div className="p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#f5f1e9]">Project gallery</p>
          <p className="mt-2 text-[11px] leading-[1.55] text-white/45">Explore curated case studies and recent deployments.</p>
        </div>
      </a>

      <a
        href="#clients"
        onClick={(event) => scrollToSection("#clients", event)}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151b1d] p-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
      >
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-[#e2a891]/20" />
        <div className="absolute -right-1 -top-3 h-24 w-24 rounded-full border border-[#e2a891]/10" />
        <div className="relative flex h-full min-h-[196px] flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-[#e2a891]"><Users size={16} strokeWidth={1.4} /></span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Trusted roster</span>
          </div>
          <div>
            <div className="mb-4 flex -space-x-2">
              {['H', 'C', 'Y', 'F', 'R'].map((letter) => (
                <span key={letter} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#151b1d] bg-[#293437] font-mono text-[10px] text-[#f1bba6]">{letter}</span>
              ))}
            </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#f5f1e9]">Client roster</p>
            <p className="mt-2 text-[11px] leading-[1.55] text-white/45">Trusted by fast-growing startups and established hospitality teams.</p>
          </div>
        </div>
      </a>
    </div>
  );
}

function ResourcesPanel({ reduced }: { reduced: boolean }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
      <div>
        <p className="mb-3 px-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#e2a891]/75">Useful by design</p>
        <div className="space-y-1">
          {RESOURCE_ITEMS.map((item) => (
            <PanelLink key={item.label} item={item} active={false} onHover={() => undefined} />
          ))}
          <a href="#request-staff" onClick={(event) => scrollToSection("#request-staff", event)} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#e2a891]"><FileText size={15} strokeWidth={1.5} /></span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Hiring playbook</span>
            <ArrowUpRight className="ml-auto" size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#151b1d] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#f5f1e9]">Quick FAQ</p>
            <p className="mt-1 text-[11px] text-white/40">A useful first read.</p>
          </div>
          <HelpCircle size={18} className="text-[#e2a891]/70" strokeWidth={1.4} />
        </div>
        <div className="divide-y divide-white/10">
          {FAQ_PREVIEW.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <button
                key={item.question}
                type="button"
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                className="block w-full py-3 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
                aria-expanded={isOpen}
              >
                <span className="flex items-start justify-between gap-4 text-[11px] leading-[1.45] text-white/75">
                  {item.question}
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }} className="text-[#e2a891]">+</motion.span>
                </span>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: reduced ? 0 : 0.22, ease: EASE }}
                      className="block overflow-hidden pr-5 pt-2 text-[11px] leading-[1.55] text-white/40"
                    >
                      {item.answer}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MegamenuPanel({
  activeMenu,
  reduced,
  onMouseEnter,
  onMouseLeave,
}: {
  activeMenu: Exclude<MenuKey, null>;
  reduced: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: EASE }}
      className="absolute left-1/2 top-[calc(100%+0.75rem)] z-[120] w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-white/[0.12] bg-neutral-950/[0.88] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      id={`${activeMenu}-megamenu-panel`}
      data-megamenu-panel
      role="region"
      aria-label={`${activeMenu} menu`}
      tabIndex={-1}
    >
      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-l border-t border-white/[0.12] bg-neutral-950/[0.88]" />
      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, x: reduced ? 0 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
          >
            {activeMenu === "services" && <ServicesPanel reduced={reduced} />}
            {activeMenu === "showcase" && <ShowcasePanel reduced={reduced} />}
            {activeMenu === "resources" && <ResourcesPanel reduced={reduced} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DeskStatus() {
  const [open, setOpen] = useState(false);
  const [localTime, setLocalTime] = useState(() => formatNewYorkTime());
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => setLocalTime(formatNewYorkTime());
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={statusRef} className="relative hidden lg:block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onFocus={() => setOpen(true)}
        onBlur={(event) => {
          if (!statusRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
        }}
        className="group flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.22em] text-emerald-100 transition-colors hover:border-emerald-300/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300/70"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(74,222,128,0.08)]" />
        Desk open
        <ChevronDown size={12} className="text-emerald-200/60 transition-transform group-hover:translate-y-0.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18, ease: EASE }} className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-64 rounded-2xl border border-white/[0.12] bg-neutral-950/[0.92] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl" role="dialog" aria-label="Desk availability">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Office is currently online</div>
            <div className="space-y-2 border-y border-white/10 py-3 text-[11px] text-white/50">
              <p className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock3 size={13} className="text-[#e2a891]" /> Local time</span><span className="text-white/75">{localTime}</span></p>
              <p className="flex items-center justify-between"><span>Average response</span><span className="text-white/75">&lt;15 min</span></p>
              <p className="flex items-center justify-between"><span>Working hours</span><span className="text-white/75">Mon–Fri, 9–6</span></p>
            </div>
            <a href="#contact" onClick={(event) => scrollToSection("#contact", event)} className="mt-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-[#f1bba6] transition-colors hover:text-white">Book a 15-min intro call <ExternalLink size={13} strokeWidth={1.5} /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<MenuKey>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const linkClass = "rounded-xl px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.2em] text-white/75 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]";
  const go = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    scrollToSection(href, event);
    onClose();
  };

  const accordion = (key: Exclude<MenuKey, null>, label: string, items: MenuItem[]) => {
    const isExpanded = expanded === key;
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.025]">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setExpanded(isExpanded ? null : key)}
          className="flex min-h-11 w-full items-center justify-between px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]"
        >
          {label}
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.18 }}><ChevronDown size={14} /></motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/10 px-2 pb-2">
              {items.map((item) => (
                <a key={item.label} href={item.href} onClick={go(item.href)} className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-[10px] uppercase tracking-[0.16em] text-white/55 hover:bg-white/[0.06] hover:text-[#f1bba6]">
                  {item.label}<ArrowUpRight className="ml-auto" size={13} />
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.24, ease: EASE }} data-lenis-prevent className="absolute inset-x-0 top-[calc(100%+0.5rem)] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-white/[0.12] bg-neutral-950/[0.97] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl xl:hidden" role="dialog" aria-label="Mobile navigation">
          <div className="grid gap-2">
            <a href="#home" onClick={go("#home")} className={linkClass}>Home</a>
            <a href="#about" onClick={go("#about")} className={linkClass}>About</a>
            {accordion("services", "Services", SERVICE_ITEMS)}
            {accordion("showcase", "Showcase", [
              { label: "Gallery", href: "#gallery", eyebrow: "", description: "", icon: GalleryHorizontalEnd },
              { label: "Clients", href: "#clients", eyebrow: "", description: "", icon: Users },
            ])}
            {accordion("resources", "Resources", RESOURCE_ITEMS)}
            <a href="#contact" onClick={go("#contact")} className={linkClass}>Contact</a>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
            <a href="#request-staff" onClick={go("#request-staff")} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-3 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-black">Request staff <ArrowUpRight size={13} /></a>
            <div className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Desk open</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ModernMorphingNav() {
  const reduced = useReducedMotion();
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lastTriggerRef = useRef<Exclude<MenuKey, null> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setActiveMenu(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(closeMenu, reduced ? 0 : 160);
  }, [clearCloseTimer, closeMenu, reduced]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        setMobileOpen(false);
        document.getElementById(lastTriggerRef.current ? `nav-trigger-${lastTriggerRef.current}` : "")?.focus();
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyDown);
      clearCloseTimer();
    };
  }, [clearCloseTimer, closeMenu]);

  const selectMenu = useCallback((menu: Exclude<MenuKey, null>) => {
    clearCloseTimer();
    setMobileOpen(false);
    lastTriggerRef.current = menu;
    setActiveMenu((current) => (current === menu ? null : menu));
  }, [clearCloseTimer]);

  const focusPanelItem = (menu: Exclude<MenuKey, null>, last = false) => {
    window.requestAnimationFrame(() => {
      const panel = document.getElementById(`${menu}-megamenu-panel`);
      const items = panel?.querySelectorAll<HTMLElement>("a, button");
      items?.[last ? items.length - 1 : 0]?.focus();
    });
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, menu: Exclude<MenuKey, null>) => {
    const menus = ["services", "showcase", "resources"] as const;
    const currentIndex = menus.indexOf(menu);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      selectMenu(menu);
      focusPanelItem(menu, event.key === "ArrowUp");
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextMenu = menus[(currentIndex + direction + menus.length) % menus.length];
      document.getElementById(`nav-trigger-${nextMenu}`)?.focus();
    }
  };

  const handleNavKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      closeMenu();
      setMobileOpen(false);
      document.getElementById(lastTriggerRef.current ? `nav-trigger-${lastTriggerRef.current}` : "")?.focus();
      return;
    }
    const panel = (event.target as HTMLElement).closest<HTMLElement>("[data-megamenu-panel]");
    if (panel && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      const items = panel.querySelectorAll<HTMLElement>("a, button");
      items[event.key === "End" ? items.length - 1 : 0]?.focus();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setMobileOpen(false);
      else setActiveMenu(null);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeMenu]);

  const toggleMobile = () => {
    clearCloseTimer();
    setActiveMenu(null);
    setMobileOpen((open) => !open);
  };

  return (
    <motion.header
      ref={navRef}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.15, ease: EASE }}
      className="pointer-events-none fixed inset-x-0 top-3 z-[100] px-3 sm:px-6 lg:top-4 lg:px-8"
      onKeyDown={handleNavKeyDown}
    >
      <div className={`pointer-events-auto relative mx-auto max-w-[90rem] rounded-2xl border px-4 transition-all duration-500 sm:px-5 lg:px-6 ${scrolled ? "border-white/20 bg-[#101416]/90 shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl" : "border-white/[0.12] bg-[#101416]/70 backdrop-blur-md"}`}>
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          <a href="#home" onClick={(event) => scrollToSection("#home", event)} data-magnetic data-magnetic-color="#f1bba6" className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]" aria-label="Grandeur home">
            <img src="/grandeur-logo.png" alt="Grandeur" className="h-10 w-10 object-contain sm:h-11 sm:w-11" />
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-[#f5f1e9] lg:inline">Grandeur</span>
          </a>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
            <a href="#about" onClick={(event) => scrollToSection("#about", event)} className="rounded-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-[#f1bba6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891]">About</a>
            {(["services", "showcase", "resources"] as const).map((menu) => (
              <div
                key={menu}
                className="relative"
                onMouseEnter={() => {
                  clearCloseTimer();
                  setActiveMenu(menu);
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  id={`nav-trigger-${menu}`}
                  type="button"
                  aria-expanded={activeMenu === menu}
                  aria-haspopup="true"
                  aria-controls={`${menu}-megamenu-panel`}
                  onFocus={() => selectMenu(menu)}
                  onClick={() => selectMenu(menu)}
                  onKeyDown={(event) => handleTriggerKeyDown(event, menu)}
                  className={`flex min-h-11 items-center gap-1 rounded-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891] ${activeMenu === menu ? "text-[#f1bba6]" : "text-white/65 hover:text-[#f1bba6]"}`}
                >
                  {menu === "showcase" ? "Showcase" : menu}
                  <motion.span animate={{ rotate: activeMenu === menu ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}><ChevronDown size={12} /></motion.span>
                </button>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <DeskStatus />
            <a href="#contact" onClick={(event) => scrollToSection("#contact", event)} className="hidden px-2 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-[#f1bba6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891] sm:inline-flex">Contact</a>
            <a href="#request-staff" onClick={(event) => scrollToSection("#request-staff", event)} data-magnetic data-magnetic-color="#101416" className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-black shadow-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:inline-flex">Request staff <ArrowUpRight size={13} strokeWidth={1.8} /></a>
            <button type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} onClick={toggleMobile} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-[#e2a891]/60 hover:text-[#f1bba6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e2a891] xl:hidden">
              {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <div className="pointer-events-auto absolute inset-x-0 top-full h-6" onMouseEnter={clearCloseTimer} onMouseLeave={scheduleClose} aria-hidden="true" />
        <AnimatePresence>{activeMenu && <MegamenuPanel activeMenu={activeMenu} reduced={Boolean(reduced)} onMouseEnter={clearCloseTimer} onMouseLeave={scheduleClose} />}</AnimatePresence>
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </motion.header>
  );
}
