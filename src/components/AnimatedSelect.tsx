import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

interface AnimatedSelectOption {
  label: string;
  value: string;
}

interface AnimatedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<string | AnimatedSelectOption>;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  className?: string;
}

const dropdownEase = [0.16, 1, 0.3, 1] as const;

export default function AnimatedSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  ariaLabel,
  required = false,
  className = "",
}: AnimatedSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );
  const selectedIndex = Math.max(
    0,
    normalizedOptions.findIndex((option) => option.value === value),
  );
  const selectedOption = normalizedOptions.find((option) => option.value === value);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (selectedIndex + direction + normalizedOptions.length) % normalizedOptions.length;
      onChange(normalizedOptions[nextIndex].value);
      setOpen(true);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((isOpen) => !isOpen);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between border-b border-white/8 bg-transparent px-0 py-4 text-left text-[14px] font-light text-white transition-colors hover:border-white/25 focus:border-white/30 focus:outline-none"
      >
        <span className={value ? "text-white" : "text-white/35"}>{selectedOption?.label || placeholder}</span>
        <ChevronDown size={15} strokeWidth={1.5} className={`text-white/35 transition-transform duration-500 ${open ? "rotate-180 text-gold-400" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.94, transformOrigin: "top" }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.32, ease: dropdownEase }}
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden border border-white/12 bg-[#111517]/98 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            role="listbox"
            aria-label={ariaLabel}
          >
            {normalizedOptions.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035, duration: 0.24, ease: dropdownEase }}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between border-b border-white/6 px-4 py-3 text-left text-[12px] font-light text-white/60 transition-colors last:border-0 hover:bg-white/6 hover:text-white focus:bg-white/6 focus:text-white focus:outline-none"
              >
                {option.label}
                {value === option.value && <Check size={13} className="text-gold-400" strokeWidth={1.5} />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
