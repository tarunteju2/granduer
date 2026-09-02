import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Review {
  name: string;
  role: string;
  venue: string;
  rating: number;
  text: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    role: "Event Director",
    venue: "The Pierre Hotel",
    rating: 5,
    text: "Grandeur provided 45 servers for our annual gala with less than 48 hours notice. Every single one was professional, well-groomed, and knew exactly what to do. Absolutely exceptional.",
    date: "2 weeks ago",
  },
  {
    name: "Michael R.",
    role: "General Manager",
    venue: "Westchester Country Club",
    rating: 5,
    text: "We've been using Grandeur for over 8 years. Their staff consistently exceeds our members' expectations. The captains they send know fine dining inside and out.",
    date: "1 month ago",
  },
  {
    name: "Jennifer L.",
    role: "Catering Director",
    venue: "Cipriani Wall Street",
    rating: 5,
    text: "When our in-house team was short-staffed during wedding season, Grandeur filled 30 positions overnight. The quality was indistinguishable from our own team. Remarkable.",
    date: "3 weeks ago",
  },
  {
    name: "David K.",
    role: "Operations Manager",
    venue: "Fontainebleau Miami",
    rating: 5,
    text: "Their South Florida team is outstanding. From housekeeping to bartending, every person Grandeur sends is trained, punctual, and genuinely hospitable. A game-changer for our hotel.",
    date: "1 month ago",
  },
  {
    name: "Amanda T.",
    role: "Wedding Planner",
    venue: "Independent",
    rating: 5,
    text: "I recommend Grandeur to every bride I work with. Their attention to detail is unmatched. They even coordinate with the florist and photographer without being asked.",
    date: "2 months ago",
  },
  {
    name: "Robert F.",
    role: "VP of Events",
    venue: "Fortune 500 Company",
    rating: 5,
    text: "We host 50+ corporate events per year and trust Grandeur with every single one. Their security team is especially impressive. Retired NYPD professionals handle our VIPs with discretion.",
    date: "3 weeks ago",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          fill={i < count ? "rgba(196,163,90,0.6)" : "rgba(255,255,255,0.06)"}
        />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  return (
    <section className="relative py-36 overflow-hidden">
      <div className="mx-auto max-w-300 px-8">
        <div className="editorial-rule mb-24" />

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="editorial-label mb-8"
            >
              Reviews
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="max-w-lg font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none uppercase tracking-tight"
            >
              What Our Clients
              <br />
              <span className="italic text-gold-400">Are Saying</span>
            </motion.h2>
          </div>

          {/* Overall rating */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 lg:mt-0 flex items-center gap-6"
          >
            <div className="text-right">
              <p className="font-serif text-5xl font-light text-white">5.0</p>
              <div className="mt-2 flex justify-end">
                <Stars count={5} />
              </div>
            </div>
            <div className="border-l border-white/6 pl-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/35 font-medium">
                Google Reviews
              </p>
              <p className="text-[11px] text-white/20 mt-1">
                Based on {REVIEWS.length} reviews
              </p>
            </div>
          </motion.div>
        </div>

        {/* Reviews grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + i * 0.08, duration: 0.5 }}
              className="group border border-white/4 p-8 hover:border-white/8 transition-colors"
            >
              <Stars count={review.rating} />

              <p className="mt-5 text-[13px] text-white/35 font-light leading-[1.9] line-clamp-4 group-hover:text-white/45 transition-colors">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="mt-6 pt-5 border-t border-white/4">
                <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/45">
                  {review.name}
                </p>
                <p className="mt-1 text-[11px] text-white/20 font-light">
                  {review.role} &middot; {review.venue}
                </p>
                <p className="mt-2 text-[10px] text-white/15">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/20 hover:text-white/35 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            View on Google
          </a>
        </motion.div>
      </div>
    </section>
  );
}
