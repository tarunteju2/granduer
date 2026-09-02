import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  ChevronDown,
  Check,
  Menu,
  X,
} from "lucide-react";
import { COMPANY, NAV_LINKS, OFFICES, SERVICES, CLIENT_TYPES } from "@/data/content";

/** Footer columns configuration */
const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: SERVICES.map((s) => ({ label: s.shortTitle, href: "#services" })),
  },
  {
    title: "Industries",
    links: CLIENT_TYPES.map((c) => ({ label: c, href: "#clients" })),
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Process", href: "#process" },
      { label: "Gallery", href: "#gallery" },
      { label: "Resources", href: "#resources" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

/** Social links configuration */
const SOCIAL_LINKS = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
];

/** Office location data for map markers */
const OFFICE_LOCATIONS = [
  { id: "nyc", name: "NYC Office", lat: 40.758, lng: -73.985, region: "New York" },
  { id: "miami", name: "South Florida", lat: 25.968, lng: -80.128, region: "Miami" },
];

/** Scroll to section helper */
const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

/** Interactive mini-map component */
function OfficeMapMini() {
  const [activeOffice, setActiveOffice] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentOffice = OFFICES[activeOffice];

  // Auto-rotate between offices
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveOffice((prev) => (prev + 1) % OFFICES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="relative rounded-xl border border-white/10 bg-neutral-900/50 p-5 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Map background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {/* Stylized US East Coast */}
          <path
            d="M50,180 Q100,170 150,160 L200,150 Q250,140 300,120 L350,100 Q380,90 400,80 L400,200 L50,200 Z"
            fill="url(#mapGradient)"
            opacity="0.3"
          />
          {/* Florida peninsula */}
          <path
            d="M280,100 Q300,90 310,100 L320,130 Q330,160 310,180 L290,170 Q275,140 280,100"
            fill="url(#mapGradient)"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2a891" />
              <stop offset="100%" stopColor="#bd725f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Map markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        {OFFICE_LOCATIONS.map((office, index) => (
          <button
            key={office.id}
            onClick={() => setActiveOffice(index)}
            className={`absolute transition-all duration-500 ${
              index === 0 ? "left-[30%] top-[40%]" : "left-[55%] top-[55%]"
            } ${activeOffice === index ? "scale-125 z-10" : "scale-100 z-0"}`}
            aria-label={`Select ${office.name}`}
          >
            <motion.div
              animate={{
                scale: activeOffice === index ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: activeOffice === index ? Infinity : 0,
                ease: "easeInOut",
              }}
              className={`relative ${activeOffice === index ? "text-gold-400" : "text-white/40"}`}
            >
              <MapPin size={20} strokeWidth={1.5} />
              <span className="absolute -inset-2 rounded-full bg-gold-400/20 blur-sm" />
            </motion.div>
          </button>
        ))}
      </div>

      {/* Office info overlay */}
      <div className="relative mt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeOffice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-gold-400" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400">
                {currentOffice.serves}
              </span>
            </div>
            <h4 className="font-serif text-lg font-light text-white">{currentOffice.name}</h4>
            <address className="mt-2 not-italic text-[11px] leading-relaxed text-white/50">
              {currentOffice.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </motion.div>
        </AnimatePresence>

        {/* Office selector dots */}
        <div className="mt-4 flex gap-2">
          {OFFICES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveOffice(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeOffice === index
                  ? "w-6 bg-gold-400"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`View office ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Newsletter signup component */
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      inputRef.current?.focus();
      return;
    }

    // Simulate submission
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-6">
      <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400/80 mb-3">
        Industry Insights
      </h4>
      <p className="text-[12px] leading-relaxed text-white/55 mb-5">
        Staffing updates, hiring trends, and hospitality news delivered to your inbox.
      </p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 text-gold-400"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400/20">
              <Check size={16} strokeWidth={2} />
            </div>
            <span className="text-[12px]">You're on the list</span>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full rounded-lg border bg-white/[0.03] px-4 py-3 text-[13px] text-white placeholder:text-white/25 transition-colors focus:border-gold-400/60 focus:outline-none focus:ring-1 focus:ring-gold-400/30 ${
                  error ? "border-red-500/60" : "border-white/10"
                }`}
                aria-label="Email address"
                aria-describedby={error ? "email-error" : undefined}
                aria-invalid={!!error}
              />
              {error && (
                <p id="email-error" className="absolute -bottom-5 left-0 text-[10px] text-red-400">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gold-400/90 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-900 transition-all hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Subscribe
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Mobile accordion column */
function MobileColumn({
  title,
  links,
  defaultOpen = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <div className="border-b border-white/8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-gold-400" : ""}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ height: isOpen ? contentHeight : 0 }}
      >
        <div ref={contentRef} className="pb-4">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-[13px] text-white/45 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Main Footer component */
export default function Footer() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/6 bg-black" role="contentinfo">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-300 px-6 py-24 lg:px-8">
        {/* Top section - brand and main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center lg:text-left lg:grid lg:grid-cols-2 lg:items-center lg:gap-12"
        >
          <div>
            <span className="font-serif text-4xl font-light tracking-[0.15em] text-white uppercase">
              Grandeur
            </span>
            <p className="mt-4 text-[11px] text-white/30 uppercase tracking-[0.25em] max-w-md">
              {COMPANY.tagline}
            </p>
          </div>

          <div className="mt-8 lg:mt-0 lg:text-right">
            <a
              href="#request-staff"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#request-staff");
              }}
              className="cta-premium inline-flex items-center gap-3 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
            >
              Request Staff
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>

        {/* Desktop multi-column layout */}
        <div className="hidden lg:block">
          <div className="grid gap-16 xl:grid-cols-[1fr_1.5fr_1fr]">
            {/* Left column - Navigation */}
            <div>
              <nav aria-label="Footer navigation">
                <ul className="space-y-4">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }}
                        className="group inline-flex items-center gap-2 text-[13px] text-white/40 uppercase tracking-wider transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                      >
                        {link.label}
                        <ArrowUpRight
                          size={12}
                          strokeWidth={1.5}
                          className="opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Center column - Services grid */}
            <div className="grid gap-12 sm:grid-cols-2">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400/60">
                    {column.title}
                  </h3>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(link.href);
                          }}
                          className="text-[13px] text-white/40 uppercase tracking-wider transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right column - Office map */}
            <div>
              <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400/60">
                Office Locations
              </h3>
              <OfficeMapMini />
            </div>
          </div>
        </div>

        {/* Mobile accordion layout */}
        <div className="lg:hidden">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex w-full items-center justify-between border-b border-white/8 py-5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
            aria-expanded={mobileMenuOpen}
          >
            <span>Quick Links</span>
            <Menu size={16} strokeWidth={1.5} className={mobileMenuOpen ? "hidden" : ""} />
            <X size={16} strokeWidth={1.5} className={mobileMenuOpen ? "" : "hidden"} />
          </button>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="py-6 space-y-0">
                  {FOOTER_COLUMNS.map((column) => (
                    <MobileColumn key={column.title} title={column.title} links={column.links} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile office selector */}
          <div className="mt-8">
            <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400/60">
              Office Locations
            </h3>
            <OfficeMapMini />
          </div>

          {/* Mobile newsletter */}
          <div className="mt-8">
            <NewsletterSignup />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 editorial-rule" />

        {/* Bottom section */}
        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Contact info */}
          <div className="space-y-4">
            {OFFICES.map((office) => (
              <address
                key={office.name}
                className="not-italic text-[12px] text-white/40 leading-relaxed"
              >
                <span className="block font-medium uppercase tracking-wider text-white/60">
                  {office.name}
                </span>
                {office.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                  <a
                    href={`tel:${office.phone.replace(/[^+\d]/g, "")}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                  >
                    <Phone size={12} strokeWidth={1.5} />
                    {office.phone}
                  </a>
                  <a
                    href={`mailto:${office.email}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                  >
                    <Mail size={12} strokeWidth={1.5} />
                    {office.email}
                  </a>
                </div>
              </address>
            ))}
          </div>

          {/* Social links and legal */}
          <div className="flex flex-col items-start sm:items-end gap-6">
            {/* Social links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/45 transition-all hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>

            {/* Copyright and legal */}
            <div className="text-center sm:text-right">
              <p className="text-[10px] text-white/25 uppercase tracking-[0.2em]">
                &copy; {year} {COMPANY.name}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-4 sm:justify-end">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#home");
                  }}
                  className="text-[10px] text-white/25 uppercase tracking-[0.15em] transition-colors hover:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                >
                  Privacy Policy
                </a>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#home");
                  }}
                  className="text-[10px] text-white/25 uppercase tracking-[0.15em] transition-colors hover:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                >
                  Terms of Service
                </a>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#home");
                  }}
                  className="text-[10px] text-white/25 uppercase tracking-[0.15em] transition-colors hover:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
                >
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop newsletter (hidden on mobile) */}
        <div className="hidden lg:block mt-16">
          <div className="grid gap-12 xl:grid-cols-2">
            <NewsletterSignup />
            <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-6">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-400/80 mb-3">
                Connect With Us
              </h4>
              <p className="text-[12px] leading-relaxed text-white/55 mb-5">
                Follow us for industry insights, behind-the-scenes glimpses, and updates on our latest placements.
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white/45 transition-all hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                    >
                      <Icon size={18} strokeWidth={1.5} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
