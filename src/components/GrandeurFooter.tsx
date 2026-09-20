/**
 * Grandeur Footer Component
 *
 * Luxury glassmorphic footer with:
 * - Giant "GRANDEUR" liquid glass typography centerpiece
 * - Three-column navigation layout
 * - Transparent background for silk-satin background integration
 * - Hover micro-interactions
 *
 * @see https://framer.com/motion
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import { COMPANY, OFFICES } from "@/data/content";

// ============================================
// Types
// ============================================

interface FooterConfig {
  brand: {
    name: string;
    tagline: string;
    creator: string;
    creatorUrl: string;
  };
  navigationColumns: {
    primary: { title: string; links: { label: string; href: string }[] };
    secondary: { title: string; links: { label: string; href: string; external?: boolean }[] };
  };
  socials: {
    label: string;
    href: string;
    icon: typeof Instagram;
  }[];
  legal: { label: string; href: string }[];
}

// ============================================
// Configuration
// ============================================

const FOOTER_CONFIG: FooterConfig = {
  brand: {
    name: "GRANDEUR",
    tagline: "Premium Hospitality Staffing Since 1994",
    creator: "Grandeur Hospitality Staffing",
    creatorUrl: "mailto:joegrandeur@yahoo.com",
  },
  navigationColumns: {
    primary: {
      title: "Services",
      links: [
        { label: "Servers & Bartenders", href: "#services" },
        { label: "Culinary Staff", href: "#services" },
        { label: "Housekeeping", href: "#services" },
        { label: "Event Security", href: "#services" },
        { label: "Staff Calculator", href: "#calculator" },
      ],
    },
    secondary: {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Our Process", href: "#process" },
        { label: "Client Reviews", href: "#reviews" },
        { label: "Gallery", href: "#gallery" },
        { label: "FAQ", href: "#faq" },
      ],
    },
  },
  socials: [
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "LinkedIn", href: "#", icon: Linkedin },
    { label: "Facebook", href: "#", icon: Facebook },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

// ============================================
// Sub-Components
// ============================================

interface NavLinkProps {
  label: string;
  href: string;
  external?: boolean;
  index: number;
}

function NavLink({ label, href, external, index }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <a
        href={href}
        onClick={(e) => {
          if (!external && href.startsWith("#")) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors duration-300"
      >
        <span
          className="transition-transform duration-200"
          style={{ transform: isHovered ? "translateX(4px)" : "translateX(0)" }}
        >
          {label}
        </span>
        <ArrowUpRight
          size={12}
          strokeWidth={2}
          className="transition-all duration-200 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
        />
      </a>
    </motion.li>
  );
}

interface SocialLinkProps {
  label: string;
  href: string;
  Icon: typeof Instagram;
  index: number;
}

function SocialLink({ label, href, Icon, index }: SocialLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300"
      >
        <Icon
          size={16}
          strokeWidth={1.5}
          className="transition-transform duration-200"
          style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
        />
        <span>{label}</span>
        <ExternalLink
          size={10}
          strokeWidth={2}
          className="opacity-0 group-hover:opacity-50 transition-opacity"
        />
      </a>
    </motion.li>
  );
}

// ============================================
// Botanical Overlay Component
// ============================================

interface BotanicalOverlayProps {
  variant?: "subtle" | "moderate" | "rich";
}

function BotanicalOverlay({ variant = "rich" }: BotanicalOverlayProps) {
  // Increased opacity for visibility
  const opacity = variant === "subtle" ? 0.25 : variant === "moderate" ? 0.4 : 0.6;
  const strokeWidth = variant === "subtle" ? 1 : variant === "moderate" ? 1.5 : 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1400 500"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          {/* Gradient for vines */}
          <linearGradient id="vineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`rgba(226, 168, 145, ${opacity})`} />
            <stop offset="50%" stopColor={`rgba(241, 187, 166, ${opacity * 1.2})`} />
            <stop offset="100%" stopColor={`rgba(226, 168, 145, ${opacity})`} />
          </linearGradient>
          {/* Gradient for leaves */}
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`rgba(226, 168, 145, ${opacity})`} />
            <stop offset="100%" stopColor={`rgba(200, 140, 120, ${opacity * 0.8})`} />
          </linearGradient>
        </defs>

        {/* Left side botanical */}
        <g stroke="url(#vineGradient)" strokeWidth={strokeWidth} fill="url(#leafGradient)">
          {/* Main vine stem - left side, flowing vertically */}
          <path
            d="M-20 0 Q80 80, 60 150 T80 250 Q100 350, 60 420 T80 500"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branching vine */}
          <path
            d="M60 180 Q120 160, 150 200 T200 180 Q280 220, 320 180"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M60 280 Q130 260, 160 300 T220 280 Q300 320, 340 280"
            strokeLinecap="round"
            fill="none"
          />

          {/* Large leaves */}
          <ellipse cx="60" cy="120" rx="35" ry="18" transform="rotate(-25 60 120)" />
          <ellipse cx="75" cy="200" rx="30" ry="15" transform="rotate(15 75 200)" />
          <ellipse cx="55" cy="290" rx="38" ry="20" transform="rotate(-20 55 290)" />
          <ellipse cx="70" cy="370" rx="32" ry="16" transform="rotate(25 70 370)" />
          <ellipse cx="60" cy="450" rx="28" ry="14" transform="rotate(-15 60 450)" />

          {/* Medium leaves */}
          <ellipse cx="120" cy="160" rx="22" ry="11" transform="rotate(30 120 160)" />
          <ellipse cx="150" cy="240" rx="18" ry="9" transform="rotate(-35 150 240)" />
          <ellipse cx="110" cy="320" rx="25" ry="12" transform="rotate(20 110 320)" />
          <ellipse cx="160" cy="400" rx="20" ry="10" transform="rotate(-25 160 400)" />

          {/* Small accent leaves */}
          <ellipse cx="200" cy="175" rx="15" ry="7" transform="rotate(40 200 175)" />
          <ellipse cx="230" cy="275" rx="12" ry="6" transform="rotate(-30 230 275)" />
          <ellipse cx="210" cy="370" rx="14" ry="7" transform="rotate(35 210 370)" />

          {/* Decorative berries */}
          <circle cx="90" cy="145" r="4" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="85" cy="245" r="3" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="95" cy="335" r="4" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="130" cy="195" r="2.5" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="180" cy="295" r="2" fill={`rgba(226, 168, 145, ${opacity})`} />
        </g>

        {/* Right side botanical (mirrored) */}
        <g stroke="url(#vineGradient)" strokeWidth={strokeWidth} fill="url(#leafGradient)">
          {/* Main vine stem - right side */}
          <path
            d="M1420 0 Q1320 80, 1340 150 T1320 250 Q1300 350, 1340 420 T1320 500"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branching vine */}
          <path
            d="M1340 180 Q1280 160, 1250 200 T1180 180 Q1100 220, 1060 180"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M1340 280 Q1270 260, 1240 300 T1180 280 Q1100 320, 1060 280"
            strokeLinecap="round"
            fill="none"
          />

          {/* Large leaves */}
          <ellipse cx="1340" cy="120" rx="35" ry="18" transform="rotate(25 1340 120)" />
          <ellipse cx="1325" cy="200" rx="30" ry="15" transform="rotate(-15 1325 200)" />
          <ellipse cx="1345" cy="290" rx="38" ry="20" transform="rotate(20 1345 290)" />
          <ellipse cx="1330" cy="370" rx="32" ry="16" transform="rotate(-25 1330 370)" />
          <ellipse cx="1340" cy="450" rx="28" ry="14" transform="rotate(15 1340 450)" />

          {/* Medium leaves */}
          <ellipse cx="1280" cy="160" rx="22" ry="11" transform="rotate(-30 1280 160)" />
          <ellipse cx="1250" cy="240" rx="18" ry="9" transform="rotate(35 1250 240)" />
          <ellipse cx="1290" cy="320" rx="25" ry="12" transform="rotate(-20 1290 320)" />
          <ellipse cx="1240" cy="400" rx="20" ry="10" transform="rotate(25 1240 400)" />

          {/* Small accent leaves */}
          <ellipse cx="1200" cy="175" rx="15" ry="7" transform="rotate(-40 1200 175)" />
          <ellipse cx="1170" cy="275" rx="12" ry="6" transform="rotate(30 1170 275)" />
          <ellipse cx="1190" cy="370" rx="14" ry="7" transform="rotate(-35 1190 370)" />

          {/* Decorative berries */}
          <circle cx="1310" cy="145" r="4" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="1315" cy="245" r="3" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="1305" cy="335" r="4" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="1270" cy="195" r="2.5" fill={`rgba(226, 168, 145, ${opacity})`} />
          <circle cx="1220" cy="295" r="2" fill={`rgba(226, 168, 145, ${opacity})`} />
        </g>

        {/* Top decorative arch */}
        <g stroke={`rgba(226, 168, 145, ${opacity * 0.7})`} strokeWidth={strokeWidth * 0.8} fill="none">
          <path
            d="M400 0 Q500 -40, 600 10 T800 10 Q900 -40, 1000 0"
            strokeLinecap="round"
          />
          <ellipse cx="500" cy="-10" rx="25" ry="12" transform="rotate(-30 500 -10)" fill={`rgba(226, 168, 145, ${opacity * 0.5})`} />
          <ellipse cx="600" cy="-5" rx="18" ry="9" transform="rotate(0 600 -5)" fill={`rgba(226, 168, 145, ${opacity * 0.5})`} />
          <ellipse cx="700" cy="-5" rx="20" ry="10" transform="rotate(0 700 -5)" fill={`rgba(226, 168, 145, ${opacity * 0.5})`} />
          <ellipse cx="800" cy="-5" rx="18" ry="9" transform="rotate(0 800 -5)" fill={`rgba(226, 168, 145, ${opacity * 0.5})`} />
          <ellipse cx="900" cy="-10" rx="25" ry="12" transform="rotate(30 900 -10)" fill={`rgba(226, 168, 145, ${opacity * 0.5})`} />
        </g>

        {/* Floating petals throughout */}
        <g fill={`rgba(226, 168, 145, ${opacity * 0.6})`}>
          <ellipse cx="250" cy="100" rx="8" ry="16" transform="rotate(25 250 100)" />
          <ellipse cx="180" cy="250" rx="6" ry="12" transform="rotate(-20 180 250)" />
          <ellipse cx="300" cy="400" rx="7" ry="14" transform="rotate(35 300 400)" />
          <ellipse cx="350" cy="50" rx="5" ry="10" transform="rotate(-15 350 50)" />
          <ellipse cx="1050" cy="80" rx="8" ry="15" transform="rotate(30 1050 80)" />
          <ellipse cx="1120" cy="200" rx="6" ry="12" transform="rotate(-25 1120 200)" />
          <ellipse cx="1100" cy="350" rx="7" ry="14" transform="rotate(20 1100 350)" />
          <ellipse cx="1150" cy="480" rx="5" ry="10" transform="rotate(-10 1150 480)" />
          <ellipse cx="100" cy="320" rx="4" ry="8" transform="rotate(15 100 320)" />
          <ellipse cx="1300" cy="450" rx="4" ry="8" transform="rotate(-30 1300 450)" />
        </g>

        {/* Corner flourishes */}
        <g stroke={`rgba(226, 168, 145, ${opacity * 0.5})`} strokeWidth={strokeWidth} fill="none">
          {/* Top left corner curl */}
          <path d="M0 80 Q40 60, 60 90 T100 80 Q140 110, 160 90" />
          <ellipse cx="80" cy="70" rx="15" ry="8" transform="rotate(-20 80 70)" />
          <ellipse cx="120" cy="95" rx="12" ry="6" transform="rotate(15 120 95)" />

          {/* Top right corner curl */}
          <path d="M1400 80 Q1360 60, 1340 90 T1300 80 Q1260 110, 1240 90" />
          <ellipse cx="1320" cy="70" rx="15" ry="8" transform="rotate(20 1320 70)" />
          <ellipse cx="1280" cy="95" rx="12" ry="6" transform="rotate(-15 1280 95)" />
        </g>
      </svg>
    </motion.div>
  );
}

