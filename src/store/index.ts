/**
 * Zustand Store for Grandeur Staffing Website
 * Central state management for app, forms, UI, calculator, and chat
 */

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type {
  AppState,
  StaffRequestFormData,
  ContactFormData,
  StaffResult,
  CalculatorPreset,
} from "@/types";

// ============================================
// Constants & Defaults
// ============================================

const CALCULATOR_PRESETS: Record<string, CalculatorPreset> = {
  "Cocktail Reception": { name: "Cocktail Reception", serversPerGuest: 25, bartendersPerGuest: 50, kitchenPerGuest: 40 },
  "Sit-Down Dinner": { name: "Sit-Down Dinner", serversPerGuest: 15, bartendersPerGuest: 50, kitchenPerGuest: 30 },
  "Buffet / Station": { name: "Buffet / Station", serversPerGuest: 25, bartendersPerGuest: 50, kitchenPerGuest: 25 },
  "Corporate Event": { name: "Corporate Event", serversPerGuest: 20, bartendersPerGuest: 40, kitchenPerGuest: 35 },
  "Wedding Reception": { name: "Wedding Reception", serversPerGuest: 15, bartendersPerGuest: 40, kitchenPerGuest: 25 },
};

const DEFAULT_STAFF_REQUEST_FORM: StaffRequestFormData & { currentStep: number } = {
  eventType: "",
  eventDate: "",
  eventTime: "",
  duration: "",
  services: [],
  guestCount: "",
  venue: "",
  location: "",
  specialRequirements: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  currentStep: 0,
};

const DEFAULT_CONTACT_FORM: ContactFormData = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
};

const generateId = () => Math.random().toString(36).substring(2, 11);

const generateSessionId = () => `session_${Date.now()}_${generateId()}`;

// ============================================
// Store Implementation
// ============================================

