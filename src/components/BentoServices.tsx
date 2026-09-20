'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Users, Wine, ChefHat, Home, Shield, Calendar, Sparkles } from 'lucide-react';

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

const services: ServiceCard[] = [
  {
    icon: <Users className="h-6 w-6" strokeWidth={1.5} />,
    title: "Servers & Captains",
    description: "Professionally trained hospitality professionals for fine dining, banquet, and corporate events.",
    stat: "30+",
    statLabel: "Years Experience"
  },
  {
    icon: <Wine className="h-6 w-6" strokeWidth={1.5} />,
    title: "Bartenders",
    description: "Skilled mixologists and bar professionals for events, venues, and private functions.",
  },
  {
    icon: <ChefHat className="h-6 w-6" strokeWidth={1.5} />,
    title: "Chefs & Kitchen",
    description: "Executive chefs, sous chefs, line cooks, and prep staff for any culinary need.",
  },
  {
    icon: <Home className="h-6 w-6" strokeWidth={1.5} />,
    title: "Housekeeping",
    description: "Housekeepers, bellmen, porters, and concierge staff for hotels and venues.",
  },
  {
    icon: <Shield className="h-6 w-6" strokeWidth={1.5} />,
    title: "Event Security",
    description: "Licensed armed and unarmed security professionals for events of any scale.",
  },
  {
    icon: <Calendar className="h-6 w-6" strokeWidth={1.5} />,
    title: "Event Coordinators",
    description: "Experienced coordinators to manage every detail of your event.",
  },
];

export default function BentoServices() {
  const reduced = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(226,168,145,0.3)] bg-[rgba(226,168,145,0.08)] px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#e2a891]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#e2a891]">
              Our Services
            </span>
          </div>
          <h2 className="font-serif text-4xl font-light tracking-[-0.03em] text-[#f5f1e9] lg:text-5xl">
            Staffing Solutions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#849093]">
            From intimate dinners to grand galas, we provide vetted, trained hospitality professionals
            who elevate every occasion.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Featured Card - Spans 2 columns */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(226,168,145,0.2)] bg-gradient-to-br from-[rgba(21,27,29,0.9)] to-[rgba(16,20,22,0.95)] p-8 sm:col-span-2 lg:col-span-2"
          >
            {/* Ambient glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e2a891]/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

            <div className="relative flex h-full flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[rgba(226,168,145,0.3)] bg-[rgba(226,168,145,0.1)]">
                  <Users className="h-7 w-7 text-[#e2a891]" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 font-serif text-2xl font-light text-[#f5f1e9]">
                  Full-Service Staffing
                </h3>
                <p className="text-[15px] leading-relaxed text-[#849093]">
                  Complete event staffing solutions with dedicated account managers,
                  on-site supervisors, and 24/7 support. Serving NYC, Long Island,
                  New Jersey & South Florida since 1994.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <div className="rounded-2xl border border-[rgba(226,168,145,0.2)] bg-[rgba(16,20,22,0.8)] p-6 text-center">
                  <span className="block font-serif text-5xl font-light text-[#e2a891]">30+</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#849093]">Years of Excellence</span>
                </div>
                <motion.a
                  href="#request-staff"
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-[#e2a891] transition-colors hover:text-[#f5f1e9]"
                >
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em]">Request Staff</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Standard Service Cards */}
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(21,27,29,0.6)] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(226,168,145,0.3)] hover:bg-[rgba(26,34,37,0.8)]"
            >
              {/* Subtle gradient and reveal layer inspired by the retrieved hover-card pattern. */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(226,168,145,0.08)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-5 bottom-5 translate-y-4 border border-[rgba(226,168,145,0.16)] bg-[#101416]/85 px-3 py-2 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#e2a891]">Grandeur standard</span>
              </div>

              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#e2a891] transition-colors duration-300 group-hover:border-[rgba(226,168,145,0.3)] group-hover:bg-[rgba(226,168,145,0.1)]">
                  {service.icon}
                </div>

                <h4 className="mb-2 font-serif text-lg text-[#f5f1e9]">
                  {service.title}
                </h4>

                <p className="text-[13px] leading-relaxed text-[#849093]">
                  {service.description}
                </p>

                {service.stat && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                    <span className="font-serif text-2xl text-[#e2a891]">{service.stat}</span>
                    <span className="ml-2 text-[10px] uppercase tracking-[0.15em] text-[#849093]">
                      {service.statLabel}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e2a891] to-[#d58f78] p-8"
          >
            <div className="relative">
              <Sparkles className="mb-4 h-8 w-8 text-[#101416]/70" strokeWidth={1.5} />
              <h4 className="mb-2 font-serif text-xl text-[#101416]">
                Emergency Staffing?
              </h4>
              <p className="mb-6 text-[13px] text-[#101416]/70">
                Last-minute coverage needed? We specialize in rapid-response staffing.
              </p>
              <a
                href="tel:+18006730010"
                className="inline-flex items-center gap-2 rounded-lg bg-[#101416] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-transform hover:scale-105"
              >
                Call Now
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
