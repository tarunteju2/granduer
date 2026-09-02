import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { OFFICES, COMPANY } from "@/data/content";
import TextReveal, { RevealLine } from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/concierge/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          serviceTier: formData.service,
          notes: formData.message.trim(),
        }),
      });

      let responseData: { error?: unknown } = {};
      try {
        responseData = await response.json();
      } catch {
        if (response.ok) {
          throw new Error("The server returned an invalid response.");
        }
      }

      if (!response.ok) {
        setErrorMessage(
          typeof responseData.error === "string"
            ? responseData.error
            : "Unable to send your inquiry. Please try again.",
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage(
        "We couldn't send your inquiry. Your information is still here. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "premium-input w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white placeholder:text-white/20 focus:border-gold-400/60 focus:outline-none transition-colors duration-500 font-light";

  return (
    <section id="contact" className="section-chapter relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        {/* Rule */}
        <div className="editorial-rule mb-24" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="editorial-label mb-8"
        >
          Direct Inquiries
        </motion.p>

        <TextReveal delay={0.1}>
          <h2 className="max-w-lg font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight mb-20">
            <RevealLine>Get in</RevealLine>
            <RevealLine isGold className="mt-1">
              Touch
            </RevealLine>
          </h2>
        </TextReveal>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.65 }}
          className="mb-16 max-w-lg text-[14px] text-white/28 leading-[1.9] font-light"
        >
          Contact us for pricing or to have one of our account executives come to you to discuss your staffing needs.
        </motion.p>

        <div className="grid gap-20 lg:grid-cols-12">
          {/* Left - offices */}
          <div className="lg:col-span-5 space-y-12">
            {OFFICES.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              >
                <h3 className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/45 mb-5">
                  {o.name}
                </h3>
                <p className="text-[12px] text-gold-400/60 mb-6 tracking-wider uppercase">
                  {o.serves}
                </p>

                <div className="space-y-4 text-[14px] text-white/35 font-light">
                  <div className="flex items-start gap-4">
                    <MapPin size={14} className="mt-1 shrink-0 text-white/20" strokeWidth={1.5} />
                    <span>{o.address.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone size={14} className="shrink-0 text-white/20" strokeWidth={1.5} />
                    <a href={`tel:${o.phone.replace(/[^+\d]/g, "")}`} className="hover:text-white transition-colors">
                      {o.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail size={14} className="shrink-0 text-white/20" strokeWidth={1.5} />
                    <a href={`mailto:${o.email}`} className="hover:text-white transition-colors">
                      {o.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right - form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="lg:col-span-7"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
                <CheckCircle size={36} className="text-white/35" strokeWidth={1} />
                <h3 className="font-serif text-3xl font-light uppercase tracking-wide">
                  Thank You
                </h3>
                <p className="max-w-sm text-[14px] text-white/30 font-light leading-relaxed">
                  An account executive from {COMPANY.shortName} will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                {errorMessage && (
                  <p role="alert" className="mb-6 border border-red-500/20 bg-red-500/10 p-3 text-[12px] font-light text-red-400 rounded-sm">
                    {errorMessage}
                  </p>
                )}
                <div className="grid gap-x-12 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">Name</span>
                    <input type="text" required value={formData.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} placeholder="Your full name" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">Email</span>
                    <input type="email" required value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} placeholder="you@company.com" />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">Company / Venue</span>
                  <input type="text" value={formData.company} onChange={(e) => updateField("company", e.target.value)} className={inputClass} placeholder="Organization name" />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">Service Needed</span>
                  <select required value={formData.service} onChange={(e) => updateField("service", e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="" disabled className="bg-black">Select a service</option>
                    <option className="bg-black">Captains / Servers / Bartenders</option>
                    <option className="bg-black">Chefs / Cooks / Preps / Dishwashers</option>
                    <option className="bg-black">Housekeepers / Bellman / Porters</option>
                    <option className="bg-black">Promotional Models</option>
                    <option className="bg-black">Event Security</option>
                    <option className="bg-black">Multiple / Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">Message</span>
                  <textarea rows={4} value={formData.message} onChange={(e) => updateField("message", e.target.value)} className={`${inputClass} resize-none`} placeholder="Tell us about your event, dates, and staffing needs…" />
                </label>

                <div className="pt-8">
                  <MagneticButton strength={0.25}>
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 border border-white/20 px-12 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500 rounded-sm cursor-pointer"
                    >
                      <Send size={14} strokeWidth={1.5} className={loading ? "animate-pulse" : ""} />
                      {loading ? "Sending…" : "Send Inquiry"}
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-sm transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
                    </button>
                  </MagneticButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