export const useStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // ==========================================
    // Initial State
    // ==========================================

    // UI State
    ui: {
      isMenuOpen: false,
      isScrolled: false,
      isLoading: true,
      activeSection: null,
      showBackToTop: false,
      exitIntentShown: false,
      isDarkMode: true, // Default to dark mode
    },

    // Chat State
    chat: {
      isOpen: false,
      messages: [
        {
          id: generateId(),
          role: "bot",
          text: "Welcome to Grandeur! How can we help you with your staffing needs today?",
          timestamp: Date.now(),
        },
      ],
      isTyping: false,
      unreadCount: 0,
      sessionId: null,
    },

    // Calculator State
    calculator: {
      guestCount: "",
      eventType: "Sit-Down Dinner",
      needsSecurity: false,
      results: [],
      totalStaff: 0,
    },

    // Staff Request Form State
    staffRequestForm: {
      ...DEFAULT_STAFF_REQUEST_FORM,
      isSubmitting: false,
      isSubmitted: false,
      error: null,
      referenceCode: null,
    },

    // Contact Form State
    contactForm: {
      ...DEFAULT_CONTACT_FORM,
      isSubmitting: false,
      isSubmitted: false,
      error: null,
      referenceCode: null,
    },

    // Toast State
    toasts: {
      toasts: [],
      isPaused: false,
    },

    // ==========================================
    // UI Actions
    // ==========================================

    toggleMenu: () =>
      set((state) => ({
        ui: { ...state.ui, isMenuOpen: !state.ui.isMenuOpen },
      })),

    closeMenu: () =>
      set((state) => ({
        ui: { ...state.ui, isMenuOpen: false },
      })),

    setScrolled: (scrolled) =>
      set((state) => ({
        ui: { ...state.ui, isScrolled: scrolled },
      })),

    setLoading: (loading) =>
      set((state) => ({
        ui: { ...state.ui, isLoading: loading },
      })),

    setActiveSection: (section) =>
      set((state) => ({
        ui: { ...state.ui, activeSection: section },
      })),

    setShowBackToTop: (show) =>
      set((state) => ({
        ui: { ...state.ui, showBackToTop: show },
      })),

    setExitIntentShown: (shown) =>
      set((state) => ({
        ui: { ...state.ui, exitIntentShown: shown },
      })),

    toggleDarkMode: () =>
      set((state) => ({
        ui: { ...state.ui, isDarkMode: !state.ui.isDarkMode },
      })),

    // ==========================================
    // Chat Actions
    // ==========================================

    toggleChat: () =>
      set((state) => {
        const newIsOpen = !state.chat.isOpen;
        return {
          chat: {
            ...state.chat,
            isOpen: newIsOpen,
            unreadCount: newIsOpen ? 0 : state.chat.unreadCount,
          },
        };
      }),

    openChat: () =>
      set((state) => ({
        chat: {
          ...state.chat,
          isOpen: true,
          unreadCount: 0,
          sessionId: state.chat.sessionId || generateSessionId(),
        },
      })),

    closeChat: () =>
      set((state) => ({
        chat: { ...state.chat, isOpen: false },
      })),

    addMessage: (message) =>
      set((state) => ({
        chat: {
          ...state.chat,
          messages: [
            ...state.chat.messages,
            {
              ...message,
              id: generateId(),
              timestamp: Date.now(),
            },
          ],
          unreadCount: state.chat.isOpen ? 0 : state.chat.unreadCount + 1,
        },
      })),

    setTyping: (typing) =>
      set((state) => ({
        chat: { ...state.chat, isTyping: typing },
      })),

    clearMessages: () =>
      set((state) => ({
        chat: {
          ...state.chat,
          messages: [
            {
              id: generateId(),
              role: "bot",
              text: "Welcome to Grandeur! How can we help you with your staffing needs today?",
              timestamp: Date.now(),
            },
          ],
        },
      })),

    incrementUnread: () =>
      set((state) => ({
        chat: { ...state.chat, unreadCount: state.chat.unreadCount + 1 },
      })),

    clearUnread: () =>
      set((state) => ({
        chat: { ...state.chat, unreadCount: 0 },
      })),

    setSessionId: (id) =>
      set((state) => ({
        chat: { ...state.chat, sessionId: id },
      })),

    // ==========================================
    // Calculator Actions
    // ==========================================

    setGuestCount: (count) =>
      set((state) => ({
        calculator: { ...state.calculator, guestCount: count },
      })),

    setEventType: (type) =>
      set((state) => ({
        calculator: { ...state.calculator, eventType: type },
      })),

    setNeedsSecurity: (needs) =>
      set((state) => ({
        calculator: { ...state.calculator, needsSecurity: needs },
      })),

    calculateStaff: () => {
      const { guestCount, eventType, needsSecurity } = get().calculator;
      const guests = parseInt(guestCount) || 0;
      const preset = CALCULATOR_PRESETS[eventType];

      if (guests <= 0 || !preset) {
        set((state) => ({
          calculator: { ...state.calculator, results: [], totalStaff: 0 },
        }));
        return;
      }

      const servers = Math.max(2, Math.ceil(guests / preset.serversPerGuest));
      const bartenders = Math.max(1, Math.ceil(guests / preset.bartendersPerGuest));
      const kitchen = Math.max(1, Math.ceil(guests / preset.kitchenPerGuest));
      const captain = Math.max(1, Math.floor(servers / 8));
      const security = needsSecurity ? Math.max(2, Math.ceil(guests / 75)) : 0;

      const results: StaffResult[] = [
        { role: "Captains", count: captain, icon: "Users" },
        { role: "Servers", count: servers, icon: "UtensilsCrossed" },
        { role: "Bartenders", count: bartenders, icon: "UtensilsCrossed" },
        { role: "Kitchen Staff", count: kitchen, icon: "ChefHat" },
      ];

      if (security > 0) {
        results.push({ role: "Security", count: security, icon: "ShieldCheck" });
      }

      const totalStaff = results.reduce((acc, r) => acc + r.count, 0);

      set((state) => ({
        calculator: { ...state.calculator, results, totalStaff },
      }));
    },

    resetCalculator: () =>
      set(() => ({
        calculator: {
          guestCount: "",
          eventType: "Sit-Down Dinner",
          needsSecurity: false,
          results: [],
          totalStaff: 0,
        },
      })),

    // ==========================================
    // Staff Request Form Actions
    // ==========================================

    setStaffRequestField: (key, value) =>
      set((state) => ({
        staffRequestForm: {
          ...state.staffRequestForm,
          [key]: value,
        },
      })),

    toggleStaffRequestService: (serviceId) =>
      set((state) => {
        const services = state.staffRequestForm.services.includes(serviceId)
          ? state.staffRequestForm.services.filter((s) => s !== serviceId)
          : [...state.staffRequestForm.services, serviceId];
        return {
          staffRequestForm: { ...state.staffRequestForm, services },
        };
      }),

    setStaffRequestStep: (step) =>
      set((state) => ({
        staffRequestForm: { ...state.staffRequestForm, currentStep: step },
      })),

    setStaffRequestSubmitting: (submitting) =>
      set((state) => ({
        staffRequestForm: { ...state.staffRequestForm, isSubmitting: submitting },
      })),

    setStaffRequestSubmitted: (submitted) =>
      set((state) => ({
        staffRequestForm: { ...state.staffRequestForm, isSubmitted: submitted },
      })),

    setStaffRequestError: (error) =>
      set((state) => ({
        staffRequestForm: { ...state.staffRequestForm, error },
      })),

    setStaffRequestReferenceCode: (code) =>
      set((state) => ({
        staffRequestForm: { ...state.staffRequestForm, referenceCode: code },
      })),

    resetStaffRequestForm: () =>
      set(() => ({
        staffRequestForm: {
          ...DEFAULT_STAFF_REQUEST_FORM,
          isSubmitting: false,
          isSubmitted: false,
          error: null,
          referenceCode: null,
        },
      })),

    // ==========================================
    // Contact Form Actions
    // ==========================================

    setContactField: (key, value) =>
      set((state) => ({
        contactForm: {
          ...state.contactForm,
          [key]: value,
        },
      })),

    setContactSubmitting: (submitting) =>
      set((state) => ({
        contactForm: { ...state.contactForm, isSubmitting: submitting },
      })),

    setContactSubmitted: (submitted) =>
      set((state) => ({
        contactForm: { ...state.contactForm, isSubmitted: submitted },
      })),

    setContactError: (error) =>
      set((state) => ({
        contactForm: { ...state.contactForm, error },
      })),

    resetContactForm: () =>
      set(() => ({
        contactForm: {
          ...DEFAULT_CONTACT_FORM,
          isSubmitting: false,
          isSubmitted: false,
          error: null,
          referenceCode: null,
        },
      })),

    // ==========================================
    // Toast Actions
    // ==========================================

    addToast: (toast) =>
      set((state) => ({
        toasts: {
          ...state.toasts,
          toasts: [
            ...state.toasts.toasts,
            {
              ...toast,
              id: generateId(),
              duration: toast.duration ?? 5000,
              dismissible: toast.dismissible ?? true,
            },
          ],
        },
      })),

    removeToast: (id) =>
      set((state) => ({
        toasts: {
          ...state.toasts,
          toasts: state.toasts.toasts.filter((t) => t.id !== id),
        },
      })),

    clearAllToasts: () =>
      set((state) => ({
        toasts: { ...state.toasts, toasts: [] },
      })),

    pauseToasts: () =>
      set((state) => ({
        toasts: { ...state.toasts, isPaused: true },
      })),

    resumeToasts: () =>
      set((state) => ({
        toasts: { ...state.toasts, isPaused: false },
      })),
  }))
);

