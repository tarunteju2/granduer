/**
 * TypeScript interfaces for Grandeur Staffing Website
 * Central type definitions for app state, forms, UI, calculator, and chat
 */

// ============================================
// Chat & Messaging Types
// ============================================

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  timestamp: number;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  unreadCount: number;
  sessionId: string | null;
}

export interface QuickReply {
  id: string;
  text: string;
  action?: string;
}

// ============================================
// Calculator Types
// ============================================

export interface StaffResult {
  role: string;
  count: number;
  icon: string; // Lucide icon name
}

export interface CalculatorPreset {
  name: string;
  serversPerGuest: number;
  bartendersPerGuest: number;
  kitchenPerGuest: number;
}

export interface CalculatorState {
  guestCount: string;
  eventType: string;
  needsSecurity: boolean;
  results: StaffResult[];
  totalStaff: number;
}

// ============================================
// Form Types
// ============================================

export interface StaffRequestFormData {
  // Step 1: Event Details
  eventType: string;
  eventDate: string;
  eventTime: string;
  duration: string;
  // Step 2: Staff Needs
  services: string[];
  guestCount: string;
  // Step 3: Venue Info
  venue: string;
  location: string;
  specialRequirements: string;
  // Step 4: Contact Info
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  referenceCode: string | null;
}

// ============================================
// UI State Types
// ============================================

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastState {
  toasts: Toast[];
  isPaused: boolean;
}

export interface UIState {
  isMenuOpen: boolean;
  isScrolled: boolean;
  isLoading: boolean;
  activeSection: string | null;
  showBackToTop: boolean;
  exitIntentShown: boolean;
  isDarkMode: boolean;
}

// ============================================
// App State (Root Store)
// ============================================

export interface AppState {
  // UI State
  ui: UIState;

  // Chat State
  chat: ChatState;

  // Calculator State
  calculator: CalculatorState;

  // Staff Request Form State
  staffRequestForm: StaffRequestFormData & FormSubmissionState & { currentStep: number };

  // Contact Form State
  contactForm: ContactFormData & FormSubmissionState;

  // Toast/Notification State
  toasts: ToastState;

  // Actions
  // UI Actions
  toggleMenu: () => void;
  closeMenu: () => void;
  setScrolled: (scrolled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setActiveSection: (section: string | null) => void;
  setShowBackToTop: (show: boolean) => void;
  setExitIntentShown: (shown: boolean) => void;
  toggleDarkMode: () => void;

  // Chat Actions
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
  incrementUnread: () => void;
  clearUnread: () => void;
  setSessionId: (id: string | null) => void;

  // Calculator Actions
  setGuestCount: (count: string) => void;
  setEventType: (type: string) => void;
  setNeedsSecurity: (needs: boolean) => void;
  calculateStaff: () => void;
  resetCalculator: () => void;

  // Staff Request Form Actions
  setStaffRequestField: <K extends keyof StaffRequestFormData>(
    key: K,
    value: StaffRequestFormData[K]
  ) => void;
  toggleStaffRequestService: (serviceId: string) => void;
  setStaffRequestStep: (step: number) => void;
  setStaffRequestSubmitting: (submitting: boolean) => void;
  setStaffRequestSubmitted: (submitted: boolean) => void;
  setStaffRequestError: (error: string | null) => void;
  setStaffRequestReferenceCode: (code: string | null) => void;
  resetStaffRequestForm: () => void;

  // Contact Form Actions
  setContactField: <K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) => void;
  setContactSubmitting: (submitting: boolean) => void;
  setContactSubmitted: (submitted: boolean) => void;
  setContactError: (error: string | null) => void;
  resetContactForm: () => void;

  // Toast Actions
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  pauseToasts: () => void;
  resumeToasts: () => void;
}

// ============================================
// Event & Service Types
// ============================================

export interface EventType {
  id: string;
  label: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortTitle: string;
  selected: boolean;
}

export interface ServiceArea {
  id: string;
  name: string;
  regions: string[];
}

// ============================================
// Navigation Types
// ============================================

export interface NavLink {
  label: string;
  href: string;
}

export interface NavState {
  links: NavLink[];
  mobileMenuOpen: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  referenceCode?: string;
}

export interface InquiryResponse {
  inquiryReference?: string;
  referenceCode?: string;
  message?: string;
}
