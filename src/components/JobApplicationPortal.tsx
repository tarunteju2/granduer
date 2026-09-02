import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  CheckCircle,
  Upload,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const POSITIONS = [
  "Captain / Maître d'",
  "Server / Waiter",
  "Bartender",
  "Chef / Cook",
  "Prep Cook / Dishwasher",
  "Housekeeper",
  "Bellman / Porter",
  "Promotional Model",
  "Security Professional",
  "Other",
];

const EXPERIENCE_LEVELS = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5-10 years)",
  "Expert (10+ years)",
];

const inputClass =
  "w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-colors font-light";

export default function JobApplicationPortal() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [appReference, setAppReference] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [about, setAbout] = useState("");
  const [hasResume, setHasResume] = useState(false);

  const validateStep = (stepToValidate: number): string => {
    if (stepToValidate === 0) {
      if (!name.trim()) return "Please enter your full name.";
      if (!email.trim()) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return "Please enter a valid email address.";
      }
    }

    if (stepToValidate === 1) {
      if (!position) return "Please select a desired position.";
      if (!experience) return "Please select your experience level.";
    }

    return "";
  };

  const next = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setStep((currentStep) => Math.min(currentStep + 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    for (let stepToValidate = 0; stepToValidate <= 1; stepToValidate += 1) {
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
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          position: position.trim(),
          experience: experience.trim(),
          availability: availability.trim(),
          about: about.trim(),
          hasResume,
        }),
      });

      let resData: {
        applicationReference?: unknown;
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
          typeof resData.applicationReference === "string"
            ? resData.applicationReference
            : typeof resData.referenceCode === "string"
              ? resData.referenceCode
              : "GDR-APP-CONFIRMED";
        setAppReference(returnedReference);
        setSubmitted(true);
      } else {
        setErrorMessage(
          typeof resData.error === "string"
            ? resData.error
            : "Failed to submit application. Please check your entries.",
        );
      }
    } catch {
      setErrorMessage(
        "We couldn't send your application. Your information is still here. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="careers" className="relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="editorial-label mb-8"
        >
          Careers & Talent
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="max-w-lg font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight mb-6"
        >
          Join Our
          <br />
          <span className="italic text-gold-400">Team</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-md text-[14px] text-white/50 leading-[1.9] font-light mb-16"
        >
          We&apos;re always looking for skilled hospitality professionals. Apply
          below and become part of the industry&apos;s most respected staffing
          team.
        </motion.p>

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
                Candidate ID: {appReference}
              </p>
              <h3 className="mt-2 font-serif text-3xl font-light uppercase tracking-wide text-white">
                Application Received
              </h3>
            </div>
            <p className="max-w-md text-[14px] text-white/60 font-light leading-relaxed">
              Our talent acquisition desk will review your profile and reach out regarding orientation and casting schedules.
            </p>
            <button
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setPhone("");
                setPosition("");
                setExperience("");
                setAvailability("");
                setAbout("");
                setStep(0);
                setSubmitted(false);
              }}
              className="mt-4 border border-white/15 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:border-gold-400 hover:text-white transition-colors"
            >
              Submit Another Application
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Left - why join */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-4"
            >
              <div className="space-y-6">
                {[
                  "Flexible scheduling",
                  "Competitive pay rates",
                  "Work at premier venues",
                  "Professional training provided",
                  "Growth opportunities",
                  "Immediate placement available",
                ].map((perk) => (
                  <div
                    key={perk}
                    className="flex items-center gap-4 border-t border-white/4 pt-5 first:border-0 first:pt-0"
                  >
                    <Briefcase
                      size={14}
                      className="text-gold-400/30 shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="text-[12px] uppercase tracking-[0.2em] text-white/35 font-light">
                      {perk}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - application form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-8 relative min-h-[380px]"
            >
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="job-0"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-6">
                      Personal information
                    </p>
                    <div className="grid gap-x-12 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                          Full Name
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Phone
                      </span>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                      />
                    </label>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="job-1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-6">
                      Experience and availability
                    </p>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Desired Position
                      </span>
                      <select
                        required
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled className="bg-black">
                          Select position
                        </option>
                        {POSITIONS.map((p) => (
                          <option key={p} className="bg-black">
                            {p}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Experience Level
                      </span>
                      <select
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled className="bg-black">
                          Select experience
                        </option>
                        {EXPERIENCE_LEVELS.map((l) => (
                          <option key={l} className="bg-black">
                            {l}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Availability
                      </span>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled className="bg-black">
                          Select availability
                        </option>
                        <option className="bg-black">Full-time</option>
                        <option className="bg-black">Part-time</option>
                        <option className="bg-black">Weekends Only</option>
                        <option className="bg-black">On-Call / As Needed</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                        Tell Us About Yourself
                      </span>
                      <textarea
                        rows={3}
                        placeholder="Relevant experience, certifications, languages spoken…"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className={`${inputClass} resize-none`}
                      />
                    </label>

                    {/* Resume upload placeholder */}
                    <button
                      type="button"
                      onClick={() => setHasResume(!hasResume)}
                      className={`mt-4 flex items-center gap-4 w-full px-5 py-4 border text-left transition-all duration-300 ${hasResume
                          ? "border-gold-400/30 bg-gold-400/4"
                          : "border-white/6 hover:border-white/12"
                        }`}
                    >
                      <Upload
                        size={14}
                        className={
                          hasResume ? "text-gold-400/60" : "text-white/20"
                        }
                        strokeWidth={1.5}
                      />
                      <span className="text-[12px] uppercase tracking-[0.2em] text-white/45 font-light">
                        {hasResume ? "Resume Attached" : "Attach Resume (optional)"}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {errorMessage && (
                <p className="mt-6 text-[12px] text-red-400 font-light border border-red-500/20 bg-red-500/10 p-3 rounded-sm">
                  {errorMessage}
                </p>
              )}

              {/* Nav */}
              <div className="mt-12 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35 hover:text-white transition-colors ${step === 0 ? "invisible" : ""
                    }`}
                >
                  <ChevronLeft size={14} strokeWidth={1.5} />
                  Back
                </button>

                {step === 0 ? (
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
                    {loading ? "Transmitting..." : "Submit Application"}
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
