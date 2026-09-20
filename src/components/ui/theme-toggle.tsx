"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";

interface ThemeToggleProps {
  className?: string;
}

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export function ThemeToggle({ className }: ThemeToggleProps) {
  const isDarkMode = useStore((state) => state.ui.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply stored preference on mount
    const stored = localStorage.getItem("grandeur-theme");
    if (stored) {
      const isDark = stored === "dark";
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const handleToggle = useCallback(() => {
    const newIsDark = !isDarkMode;
    toggleDarkMode();
    localStorage.setItem("grandeur-theme", newIsDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", newIsDark ? "dark" : "light");

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { isDarkMode: newIsDark } }));
  }, [isDarkMode, toggleDarkMode]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full",
          "bg-[rgba(240,238,231,0.08)] border border-[rgba(240,238,231,0.12)]",
          "text-[rgba(240,238,231,0.6)]",
          className
        )}
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center rounded-full",
        "bg-[rgba(240,238,231,0.08)] border border-[rgba(240,238,231,0.12)]",
        "text-[rgba(240,238,231,0.6)] hover:text-[rgba(240,238,231,0.9)]",
        "hover:bg-[rgba(240,238,231,0.12)] hover:border-[rgba(240,238,231,0.2)]",
        "transition-all duration-300 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a891] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101416]",
        className
      )}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <MoonIcon />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <SunIcon />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle glow on hover */}
      <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-[#e2a891]/10 to-transparent pointer-events-none" />
    </button>
  );
}
