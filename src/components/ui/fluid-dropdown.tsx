"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check, ChevronDown, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FluidDropdownOption {
  label: string;
  value: string;
}

export interface FluidDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<string | FluidDropdownOption>;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  className?: string;
}

const dropdownEase = [0.16, 1, 0.3, 1] as const;

function useClickAway(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler, ref]);
}

export const FluidDropdown = React.forwardRef<HTMLDivElement, FluidDropdownProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = "Select an option",
      ariaLabel,
      required = false,
      className,
    },
    forwardedRef,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [highlightedValue, setHighlightedValue] = React.useState<string | null>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const normalizedOptions = React.useMemo(
      () => options.map((option) => (typeof option === "string" ? { label: option, value: option } : option)),
      [options],
    );
    const selectedOption = normalizedOptions.find((option) => option.value === value);
    const selectedIndex = Math.max(0, normalizedOptions.findIndex((option) => option.value === value));
    const activeValue = highlightedValue ?? selectedOption?.value ?? normalizedOptions[0]?.value;
    const activeIndex = Math.max(0, normalizedOptions.findIndex((option) => option.value === activeValue));

    const close = React.useCallback(() => {
      setOpen(false);
      setHighlightedValue(null);
    }, []);

    useClickAway(rootRef, close);

    React.useImperativeHandle(forwardedRef, () => rootRef.current as HTMLDivElement, []);

    const selectOption = (nextValue: string) => {
      onChange(nextValue);
      close();
      buttonRef.current?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!normalizedOptions.length) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (open) selectOption(normalizedOptions[activeIndex].value);
        else setOpen(true);
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (selectedIndex + direction + normalizedOptions.length) % normalizedOptions.length;
        if (!open) setOpen(true);
        setHighlightedValue(normalizedOptions[nextIndex].value);
        onChange(normalizedOptions[nextIndex].value);
      }
    };

    React.useEffect(() => {
      if (!open) return;
      optionRefs.current[activeIndex]?.focus();
    }, [activeIndex, open]);

    return (
      <MotionConfig reducedMotion="user">
        <div ref={rootRef} className={cn("relative", className)}>
          <button
            ref={buttonRef}
            type="button"
            aria-label={ariaLabel}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-required={required}
            onClick={() => setOpen((isOpen) => !isOpen)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex w-full items-center justify-between border-b border-white/8 bg-transparent px-0 py-4 text-left text-[14px] font-light text-white transition-colors",
              "hover:border-white/25 focus:border-[#e2a891]/60 focus:outline-none",
              open && "border-[#e2a891]/45",
            )}
          >
            <span className={cn("flex items-center gap-2", !value && "text-white/35")}>
              <ListFilter size={14} strokeWidth={1.5} className={cn(value ? "text-[#e2a891]/65" : "text-white/30")} />
              {selectedOption?.label ?? placeholder}
            </span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={15} strokeWidth={1.5} className={open ? "text-[#e2a891]" : "text-white/35"} />
            </motion.span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
                transition={{ duration: 0.28, ease: dropdownEase }}
                className="absolute inset-x-0 top-full z-50 mt-2 origin-top overflow-hidden rounded-xl border border-white/12 bg-[#111517]/98 p-1 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                role="listbox"
                aria-label={ariaLabel}
              >
                <motion.div className="relative py-1">
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-1 rounded-lg bg-white/[0.07]"
                    animate={{ y: activeIndex * 44 + 4, height: 40 }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                  />
                  {normalizedOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      ref={(element) => { optionRefs.current[index] = element; }}
                      type="button"
                      role="option"
                      aria-selected={value === option.value}
                      onClick={() => selectOption(option.value)}
                      onMouseEnter={() => setHighlightedValue(option.value)}
                      onMouseLeave={() => setHighlightedValue(null)}
                      className={cn(
                        "relative flex h-11 w-full items-center justify-between rounded-lg px-4 text-left text-[12px] font-light transition-colors focus:outline-none",
                        value === option.value ? "text-white" : "text-white/60 hover:text-white",
                      )}
                    >
                      {option.label}
                      {value === option.value && <Check size={13} className="text-[#e2a891]" strokeWidth={1.5} />}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    );
  },
);

FluidDropdown.displayName = "FluidDropdown";

/** Compatibility export for the original standalone demo API. */
export function Component() {
  const [value, setValue] = React.useState("all");
  return (
    <FluidDropdown
      value={value}
      onChange={setValue}
      options={[
        { value: "all", label: "All" },
        { value: "lifestyle", label: "Lifestyle" },
        { value: "desk", label: "Desk" },
        { value: "tech", label: "Tech" },
        { value: "home", label: "Home" },
      ]}
      ariaLabel="Category"
    />
  );
}