// ============================================
// Selector Hooks (for optimized re-renders)
// ============================================

export const useUI = () => useStore((state) => state.ui);
export const useChat = () => useStore((state) => state.chat);
export const useCalculator = () => useStore((state) => state.calculator);
export const useStaffRequestForm = () => useStore((state) => state.staffRequestForm);
export const useContactForm = () => useStore((state) => state.contactForm);
export const useToasts = () => useStore((state) => state.toasts);

// ============================================
// Action Hooks (for specific actions)
// ============================================

export const useChatActions = () =>
  useStore(useShallow((state) => ({
    toggleChat: state.toggleChat,
    openChat: state.openChat,
    closeChat: state.closeChat,
    addMessage: state.addMessage,
    setTyping: state.setTyping,
    clearMessages: state.clearMessages,
    incrementUnread: state.incrementUnread,
    clearUnread: state.clearUnread,
    setSessionId: state.setSessionId,
  })));

export const useCalculatorActions = () =>
  useStore(useShallow((state) => ({
    setGuestCount: state.setGuestCount,
    setEventType: state.setEventType,
    setNeedsSecurity: state.setNeedsSecurity,
    calculateStaff: state.calculateStaff,
    resetCalculator: state.resetCalculator,
  })));

export const useToastActions = () =>
  useStore((state) => ({
    addToast: state.addToast,
    removeToast: state.removeToast,
    clearAllToasts: state.clearAllToasts,
    pauseToasts: state.pauseToasts,
    resumeToasts: state.resumeToasts,
  }));

// ============================================
// Calculator Presets Export
// ============================================

export const EVENT_PRESETS = Object.keys(CALCULATOR_PRESETS);
