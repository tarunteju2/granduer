import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Clock3, MapPin, Route } from "lucide-react";
import { OFFICES, COMPANY } from "@/data/content";

const REGIONS = [
  {
    name: "New York City",
    coords: { cx: "72%", cy: "22%" },
    detail: "Manhattan, Brooklyn, Queens, Bronx, Staten Island",
    market: "Flagship urban coverage",
    response: "Rapid dispatch",
    venues: "Hotels, rooftops, galas, private clubs",
  },
  {
    name: "Long Island",
    coords: { cx: "80%", cy: "25%" },
    detail: "Nassau & Suffolk Counties",
    market: "Banquet-heavy territory",
    response: "Weekend surge crews",
    venues: "Golf clubs, country clubs, estates, seasonal events",
  },
  {
    name: "New Jersey",
    coords: { cx: "67%", cy: "28%" },
    detail: "Northern & Central New Jersey",
    market: "Multi-property support",
    response: "Cross-market staffing",
    venues: "Golf clubs, hotels, convention spaces, corporate dining",
  },
  {
    name: "South Florida",
    coords: { cx: "65%", cy: "82%" },
    detail: "Palm Beach, Fort Lauderdale, Miami",
    market: "Luxury coastal coverage",
    response: "Seasonal scale-up ready",
    venues: "Resorts, waterfront events, premium catering",
  },
];

const COVERAGE_METRICS = [
  {
    icon: Route,
    value: `${COMPANY.regions.length}`,
    label: "Active regions",
  },
  {
    icon: Building2,
    value: "2",
    label: "Operating hubs",
  },
  {
    icon: Clock3,
    value: "24/7",
    label: "Dispatch coverage",
  },
];

export default function ServiceAreaMap() {
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
          Service Areas
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="max-w-3xl font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight mb-8"
        >
          Where We
          <br />
          <span className="italic text-gold-400">Operate at Scale</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mb-20 max-w-2xl text-[14px] leading-[1.9] text-white/34"
        >
          Built for multi-site staffing across high-expectation markets. We show regional depth,
          response capacity, and operating discipline without exposing client venues or on-site imagery.
        </motion.p>

        <div className="grid gap-16 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-4/3 overflow-hidden border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(196,163,90,0.16),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(196,163,90,0.08),transparent_38%)]" />

              <div className="absolute inset-0 opacity-[0.05]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-white"
                    style={{ top: `${(i + 1) * 11.1}%` }}
                  />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-white"
                    style={{ left: `${(i + 1) * 11.1}%` }}
                  />
                ))}
              </div>

              <svg
                viewBox="0 0 400 300"
                className="absolute inset-0 w-full h-full"
                fill="none"
              >
                <path
                  d="M 260 20 Q 270 40 280 60 Q 290 80 285 100 Q 280 120 275 140 Q 270 160 265 180 Q 260 200 255 220 Q 250 240 260 260 Q 265 270 260 280"
                  stroke="rgba(196,163,90,0.18)"
                  strokeWidth="1.7"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 272 68 Q 220 88 190 130 Q 168 164 168 206"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
                <path
                  d="M 286 74 Q 318 88 332 101"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
              </svg>

              <div className="absolute left-5 top-5 z-10 max-w-[15rem] border border-white/8 bg-black/35 px-4 py-4 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.34em] text-gold-400/75">Coverage Network</p>
                <p className="mt-3 text-[13px] leading-[1.7] text-white/40">
                  Regional staffing lanes mapped for fast deployment, recurring service, and overflow support.
                </p>
              </div>

              {REGIONS.map((region, i) => (
                <motion.div
                  key={region.name}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5, type: "spring" }}
                  className="absolute group"
                  style={{ left: region.coords.cx, top: region.coords.cy }}
                >
                  <span className="absolute -inset-3 rounded-full border border-gold-400/20 animate-ping opacity-20" />
                  <span className="relative block w-3 h-3 rounded-full bg-gold-400/60 border border-gold-400/40" />
                  <div className="absolute left-6 top-1/2 z-10 w-56 -translate-y-1/2 border border-white/8 bg-neutral-900/90 px-4 py-4 opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400/60">
                      {region.name}
                    </p>
                    <p className="text-[11px] text-white/35 font-light">
                      {region.detail}
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/20">{region.market}</p>
                    <p className="mt-2 text-[11px] leading-[1.7] text-white/30">{region.venues}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-gold-400/55">{region.response}</p>
                  </div>
                </motion.div>
              ))}

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                {COVERAGE_METRICS.map((metric, i) => {
                  const Icon = metric.icon;

                  return (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                      className="border border-white/8 bg-black/30 px-4 py-4 backdrop-blur-sm"
                    >
                      <Icon size={15} strokeWidth={1.5} className="text-gold-400/70" />
                      <p className="mt-4 font-serif text-3xl font-light text-white">{metric.value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-white/28">{metric.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              <span className="absolute bottom-4 right-5 text-[9px] uppercase tracking-[0.3em] text-white/12">
                East Coast USA
              </span>
            </div>
          </motion.div>

          <div className="lg:col-span-5 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mb-8 border border-white/8 bg-white/[0.02] px-6 py-6"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-400/70">Executive Note</p>
              <p className="mt-4 text-[14px] leading-[1.9] text-white/38">
                For national planners and private venues, we disclose depth of coverage, not sensitive event imagery. Private references and deployment examples available during review.
              </p>
            </motion.div>

            {OFFICES.map((office, i) => (
              <motion.div
                key={office.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="mb-5 border border-white/8 bg-white/[0.02] px-6 py-6"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <MapPin
                      size={14}
                      className="text-gold-400/40"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/45">
                      {office.name}
                    </h3>
                  </div>
                  <ArrowUpRight size={14} className="text-white/18" />
                </div>
                <p className="text-[12px] text-gold-400/40 tracking-wider uppercase mb-4">
                  {office.serves}
                </p>
                <div className="space-y-2 text-[13px] text-white/30 font-light">
                  <p>{office.address.join(", ")}</p>
                  <p>{office.phone}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-4">
                Regional Coverage
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {REGIONS.map((region) => (
                  <div
                    key={region.name}
                    className="border border-white/8 bg-black/20 px-4 py-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/52">{region.name}</p>
                    <p className="mt-2 text-[12px] leading-[1.7] text-white/30">{region.detail}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-gold-400/55">{region.response}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
