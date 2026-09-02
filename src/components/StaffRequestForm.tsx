import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Send,
  CheckCircle,
} from "lucide-react";
import { SERVICES, COMPANY } from "@/data/content";
import AnimatedSelect from "@/components/AnimatedSelect";

interface FormData {
  /* Step 1 */
  eventType: string;
  eventDate: string;
  eventTime: string;
  duration: string;
  /* Step 2 */
  services: string[];
  guestCount: string;
  /* Step 3 */
  venue: string;
  location: string;
  specialRequirements: string;
  /* Step 4 */
  name: string;
  email: string;
  phone: string;
  company: string;
}

const EVENT_TYPES = [
  "Wedding Reception",
  "Corporate Gala",
  "Private Dinner",
  "Charity Event",
  "Trade Show",
  "Holiday Party",
  "Product Launch",
  "Other",
];

const STEPS = [
  { label: "Event Details", icon: Calendar },
  { label: "Staff Needs", icon: Users },
  { label: "Venue Info", icon: MapPin },
  { label: "Your Details", icon: ClipboardCheck },
];

const empty: FormData = {
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
};

const inputClass =
  "w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-colors font-light";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function StaffRequestForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceCode, setReferenceCode] = useState("");

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const toggleService = (id: string) =>
    setData((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));

  const validateStep = (stepToValidate: number): string => {
    switch (stepToValidate) {
      case 0:
        if (!data.eventType.trim()) return "Please select an event type.";
        if (!data.eventDate.trim()) return "Please choose an event date.";
        return "";
      case 1:
        if (data.services.length === 0) {
          return "Please select at least one staffing service.";
        }
        return "";
      case 3:
        if (!data.name.trim()) return "Please enter your full name.";
        if (!data.email.trim()) return "Please enter your email address.";
        return "";
      default:
        return "";
    }
  };

  const next = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setDir(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goToStep = (targetStep: number) => {
    if (targetStep <= step) {
      setErrorMessage("");
      setDir(targetStep < step ? -1 : 1);
      setStep(targetStep);
      return;
    }

    for (let stepToValidate = step; stepToValidate < targetStep; stepToValidate += 1) {
      const validationError = validateStep(stepToValidate);
      if (validationError) {
        setErrorMessage(validationError);
        setDir(1);
        setStep(stepToValidate);
        return;
      }
    }

    setErrorMessage("");
    setDir(1);
    setStep(targetStep);
  };

  const prev = () => {
    setErrorMessage("");
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    for (let stepToValidate = 0; stepToValidate <= 3; stepToValidate += 1) {
      const validationError = validateStep(stepToValidate);
      if (validationError) {
        setErrorMessage(validationError);
        setStep(stepToValidate);
        return;
      }
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/concierge/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          eventType: data.eventType,
          services: data.services,
          guestCount: data.guestCount,
          eventDate: data.eventDate,
          eventTime: data.eventTime,
          duration: data.duration,
          venue: data.venue,
          location: data.location,
          specialRequirements: data.specialRequirements,
        }),
      });

      let resData: {
        inquiryReference?: unknown;
        referenceCode?: unknown;
        error?: unknown;
      } = {};
      try {
        resData = await response.json();
      } catch {
        if (response.ok) {
          throw new Error("The server returned an invalid response.");
        }
      }

      if (response.ok) {
        const returnedReference =
          typeof resData.inquiryReference === "string"
            ? resData.inquiryReference
            : typeof resData.referenceCode === "string"
              ? resData.referenceCode
              : "GDR-CONFIRMED";
        setReferenceCode(returnedReference);
        setSubmitted(true);
      } else {
        setErrorMessage(
          typeof resData.error === "string"
            ? resData.error
            : "Failed to submit request. Please try again.",
        );
      }
    } catch {
      setErrorMessage(
        "We couldn't send your request. Your information is still here. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="request-staff" className="relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="editorial-label mb-8"
        >
          Request Staff
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="max-w-lg font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight mb-20"
        >
          Book Your
          <br />
          <span className="italic text-gold-400">Event Staff</span>
        </motion.h2>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="luxury-card-surface max-w-xl mx-auto flex flex-col items-center justify-center gap-6 p-12 text-center rounded-sm"
          >
            <div className="h-16 w-16 rounded-full border border-gold-400/30 bg-gold-400/10 flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.2)]">
              <CheckCircle size={32} className="text-gold-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne-300/80 font-mono">
                Reference ID: {referenceCode}
              </p>
              <h3 className="mt-2 font-serif text-3xl font-light uppercase tracking-wide text-white">
                Request Registered
              </h3>
            </div>
            <p className="max-w-md text-[14px] text-white/60 font-light leading-relaxed">
              A {COMPANY.shortName} Executive Dispatch Officer will review your staffing profile and contact you within 15 minutes.
            </p>
            <button
              type="button"
              onClick={() => {
                setData(empty);
                setStep(0);
                setSubmitted(false);
              }}
              className="mt-4 border border-white/15 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:border-gold-400 hover:text-white transition-colors"
            >
              Submit Another Request
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Step indicators */}
            <div className="lg:col-span-4">
              <div className="space-y-1">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === step;
                  const done = i < step;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => goToStep(i)}
                      className={`w-full flex items-center gap-5 px-6 py-5 border border-white/4 transition-all duration-300 text-left ${active
                          ? "bg-white/3 border-white/[0.1]"
                          : "hover:bg-white/2"
                        }`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        className={
                          done
                            ? "text-gold-400/60"
                            : active
                              ? "text-white/60"
                              : "text-white/20"
                        }
                      />
                      <div>
                        <p
                          className={`text-[10px] uppercase tracking-[0.3em] ${active ? "text-white/50" : "text-white/25"
                            }`}
                        >
                          Step {i + 1}
                        </p>
                        <p
                          className={`text-[13px] mt-1 font-light uppercase tracking-wider ${done
                              ? "text-gold-400/50"
                              : active
                                ? "text-white/70"
                                : "text-white/25"
                            }`}
                        >
                          {s.label}
                        </p>
                      </div>
                      {done && (
                        <CheckCircle
                          size={14}
                          className="ml-auto text-gold-400/40"
                          strokeWidth={1.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Progress */}
              <div className="mt-8 h-px bg-white/6 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gold-400/30"
                  animate={{ width: `${((step + 1) / 4) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Form steps */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-8 relative min-h-[380px]"
            >
              <AnimatePresence mode="wait" custom={dir}>
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Event Type
                      </span>
                      <AnimatedSelect
                        required
                        value={data.eventType}
                        onChange={(value) => set("eventType", value)}
                        options={EVENT_TYPES}
                        placeholder="Select event type"
                        ariaLabel="Event type"
                      />
                    </label>
                    <div className="grid gap-x-12 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                          Event Date
                        </span>
                        <input
                          type="date"
                          required
                          value={data.eventDate}
                          onChange={(e) => set("eventDate", e.target.value)}
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                          Start Time
                        </span>
                        <input
                          type="time"
                          value={data.eventTime}
                          onChange={(e) => set("eventTime", e.target.value)}
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Duration (hours)
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        placeholder="e.g. 6"
                        value={data.duration}
                        onChange={(e) => set("duration", e.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step-1"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-4 block">
                        Services Needed (select all that apply)
                      </span>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {SERVICES.map((s) => {
                          const selected = data.services.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleService(s.id)}
                              className={`flex items-center gap-4 px-5 py-4 border text-left transition-all duration-300 ${selected
                                  ? "border-gold-400/30 bg-gold-400/4"
                                  : "border-white/6 hover:border-white/12"
                                }`}
                            >
                              <div
                                className={`w-4 h-4 border flex items-center justify-center transition-colors ${selected
                                    ? "border-gold-400/50 bg-gold-400/20"
                                    : "border-white/15"
                                  }`}
                              >
                                {selected && (
                                  <CheckCircle
                                    size={10}
                                    className="text-gold-400"
                                  />
                                )}
                              </div>
                              <span className="text-[12px] uppercase tracking-[0.2em] text-white/50 font-light">
                                {s.shortTitle}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Estimated Guest Count
                      </span>
                      <input
                        type="number"
                        min={1}
                        placeholder="e.g. 200"
                        value={data.guestCount}
                        onChange={(e) => set("guestCount", e.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Venue Name
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. The Plaza Hotel"
                        value={data.venue}
                        onChange={(e) => set("venue", e.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Location / Address
                      </span>
                      <input
                        type="text"
                        placeholder="City, State or full address"
                        value={data.location}
                        onChange={(e) => set("location", e.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Special Requirements
                      </span>
                      <textarea
                        rows={4}
                        placeholder="Dress code, dietary restrictions, AV needs, etc."
                        value={data.specialRequirements}
                        onChange={(e) =>
                          set("specialRequirements", e.target.value)
                        }
                        className={`${inputClass} resize-none`}
                      />
                    </label>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="grid gap-x-12 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                          Full Name
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={data.name}
                          onChange={(e) => set("name", e.target.value)}
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                          Email
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={data.email}
                          onChange={(e) => set("email", e.target.value)}
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <div className="grid gap-x-12 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                          Phone
                        </span>
                        <input
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={data.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                          Company / Organization
                        </span>
                        <input
                          type="text"
                          placeholder="Your company"
                          value={data.company}
                          onChange={(e) => set("company", e.target.value)}
                          className={inputClass}
                        />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {errorMessage && (
                <p className="mt-6 text-[12px] text-red-400 font-light border border-red-500/20 bg-red-500/10 p-3 rounded-sm">
                  {errorMessage}
                </p>
              )}

              {/* Navigation buttons */}
              <div className="mt-12 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prev}
                  className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35 hover:text-white transition-colors ${step === 0 ? "invisible" : ""
                    }`}
                >
                  <ChevronLeft size={14} strokeWidth={1.5} />
                  Back
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 border border-white/20 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500"
                  >
                    Continue
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex items-center gap-3 border border-gold-400/40 bg-gold-400/10 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400 hover:bg-gold-400 hover:text-black disabled:opacity-50 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  >
                    <Send size={14} strokeWidth={1.5} className={loading ? "animate-spin" : ""} />
                    {loading ? "Registering..." : "Submit Request"}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
