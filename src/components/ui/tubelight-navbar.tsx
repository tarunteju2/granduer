import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface NavBarProps {
  items: NavItem[];
  className?: string;
  activeName?: string;
  onNavigate?: (url: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

/** Compact animated navigation used by the existing Grandeur header. */
export function NavBar({ items, className, activeName, onNavigate }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(activeName ?? items[0]?.name ?? "");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (activeName) setActiveTab(activeName);
  }, [activeName]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!items.length) return null;

  return (
    <div className={cn("relative z-10 flex items-center justify-center", className)}>
      <div className="flex items-center gap-1 rounded-full border border-white/12 bg-[#101416]/80 p-1 shadow-[0_12px_35px_rgba(0,0,0,.28)] backdrop-blur-xl">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(event) => {
                setActiveTab(item.name);
                onNavigate?.(item.url, event);
              }}
              aria-current={isActive ? "page" : undefined}
              aria-label={isMobile ? item.name : undefined}
              className={cn(
                "relative flex min-h-9 cursor-pointer items-center justify-center rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a891]",
                "text-white/55 hover:text-[#f1bba6]",
                isActive && "bg-white/[0.07] text-[#e2a891]",
                isMobile && "px-3",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={17} strokeWidth={1.8} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="grandeur-tubelight"
                  className="absolute inset-0 -z-10 w-full rounded-full bg-[#e2a891]/[0.06]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-[#e2a891]">
                    <span className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-[#e2a891]/20 blur-md" />
                    <span className="absolute -top-1 left-0 h-6 w-8 rounded-full bg-[#e2a891]/20 blur-md" />
                    <span className="absolute top-0 left-2 h-4 w-4 rounded-full bg-[#e2a891]/25 blur-sm" />
                  </span>
                </motion.div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
