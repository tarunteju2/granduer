import { Phone } from "lucide-react";

/** Provides one persistent phone action without competing floating controls. */
export default function FloatingContact() {
  return (
    <a
      href="tel:18006730010"
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-3 border border-[#e2a891]/70 bg-[#101416]/95 px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f1bba6] shadow-[0_18px_45px_rgba(0,0,0,.3)] backdrop-blur-sm transition-colors hover:bg-[#e2a891] hover:text-[#101416] sm:bottom-6 sm:right-6"
      aria-label="Call Grandeur staffing"
    >
      <Phone size={15} strokeWidth={1.5} />
      <span className="hidden sm:inline">Call Grandeur</span>
    </a>
  );
}
