import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Clock3, MapPin, Route } from "lucide-react";
import { OFFICES, COMPANY } from "@/data/content";
import { Map, MapMarker, MarkerContent, MarkerLabel } from "@/components/ui/mapcn-marker-label";

const REGIONS = [
  {
    name: "New York City",
    coords: { lng: -74.006, lat: 40.7128 },
    detail: "Manhattan, Brooklyn, Queens, Bronx, Staten Island",
    market: "Flagship urban coverage",
    response: "Rapid dispatch",
    venues: "Hotels, rooftops, galas, private clubs",
  },
  {
    name: "Long Island",
    coords: { lng: -73.1958, lat: 40.7891 },
    detail: "Nassau & Suffolk Counties",
    market: "Banquet-heavy territory",
    response: "Weekend surge crews",
    venues: "Golf clubs, country clubs, estates, seasonal events",
  },
  {
    name: "New Jersey",
    coords: { lng: -74.4057, lat: 40.0583 },
    detail: "Northern & Central New Jersey",
    market: "Multi-property support",
    response: "Cross-market staffing",
    venues: "Golf clubs, hotels, convention spaces, corporate dining",
  },
  {
    name: "South Florida",
    coords: { lng: -80.1918, lat: 25.7617 },
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
    <section className="relative overflow-hidden">
      <div className="shell">
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
          className="text-display-2 max-w-3xl font-serif font-light leading-none uppercase tracking-tight mb-8"
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
            <div className="relative aspect-4/3 overflow-hidden border border-white/8">
              <Map
                center={[-78, 32.5]}
                zoom={4.2}
                theme="dark"
                loading={false}
                styles={{
                  dark: {
                    version: 8,
                    sources: {
                      stamen: {
                        type: "raster",
                        tiles: ["https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"],
                        tileSize: 256,
                        attribution: "&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap",
                        maxzoom: 19
                      }
                    },
                    layers: [
                      {
                        id: "stamen",
                        type: "raster",
                        source: "stamen",
                        minzoom: 0,
                        maxzoom: 22
                      }
                    ]
                  }
                }}
              >
                {REGIONS.map((region) => (
                  <MapMarker key={region.name} longitude={region.coords.lng} latitude={region.coords.lat}>
                    <MarkerContent>
                      <div className="relative">
                        <span className="absolute -inset-3 rounded-full border border-gold-400/20 animate-ping opacity-20" />
                        <span className="relative block w-3 h-3 rounded-full bg-gold-400/60 border border-gold-400/40" />
                      </div>
                      <MarkerLabel position="bottom">
                        <span className="bg-neutral-900/90 border border-white/8 px-2 py-1 text-white/60">
                          {region.name}
                        </span>
                      </MarkerLabel>
                    </MarkerContent>
                  </MapMarker>
                ))}
              </Map>

              <div className="absolute left-5 top-5 z-10 max-w-[15rem] border border-white/8 bg-black/35 px-4 py-4 backdrop-blur-sm pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.34em] text-gold-400/75">Coverage Network</p>
                <p className="mt-3 text-[13px] leading-[1.7] text-white/40">
                  Regional staffing lanes mapped for fast deployment, recurring service, and overflow support.
                </p>
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3 pointer-events-none">
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

              <span className="absolute bottom-4 right-5 text-[9px] uppercase tracking-[0.3em] text-white/12 pointer-events-none">
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
