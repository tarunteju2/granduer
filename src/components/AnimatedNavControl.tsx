import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarDays, Inbox, type LucideIcon } from "lucide-react";
import { useState } from "react";

/** Shared-layout pill morph navigation — the active item expands into a wide pill
 *  with icon + label, inactive items collapse into compact circular icon-only buttons.
 *  The background pill morphs continuously using Framer Motion `layoutId`. */
export type AnimatedNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
};

const spring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.9 };

const defaultItems: AnimatedNavItem[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "planner", label: "Planner", icon: CalendarDays },
  { id: "alerts", label: "Alerts", icon: Bell },
];

type AnimatedNavControlProps = {
  items?: AnimatedNavItem[];
  initialActiveId?: string;
  onChange?: (id: string) => void;
};

/** Reusable shared-layout pill morph control.
 *
 *  - Active button: pill-shaped, icon + label, text colour matches the pill bg.
 *  - Inactive buttons: circular, icon-only.
 *  - The active pill background morphs between positions via `layoutId`.
 *  - Labels animate in/out with `AnimatePresence` + slide+fade.
 *  - All layout changes use a shared spring for buttery morphing.
 *  - `whileTap={{ scale: 0.96 }}` on every button.
 *
 *  Drop into any nav bar and pass `items` / `initialActiveId` / `onChange`. */
export default function AnimatedNavControl({
  items = defaultItems,
  initialActiveId = items[0]?.id,
  onChange,
}: AnimatedNavControlProps) {
  const [activeId, setActiveId] = useState(initialActiveId);

  const handleSelect = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  return (
    <div
      role="tablist"
      aria-label="Quick navigation"
      className="flex items-center gap-1 rounded-full border border-white/12 bg-black/20 p-1 shadow-[0_12px_34px_rgba(0,0,0,.22)] backdrop-blur-md"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeId;

        return (
          <motion.button
            key={id}
            type="button"
            layout
            transition={spring}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(id)}
            aria-selected={isActive}
            aria-label={label}
            role="tab"
            className={[
              "relative flex h-9 items-center overflow-hidden rounded-full px-0 text-[10px] font-medium uppercase tracking-[0.18em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400",
              isActive
                ? "min-w-[92px] text-neutral-950"
                : "w-9 text-white/55 hover:text-white",
            ].join(" ")}
          >
            {/* ── Shared-layout pill background ── */}
            {isActive && (
              <motion.span
                layoutId="animated-nav-pill"
                className="absolute inset-0 rounded-full bg-[#f8f7f2] shadow-[0_5px_18px_rgba(0,0,0,.25)]"
                transition={spring}
                aria-hidden="true"
              />
            )}

            {/* ── Icon + optional label ── */}
            <span className="relative z-10 flex w-full items-center justify-center gap-2">
              {/* Icon colour transitions with the pill */}
              <motion.span
                layout
                transition={spring}
                animate={{ color: isActive ? "#101416" : "rgba(255,255,255,.55)" }}
                className="flex shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <Icon size={15} strokeWidth={1.7} />
              </motion.span>

              {/* Label slides+fades in when active, out when inactive */}
              <AnimatePresence initial={false} mode="popLayout">
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ ...spring, opacity: { duration: 0.18 } }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