// ============================================
// Main Component
// ============================================

interface GrandeurFooterProps {
  showBotanical?: boolean;
  botanicalVariant?: "subtle" | "moderate" | "rich";
}

export default function GrandeurFooter({ showBotanical = true, botanicalVariant = "rich" }: GrandeurFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden">
      {/* Gradient Fade Mask - Top */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(10, 12, 13, 0.9) 0%, transparent 100%)",
        }}
      />

      {/* Main Footer Content */}
      <div className="relative bg-transparent">
        {/* Top Section - Navigation Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Column 1: Brand Identity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src="/grandeur-logo.png"
                  alt={FOOTER_CONFIG.brand.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="text-xl font-bold tracking-[0.2em] text-white/90">
                  {FOOTER_CONFIG.brand.name}
                </span>
              </div>

              {/* Tagline */}
              <p className="text-sm text-neutral-400 leading-relaxed">
                {FOOTER_CONFIG.brand.tagline}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="tel:18006730010"
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  <Phone size={14} strokeWidth={1.5} className="text-white/40" />
                  1-800-673-0010
                </a>
                <a
                  href="mailto:joegrandeur@yahoo.com"
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  <Mail size={14} strokeWidth={1.5} className="text-white/40" />
                  joegrandeur@yahoo.com
                </a>
              </div>

              {/* Creator Credit */}
              <div className="pt-4 border-t border-white/[0.06]">
                <a
                  href={FOOTER_CONFIG.brand.creatorUrl}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white/70 transition-colors group"
                >
                  <span>Serving {COMPANY.regions.join(", ")}</span>
                  <ArrowUpRight
                    size={10}
                    strokeWidth={2}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </motion.div>

            {/* Column 2: Primary Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              aria-label="Primary navigation"
            >
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-5">
                {FOOTER_CONFIG.navigationColumns.primary.title}
              </h3>
              <ul className="space-y-3">
                {FOOTER_CONFIG.navigationColumns.primary.links.map((link, index) => (
                  <NavLink key={link.label} {...link} index={index} />
                ))}
              </ul>
            </motion.nav>

            {/* Column 3: Secondary Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              aria-label="Secondary navigation"
            >
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-5">
                {FOOTER_CONFIG.navigationColumns.secondary.title}
              </h3>
              <ul className="space-y-3">
                {FOOTER_CONFIG.navigationColumns.secondary.links.map((link, index) => (
                  <NavLink key={link.label} {...link} index={index} />
                ))}
              </ul>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-4">
                  Connect
                </h3>
                <ul className="space-y-3">
                  {FOOTER_CONFIG.socials.map((social, index) => (
                    <SocialLink key={social.label} label={social.label} href={social.href} Icon={social.icon} index={index} />
                  ))}
                </ul>
              </div>
            </motion.nav>
          </div>
        </div>

        {/* Center Stage - Giant "GRANDEUR" Typography */}
        <div className="relative py-16 md:py-24 overflow-hidden">
          {/* Botanical Overlay - Decorative vines and petals */}
          {showBotanical && <BotanicalOverlay variant={botanicalVariant} />}

          {/* Glass Refraction Container */}
          <div className="relative max-w-full overflow-hidden">
            {/* Giant Text with Glass Effect */}
            <div className="relative text-center select-none pointer-events-none">
              {/* Glass Layer - Main Text */}
              <h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] xl:text-[14vw] font-bold tracking-tighter leading-none"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 30px rgba(255,255,255,0.1))",
                }}
              >
                GRANDEUR
              </h1>

              {/* Glass Overlay - Refraction Effect */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ top: "-20%" }}
              >
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] xl:text-[14vw] font-bold tracking-tighter leading-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(226,168,145,0.08) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  GRANDEUR
                </h1>
              </div>

              {/* Specular Highlights */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ top: "-10%" }}
              >
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] xl:text-[14vw] font-bold tracking-tighter leading-none"
                  style={{
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 30%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  GRANDEUR
                </h1>
              </div>

              {/* Chromatic Aberration - Left Edge */}
              <div
                className="absolute inset-0 flex items-center justify-start pl-4 md:pl-8 pointer-events-none"
                style={{ top: "-5%" }}
              >
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] xl:text-[14vw] font-bold tracking-tighter leading-none"
                  style={{
                    background: "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, transparent 20%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  GRANDEUR
                </h1>
              </div>

              {/* Chromatic Aberration - Right Edge */}
              <div
                className="absolute inset-0 flex items-center justify-end pr-4 md:pr-8 pointer-events-none"
                style={{ top: "-5%" }}
              >
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] xl:text-[14vw] font-bold tracking-tighter leading-none"
                  style={{
                    background: "linear-gradient(-90deg, rgba(139,92,246,0.15) 0%, transparent 20%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  GRANDEUR
                </h1>
              </div>

              {/* Border Glow Effect */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  top: "-2%",
                  filter: "blur(2px)",
                }}
              >
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[12vw] xl:text-[14vw] font-bold tracking-tighter leading-none"
                  style={{
                    WebkitTextStroke: "1px rgba(255,255,255,0.15)",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  GRANDEUR
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
              {/* Copyright */}
              <p>
                © {currentYear} {FOOTER_CONFIG.brand.name.toUpperCase()}. All rights reserved.
              </p>

              {/* Legal Links */}
              <nav className="flex items-center gap-6" aria-label="Legal navigation">
                {FOOTER_CONFIG.legal.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative text-neutral-500 hover:text-white transition-colors duration-200 group"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/30 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OFFICES.map((office, index) => (
              <motion.div
                key={office.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <MapPin size={16} strokeWidth={1.5} className="text-white/40 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-white/80">{office.name}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{office.serves}</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    {office.address.join(", ")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Fade Mask - Bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(10, 12, 13, 0.8) 0%, transparent 100%)",
        }}
      />
    </footer>
  );
}
