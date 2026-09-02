import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Users,
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  Check,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sliders,
} from "lucide-react";
import AnimatedSelect from "@/components/AnimatedSelect";
import {
  type ServiceType,
  calculateRecommendedStaff,
  REGION_PRICING,
  type Region,
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

  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const totalStaff = results.reduce((acc, r) => acc + r.count, 0);

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
          Configure your event details for a clear staffing recommendation tailored to your event.
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
              <AnimatedSelect
                value={eventType}
                onChange={setEventType}
                options={EVENT_PRESETS}
                ariaLabel="Event type"
              />
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
                  {surgeInfo.conditions.join(", ")} — additional staffing planning may be needed
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
              <AnimatedSelect
                value={region}
                onChange={(value) => setRegion(value as Region)}
                options={Object.entries(REGION_PRICING).map(([value, region]) => ({
                  value,
                  label: region.description,
                }))}
                ariaLabel="Region"
              />
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
      </div>
    </section>
  );
}