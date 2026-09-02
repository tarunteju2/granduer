import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Users,
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  Share2,
  Download,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sliders,
} from "lucide-react";
import {
  type ServiceType,
  calculateQuote,
  calculateRecommendedStaff,
  generateQuoteId,
  formatCurrency,
  REGION_PRICING,
  type Region,
  type QuoteSummary,
  SERVICE_LABELS,
  EVENT_COMBINATIONS,
  calculateSurgeMultiplier,
} from "./pricingEngine";

interface StaffResult {
  role: string;
  count: number;
  icon: typeof Users;
  serviceType: ServiceType;
}

const EVENT_PRESETS = Object.keys(EVENT_COMBINATIONS);

const SERVICE_ICONS: Record<ServiceType, typeof Users> = {
  servers: UtensilsCrossed,
  bartenders: UtensilsCrossed,
  captains: Users,
  kitchen: ChefHat,
  housekeeping: Users,
  promotional: Users,
  security: ShieldCheck,
};

export default function StaffCalculator() {
  // Core state
  const [guestCount, setGuestCount] = useState(100);
  const [sliderGuestCount, setSliderGuestCount] = useState(100);
  const [eventType, setEventType] = useState("Sit-Down Dinner");
  const [needsSecurity, setNeedsSecurity] = useState(false);
  const [needsKitchen, setNeedsKitchen] = useState(true);
  const [region, setRegion] = useState<Region>("nyc");
  const [duration, setDuration] = useState(6);
  const [eventDate, setEventDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 14);
    return tomorrow.toISOString().split("T")[0];
  });

  // UI state
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<Array<{ id: string; summary: QuoteSummary; timestamp: Date }>>([]);

  // Sync slider with number input
  const handleSliderChange = useCallback((value: number) => {
    setSliderGuestCount(value);
    setGuestCount(value);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    const num = parseInt(value) || 0;
    setGuestCount(num);
    setSliderGuestCount(num);
  }, []);

  // Calculate staff recommendations
  const results = useMemo<StaffResult[]>(() => {
    const staffRequirements = calculateRecommendedStaff(eventType, guestCount, needsSecurity);
    const filtered = needsKitchen
      ? staffRequirements
      : staffRequirements.filter(s => s.service !== "kitchen");

    return filtered.map(({ service, count }) => ({
      role: SERVICE_LABELS[service],
      count,
      icon: SERVICE_ICONS[service],
      serviceType: service,
    }));
  }, [guestCount, eventType, needsSecurity, needsKitchen]);

  // Calculate real-time pricing
  const quote = useMemo<QuoteSummary | null>(() => {
    if (guestCount <= 0) return null;

    const staffRequirements = calculateRecommendedStaff(eventType, guestCount, needsSecurity);
    const filtered = needsKitchen
      ? staffRequirements
      : staffRequirements.filter(s => s.service !== "kitchen");

    return calculateQuote({
      eventType,
      eventDate: new Date(eventDate),
      guestCount,
      region,
      staffRequirements: filtered,
      duration,
    });
  }, [guestCount, eventType, eventDate, region, needsSecurity, needsKitchen, duration]);

  const totalStaff = results.reduce((acc, r) => acc + r.count, 0);

  // Save quote
  const saveQuote = useCallback(() => {
    if (!quote) return;

    const id = generateQuoteId();
    setSavedQuotes(prev => [{ id, summary: quote, timestamp: new Date() }, ...prev]);
    return id;
  }, [quote]);

  // Copy share link
  const copyShareLink = useCallback(() => {
    if (!quote) return;

    const shareData = {
      eventType,
      guestCount,
      region,
      duration,
      total: quote.total,
      staff: results.map(r => ({ role: r.role, count: r.count })),
    };

    const encoded = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}#quote=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [quote, eventType, guestCount, region, duration, results]);

  // Download quote as text
  const downloadQuote = useCallback(() => {
    if (!quote) return;

    const content = `
GRANDEUR HOSPITALITY STAFFING
Staffing Quote
Generated: ${new Date().toLocaleDateString()}

Quote ID: ${generateQuoteId()}
${"=".repeat(50)}

EVENT DETAILS
Event Type: ${eventType}
Guest Count: ${guestCount}
Date: ${eventDate}
Duration: ${duration} hours
Region: ${REGION_PRICING[region].description}

STAFF REQUIREMENTS
${results.map(r => `${r.role}: ${r.count}`).join("\n")}
Total Staff: ${totalStaff}

PRICING BREAKDOWN
${quote.lineItems.map(item =>
  `${item.serviceLabel} (${item.quantity} x ${item.hours}h): ${formatCurrency(item.total)}`
).join("\n")}

Subtotal: ${formatCurrency(quote.subtotal)}
${quote.surgeFees > 0 ? `Surge Fees: ${formatCurrency(quote.surgeFees)} (${quote.activeSurgeConditions.join(", ")})` : ""}
${quote.volumeDiscount > 0 ? `Volume Discount: -${formatCurrency(quote.volumeDiscount)}` : ""}

TOTAL ESTIMATED COST: ${formatCurrency(quote.total)}
${"=".repeat(50)}

Note: This is an estimate. Final pricing may vary based on specific requirements.
Contact us to confirm availability and finalize your quote.

GRANDEUR HOSPITALITY STAFFING
Since 1985
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `granduer-quote-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [quote, eventType, guestCount, eventDate, duration, region, results, totalStaff]);

  // Calculate surge info
  const surgeInfo = useMemo(() => {
    if (!eventDate) return null;
    return calculateSurgeMultiplier(new Date(eventDate), eventType);
  }, [eventDate, eventType]);

  return (
    <section className="relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="editorial-label mb-8"
        >
          Staff Calculator
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="max-w-lg font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight mb-6"
        >
          How Many Staff
          <br />
          <span className="italic text-gold-400">Do You Need?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-md text-[14px] text-white/30 leading-[1.9] font-light mb-16"
        >
          Configure your event details for instant staffing recommendations and real-time pricing estimates.
        </motion.p>

        <div className="grid gap-16 lg:grid-cols-12">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Guest Count with Slider */}
            <div>
              <label className="block mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 flex items-center gap-2">
                  <Users size={12} className="text-gold-400/40" strokeWidth={1.5} />
                  Number of Guests
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={guestCount}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full border-b border-white/8 bg-transparent px-0 py-4 text-[24px] text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-colors font-light"
                  />
                </div>
              </label>
              {/* Slider */}
              <div className="mt-4 relative">
                <input
                  type="range"
                  min={10}
                  max={1000}
                  value={sliderGuestCount}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-gold"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-white/25">10</span>
                  <span className="text-[10px] text-white/25">500+</span>
                </div>
              </div>
            </div>

            {/* Event Type */}
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 flex items-center gap-2 mb-2">
                <Calendar size={12} className="text-gold-400/40" strokeWidth={1.5} />
                Event Type
              </span>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white focus:border-white/30 focus:outline-none transition-colors font-light appearance-none cursor-pointer"
              >
                {EVENT_PRESETS.map((t) => (
                  <option key={t} className="bg-black">
                    {t}
                  </option>
                ))}
              </select>
            </label>

            {/* Event Date */}
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 flex items-center gap-2 mb-2">
                <Calendar size={12} className="text-gold-400/40" strokeWidth={1.5} />
                Event Date
              </span>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white focus:border-white/30 focus:outline-none transition-colors font-light"
              />
            </label>

            {/* Surge Warning */}
            {surgeInfo && surgeInfo.multiplier > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-sm"
              >
                <p className="text-[11px] text-amber-400/80 font-light">
                  {surgeInfo.conditions.join(", ")} — {Math.round((surgeInfo.multiplier - 1) * 100)}% surge pricing applies
                </p>
              </motion.div>
            )}

            {/* Duration */}
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 flex items-center gap-2 mb-2">
                <Clock size={12} className="text-gold-400/40" strokeWidth={1.5} />
                Duration (hours)
              </span>
              <input
                type="number"
                min={1}
                max={24}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 4)}
                className="w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white focus:border-white/30 focus:outline-none transition-colors font-light"
              />
            </label>

            {/* Region */}
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 flex items-center gap-2 mb-2">
                <MapPin size={12} className="text-gold-400/40" strokeWidth={1.5} />
                Region
              </span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full border-b border-white/8 bg-transparent px-0 py-4 text-[14px] text-white focus:border-white/30 focus:outline-none transition-colors font-light appearance-none cursor-pointer"
              >
                {Object.entries(REGION_PRICING).map(([key, val]) => (
                  <option key={key} value={key} className="bg-black">
                    {val.description}
                  </option>
                ))}
              </select>
            </label>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/35 hover:text-white/50 transition-colors"
            >
              <Sliders size={12} strokeWidth={1.5} />
              Advanced Options
              {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4"
              >
                <button
                  type="button"
                  onClick={() => setNeedsSecurity((v) => !v)}
                  className={`flex items-center gap-4 w-full px-5 py-4 border text-left transition-all duration-300 ${
                    needsSecurity
                      ? "border-gold-400/30 bg-gold-400/4"
                      : "border-white/6 hover:border-white/12"
                  }`}
                >
                  <div
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      needsSecurity
                        ? "border-gold-400/50 bg-gold-400/20"
                        : "border-white/15"
                    }`}
                  >
                    {needsSecurity && <Check size={10} className="text-gold-400" />}
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.2em] text-white/50 font-light">
                    Include Security Staff
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedsKitchen((v) => !v)}
                  className={`flex items-center gap-4 w-full px-5 py-4 border text-left transition-all duration-300 ${
                    needsKitchen
                      ? "border-gold-400/30 bg-gold-400/4"
                      : "border-white/6 hover:border-white/12"
                  }`}
                >
                  <div
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      needsKitchen
                        ? "border-gold-400/50 bg-gold-400/20"
                        : "border-white/15"
                    }`}
                  >
                    {needsKitchen && <Check size={10} className="text-gold-400" />}
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.2em] text-white/50 font-light">
                    Include Kitchen Staff
                  </span>
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-7"
          >
            {guestCount > 0 ? (
              <>
                {/* Staff Recommendations */}
                <div className="flex items-center gap-4 mb-8">
                  <Calculator size={16} className="text-gold-400/50" strokeWidth={1.5} />
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white/35">
                    Recommended Staff: {totalStaff} Total
                  </span>
                </div>

                <div className="space-y-0">
                  {results.map((r, i) => {
                    const Icon = r.icon;
                    return (
                      <motion.div
                        key={r.role}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="group flex items-center justify-between border-t border-white/6 py-6 px-2 last:border-b"
                      >
                        <div className="flex items-center gap-5">
                          <Icon
                            size={14}
                            className="text-white/20"
                            strokeWidth={1.5}
                          />
                          <span className="font-serif text-lg font-light text-white/60 uppercase tracking-wider">
                            {r.role}
                          </span>
                        </div>
                        <span className="font-serif text-3xl font-light text-gold-400/70">
                          {r.count}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pricing Summary */}
                {quote && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-8 p-6 bg-white/[0.02] border border-white/8 rounded-sm"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <DollarSign size={16} className="text-gold-400/50" strokeWidth={1.5} />
                      <span className="text-[11px] uppercase tracking-[0.3em] text-white/35">
                        Estimated Total
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-6">
                      <span className="font-serif text-5xl font-light text-gold-400">
                        {formatCurrency(quote.total)}
                      </span>
                      <span className="text-[11px] text-white/30">
                        for {duration} hours
                      </span>
                    </div>

                    {/* Pricing breakdown */}
                    <div className="space-y-2 text-[11px]">
                      {quote.lineItems.map((item) => (
                        <div key={item.service} className="flex justify-between">
                          <span className="text-white/40">
                            {item.serviceLabel} ({item.quantity})
                          </span>
                          <span className="text-white/60">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Volume discount badge */}
                    {quote.volumeDiscount > 0 && (
                      <div className="mt-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-sm">
                        <TrendingDown size={14} className="text-green-400/70" strokeWidth={1.5} />
                        <span className="text-[11px] text-green-400/80">
                          {quote.volumeDiscountTier} Applied
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 border-t border-white/6 pt-8 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <a
                      href="#request-staff"
                      className="inline-flex items-center gap-2 border border-gold-400/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400/70 hover:bg-gold-400 hover:text-black transition-all duration-500"
                    >
                      Book Now
                      <ArrowRight size={12} strokeWidth={1.5} />
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        saveQuote();
                        setShowShareModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
                    >
                      <Download size={12} strokeWidth={1.5} />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={downloadQuote}
                      className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
                    >
                      <Download size={12} strokeWidth={1.5} />
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={12} strokeWidth={1.5} className="text-green-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Share2 size={12} strokeWidth={1.5} />
                          Share
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-[11px] text-white/20 font-light">
                  {guestCount} guests &middot; {eventType} &middot; {REGION_PRICING[region].description}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Calculator
                  size={36}
                  className="text-white/12 mb-6"
                  strokeWidth={1}
                />
                <p className="text-[13px] text-white/20 font-light">
                  Enter your guest count to see recommendations
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Saved Quotes Panel */}
        {savedQuotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 p-6 bg-white/[0.02] border border-white/8 rounded-sm"
          >
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
              Saved Quotes
            </h3>
            <div className="space-y-3">
              {savedQuotes.slice(0, 3).map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/6 rounded-sm"
                >
                  <div>
                    <p className="text-[11px] text-white/60 font-mono">{quote.id}</p>
                    <p className="text-[10px] text-white/30 mt-1">
                      {quote.summary.guestCount} guests &middot; {quote.summary.eventType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] text-gold-400/70 font-serif">
                      {formatCurrency(quote.summary.total)}
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                      {quote.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        .slider-gold::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #d4af37;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .slider-gold::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider-gold::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #d4af37;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </section>
  );
}
