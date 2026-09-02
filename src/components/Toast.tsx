/**
 * Toast Notification System with Queue Management
 * Provides toast notifications with auto-dismiss, stacking, and action support
 */

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { useToasts, useToastActions } from "@/store";
import type { Toast, ToastType } from "@/types";

// ============================================
// Constants
// ============================================

const MAX_VISIBLE_TOASTS = 5;
const TOAST_VERTICAL_OFFSET = 16;
const TOAST_WIDTH = 360;

const TOAST_ICONS: Record<ToastType, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES: Record<ToastType, { border: string; icon: string; bg: string }> = {
  success: {
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  error: {
    border: "border-red-500/30",
    icon: "text-red-400",
    bg: "bg-red-500/10",
  },
  warning: {
    border: "border-amber-500/30",
    icon: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  info: {
    border: "border-blue-500/30",
    icon: "text-blue-400",
    bg: "bg-blue-500/10",
  },
};

// ============================================
// Toast Item Component
// ============================================

interface ToastItemProps {
  toast: Toast;
  index: number;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, index, onDismiss }: ToastItemProps) {
  const styles = TOAST_STYLES[toast.type];
  const Icon = TOAST_ICONS[toast.type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = useCallback(() => {
    if (toast.duration && toast.duration > 0) {
      timerRef.current = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);
    }
  }, [toast.duration, toast.id, onDismiss]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.32, 0.72, 0, 1],
      }}
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      className={`
        relative flex items-start gap-4 w-full max-w-[${TOAST_WIDTH}px]
        ${styles.bg}
        border ${styles.border}
        backdrop-blur-md
        overflow-hidden
        pointer-events-auto
      `}
      style={{
        width: TOAST_WIDTH,
        maxWidth: `calc(100vw - ${TOAST_VERTICAL_OFFSET * 2}px)`,
      }}
    >
      {/* Icon */}
      <div className={`shrink-0 pl-4 pt-4 ${styles.icon}`}>
        <Icon size={18} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="flex-1 py-4 pr-4 min-w-0">
        <p className="text-[13px] font-medium text-white/90 leading-tight">
          {toast.title}
        </p>
        {toast.message && (
          <p className="mt-1 text-[12px] text-white/50 font-light leading-relaxed">
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Dismiss Button */}
      {toast.dismissible !== false && (
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      )}

      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-0.5 ${styles.icon.replace("text-", "bg-")}`}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.div>
  );
}

// ============================================
// Toast Container Component
// ============================================

export default function ToastContainer() {
  const { toasts, isPaused } = useToasts();
  const { removeToast } = useToastActions();
  const pauseRef = useRef(isPaused);

  // Sync pause state
  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

  // Limit visible toasts
  const visibleToasts = toasts.slice(0, MAX_VISIBLE_TOASTS);

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            onDismiss={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Toast Hook for Programmatic Usage
// ============================================

export function useToast() {
  const { addToast } = useToastActions();

  return useCallback(
    (options: {
      type?: ToastType;
      title: string;
      message?: string;
      duration?: number;
      dismissible?: boolean;
      action?: { label: string; onClick: () => void };
    }) => {
      addToast({
        type: options.type || "info",
        title: options.title,
        message: options.message,
        duration: options.duration,
        dismissible: options.dismissible,
        action: options.action,
      });
    },
    [addToast]
  );
}

// ============================================
// Convenience Toast Methods
// ============================================

export function useToastMethods() {
  const toast = useToast();

  return {
    success: (title: string, message?: string) =>
      toast({ type: "success", title, message }),
    error: (title: string, message?: string) =>
      toast({ type: "error", title, message, duration: 7000 }),
    warning: (title: string, message?: string) =>
      toast({ type: "warning", title, message, duration: 6000 }),
    info: (title: string, message?: string) =>
      toast({ type: "info", title, message }),
  };
}
