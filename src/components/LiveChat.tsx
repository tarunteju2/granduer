/**
 * Enhanced LiveChat Component
 * Real-time state management, message history, typing indicators, and quick replies
 * Uses Zustand store for centralized state
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useChat, useChatActions } from "@/store";
import type { ChatMessage } from "@/types";

// ============================================
// Constants
// ============================================

const QUICK_REPLIES = [
  { id: "event-staff", text: "I need event staff", keywords: ["event", "staff", "need", "hire"] },
  { id: "rates", text: "What are your rates?", keywords: ["rate", "price", "cost", "charge"] },
  { id: "same-day", text: "Same-day availability?", keywords: ["same-day", "today", "urgent", "emergency", "hours"] },
  { id: "service-areas", text: "Service areas?", keywords: ["area", "location", "region", "where", "serve"] },
];

const BOT_RESPONSES: Record<string, string> = {
  "event-staff":
    "We'd love to help! Could you tell me the event date, location, and approximate guest count? An Account Executive will follow up within 2 hours.",
  rates:
    "Our rates vary by service type, event duration, and staff count. For a personalized quote, please share your event details or call us at 1-800-673-0010.",
  "same-day":
    "Yes! We offer emergency staffing with placement available within hours. Call 1-800-673-0010 for immediate assistance.",
  "service-areas":
    "We currently serve NYC, Long Island, New Jersey, and South Florida (Palm Beach to Miami). Planning an event in one of these areas?",
  default:
    "Thank you for your message! An Account Executive will respond shortly. For immediate assistance, call 1-800-673-0010.",
};

const TYPING_DELAY_MIN = 600;
const TYPING_DELAY_MAX = 1500;
const TYPING_SPEED = 30; // characters per second

// ============================================
// Helper Functions
// ============================================

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  for (const reply of QUICK_REPLIES) {
    const matches = reply.keywords.some(
      (keyword) => lower.includes(keyword) || keyword.includes(lower)
    );
    if (matches) {
      return BOT_RESPONSES[reply.id] || BOT_RESPONSES.default;
    }
  }

  // Fallback to partial matching
  for (const [key, value] of Object.entries(BOT_RESPONSES)) {
    if (key !== "default") {
      const keywords = key.split("-");
      if (keywords.some((kw) => lower.includes(kw))) {
        return value;
      }
    }
  }

  return BOT_RESPONSES.default;
}

function getTypingDelay(textLength: number): number {
  const baseDelay = Math.ceil(textLength / TYPING_SPEED) * 1000;
  return Math.min(Math.max(baseDelay, TYPING_DELAY_MIN), TYPING_DELAY_MAX);
}

// ============================================
// Sub-Components
// ============================================

interface TypingIndicatorProps {
  visible: boolean;
}

function TypingIndicator({ visible }: TypingIndicatorProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="shrink-0 w-7 h-7 flex items-center justify-center border border-gold-400/20 text-gold-400/50">
            <Bot size={12} strokeWidth={1.5} />
          </div>
          <div className="max-w-[75%] px-4 py-3 bg-white/3 border border-white/6">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`shrink-0 w-7 h-7 flex items-center justify-center border ${
          isUser
            ? "border-white/10 text-white/35"
            : "border-gold-400/20 text-gold-400/50"
        }`}
      >
        {isUser ? (
          <User size={12} strokeWidth={1.5} />
        ) : (
          <Bot size={12} strokeWidth={1.5} />
        )}
      </div>
      <div
        className={`max-w-[75%] px-4 py-3 text-[13px] font-light leading-relaxed ${
          isUser
            ? "bg-gold-400/6 border border-gold-400/15 text-white/60"
            : "bg-white/3 border border-white/6 text-white/50"
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

// ============================================
// Main LiveChat Component
// ============================================

export default function LiveChat() {
  const { isOpen, messages, isTyping, unreadCount } = useChat();
  const {
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    setTyping,
    clearMessages,
  } = useChatActions();

  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Hide quick replies after user sends a message
  useEffect(() => {
    if (messages.length > 1) {
      setShowQuickReplies(false);
    }
  }, [messages.length]);

  // Simulate bot response
  const simulateBotResponse = useCallback(
    (userText: string) => {
      const response = getBotResponse(userText);
      const delay = getTypingDelay(response.length);

      // Show typing indicator
      setTyping(true);

      // Send response after delay
      setTimeout(() => {
        setTyping(false);
        addMessage({ role: "bot", text: response });
      }, delay);
    },
    [setTyping, addMessage]
  );

  // Handle send message
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      // Add user message
      addMessage({ role: "user", text: text.trim() });
      setInput("");

      // Clear and simulate bot response
      simulateBotResponse(text.trim());
    },
    [addMessage, simulateBotResponse]
  );

  // Handle quick reply click
  const handleQuickReply = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [sendMessage, input]
  );

  // Handle keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeChat();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeChat]);

  // Determine if quick replies should show
  const shouldShowQuickReplies = useMemo(() => {
    return isOpen && showQuickReplies && messages.length <= 2 && !isTyping;
  }, [isOpen, showQuickReplies, messages.length, isTyping]);

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 5, duration: 0.3 }}
            type="button"
            onClick={openChat}
            className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center justify-center w-14 h-14 border border-white/15 bg-neutral-950/90 backdrop-blur-sm text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
            aria-label={`Open chat${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            aria-expanded={false}
            aria-controls="live-chat-dialog"
          >
            <MessageSquare size={20} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-5 px-1 text-[10px] font-medium bg-gold-400 text-black rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-green-300/70 bg-green-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            id="live-chat-dialog"
            role="dialog"
            aria-modal="false"
            aria-labelledby="live-chat-title"
            className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col border border-white/8 bg-neutral-950/98 backdrop-blur-md"
            style={{ height: "min(480px, calc(100dvh - 2rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full border border-green-300/70 bg-green-400 animate-pulse" />
                <span
                  id="live-chat-title"
                  className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium"
                >
                  Grandeur Chat
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Clear chat button */}
                <button
                  type="button"
                  onClick={clearMessages}
                  className="text-white/20 hover:text-white/40 text-[10px] uppercase tracking-wider transition-colors"
                  aria-label="Clear chat history"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="text-white/25 hover:text-white/50 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin"
            >
              {messages.map((msg, index) => (
                <MessageBubble key={msg.id} message={msg} index={index} />
              ))}
              <TypingIndicator visible={isTyping} />
              <div ref={endRef} />
            </div>

            {/* Quick Replies */}
            <AnimatePresence>
              {shouldShowQuickReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pb-3 flex flex-wrap gap-2 overflow-hidden"
                >
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.id}
                      type="button"
                      onClick={() => handleQuickReply(qr.text)}
                      className="text-[10px] uppercase tracking-[0.2em] text-white/30 border border-white/6 px-3 py-2 hover:border-white/15 hover:text-white/45 transition-colors cursor-pointer"
                    >
                      {qr.text}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-5 py-4 border-t border-white/6"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                aria-label="Chat message"
                className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/20 font-light focus:outline-none"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`transition-colors ${
                  input.trim() && !isTyping
                    ? "text-white/60 hover:text-gold-400/60"
                    : "text-white/15 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                ) : (
                  <Send size={16} strokeWidth={1.5} />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
