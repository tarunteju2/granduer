import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  MapPin,
  Shield,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  UtensilsCrossed,
  ChefHat,
  BedDouble,
  Sparkles,
} from "lucide-react";
import {
  type ServiceType,
  SERVICE_EQUIPMENT,
  RATIOS_GUIDE,
  EQUIPMENT_PACKAGES,
  SERVICE_PRICING,
} from "./pricingEngine";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  onRequestQuote?: (serviceType: ServiceType) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceDetail {
  id: ServiceType;
  title: string;
  shortTitle: string;
  description: string;
  detailedDescription: string;
  faqs: FAQItem[];
  certifications: string[];
  trainingProvided: string[];
  icon: ReactNode;
}

const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  servers: {
    id: "servers",
    title: "Captains, Servers & Bartenders",
    shortTitle: "Front of House",
    description: "Professionally trained in fine dining and banquet service.",
    detailedDescription: "Our front-of-house professionals are the ambassadors of your event. Trained in the art of gracious hospitality, they seamlessly manage the entire service flow or integrate with your existing team to execute flawless service. From formal plated dinners to lively cocktail receptions, our staff brings professionalism, attention to detail, and genuine warmth to every interaction.",
    icon: <UtensilsCrossed size={24} strokeWidth={1.2} />,
    faqs: [
      {
        question: "What uniforms do your servers wear?",
        answer: "Standard black-tie attire is included. Captains wear tuxedo vests, servers wear black vests with white shirts, and bartenders wear black shirts with aprons. Custom branding or venue-specific attire can be arranged.",
      },
      {
        question: "Can your staff work with our existing team?",
        answer: "Absolutely. Our captains specialize in integrating with existing operations. They'll coordinate with your management team to align with your service standards and communication protocols.",
      },
      {
        question: "How far in advance should I book?",
        answer: "For optimal staffing selection, we recommend 2-4 weeks advance notice. However, we can accommodate last-minute requests based on availability.",
      },
      {
        question: "Do servers handle payment collection?",
        answer: "Our staff focuses solely on service delivery. Payment handling is typically managed by venue management or through POS systems. We can coordinate with your team for specific arrangements.",
      },
    ],
    certifications: [
      "Food Handler's Certification",
      "Alcohol Awareness Training",
      "ServSafe Certified",
      "TIPS Certified (for bartenders)",
      "Fine Dining Service Training",
      "Banquet Service Standards",
    ],
    trainingProvided: [
      "In-house hospitality training",
      "Client-specific orientation",
      "Service flow protocols",
      "Emergency procedures",
      "Communication standards",
    ],
  },
  cooks: {
    id: "kitchen",
    title: "Chefs, Cooks & Kitchen Support",
    shortTitle: "Back of House",
    description: "Professionally trained in commercial kitchens.",
    detailedDescription: "Our back-of-house team provides the skilled manpower that keeps your kitchen running at peak efficiency. Whether you need executive chefs for high-profile events, line cooks for busy service periods, or prep staff for large-scale production, we supply experienced culinary professionals who understand the demands of professional kitchen environments.",
    icon: <ChefHat size={24} strokeWidth={1.2} />,
    faqs: [
      {
        question: "What levels of culinary staff are available?",
        answer: "We provide the full spectrum: Executive Chefs, Sous Chefs, Line Cooks, Prep Cooks, and Dishwashers. Each is matched to your specific kitchen needs and event requirements.",
      },
      {
        question: "Can your cooks work with our existing kitchen team?",
        answer: "Yes, our culinary staff integrates seamlessly with existing kitchen teams. They'll adapt to your station layouts, menu items, and service style.",
      },
      {
        question: "Do cooks bring their own equipment?",
        answer: "Our staff brings knife rolls and personal tools. Full kitchen equipment and uniforms are provided by the venue. We can discuss specific requirements during booking.",
      },
      {
        question: "How do you ensure food safety compliance?",
        answer: "All kitchen staff hold current food handler certifications. We also verify sanitation knowledge and can provide staff trained in specific food safety protocols.",
      },
    ],
    certifications: [
      "ServSafe Manager Certification",
      "Food Handler's Permit",
      "Allergen Awareness Training",
      "HAACP Training",
      "Kitchen Safety Certification",
    ],
    trainingProvided: [
      "Kitchen operations orientation",
      "Station-specific training",
      "Menu briefing sessions",
      "Safety and sanitation review",
      "Equipment familiarization",
    ],
  },
  housekeeping: {
    id: "housekeeping",
    title: "Housekeepers, Bellmen & Porters",
    shortTitle: "Hotel Staff",
    description: "Professionally trained in hospitality service standards.",
    detailedDescription: "Our hotel support staff delivers the attention to detail that defines exceptional hospitality. Trained in our mock hotel rooms using industry-standard protocols, our housekeeping and concierge staff ensure your guests experience seamless service from arrival to departure. We can align with your specific standards using your training materials.",
    icon: <BedDouble size={24} strokeWidth={1.2} />,
    faqs: [
      {
        question: "Can staff be trained to our specific standards?",
        answer: "Yes. Provide us with your training manual and we'll ensure our staff is briefed on your protocols, products, and service expectations before their first shift.",
      },
      {
        question: "What areas do housekeeping staff cover?",
        answer: "Full-service coverage including guest rooms, public areas, meeting rooms, event spaces, and back-of-house operations. We customize assignments based on your needs.",
      },
      {
        question: "Are bellmen available for events?",
        answer: "Yes, we provide bellmen and porters for events requiring luggage handling, coat check services, or general guest assistance.",
      },
      {
        question: "Do you provide daily or event-based staffing?",
        answer: "We offer both. From single-event assignments to ongoing daily coverage, we flex to match your operational requirements.",
      },
    ],
    certifications: [
      "Hospitality Housekeeping Certification",
      "Safety and Security Training",
      "Guest Interaction Excellence",
      "Attention to Detail Certification",
      "Time Management Training",
    ],
    trainingProvided: [
      "Client-specific orientation",
      "Room inspection standards",
      "Guest service protocols",
      "Security awareness",
      "Product and chemical handling",
    ],
  },
  promo: {
    id: "promotional",
    title: "Promotional Models & Brand Ambassadors",
    shortTitle: "Promotional",
    description: "Polished promotional staff tailored to your brand.",
    detailedDescription: "Elevate your brand presence with our professional promotional staff. From trade show booth presence to product launches, charity events to venue activations, our promotional team represents your brand with poise, knowledge, and engaging personalities. Each team member is briefed extensively on your products, messaging, and objectives.",
    icon: <Sparkles size={24} strokeWidth={1.2} />,
    faqs: [
      {
        question: "What types of promotional events do you staff?",
        answer: "Trade shows, product launches, charity events, sports tournaments, corporate activations, retail promotions, restaurant openings, and venue launches.",
      },
      {
        question: "Can staff wear custom branded attire?",
        answer: "Yes. We coordinate attire requirements during booking. Staff can wear your branded apparel or we can arrange custom pieces that align with your brand aesthetic.",
      },
      {
        question: "How are promotional staff briefed on products?",
        answer: "We conduct detailed briefings before each event covering product knowledge, key messaging, talking points, and frequently asked questions. For complex products, we arrange extended training sessions.",
      },
      {
        question: "What's the minimum booking duration?",
        answer: "Standard minimum is 4 hours. For trade shows and multi-day events, we offer discounted full-day rates.",
      },
    ],
    certifications: [
      "Brand Ambassador Training",
      "Public Relations Fundamentals",
      "Product Knowledge Certification",
      "Social Media Conduct Training",
      "Lead Generation Skills",
    ],
    trainingProvided: [
      "Product knowledge sessions",
      "Brand messaging alignment",
      "Engagement techniques",
      "Lead capture procedures",
      "Event-specific briefings",
    ],
  },
  security: {
    id: "security",
    title: "Event Security Professionals",
    shortTitle: "Security",
    description: "Armed or unarmed security for safe, secure events.",
    detailedDescription: "Our security professionals provide the protection and peace of mind your event requires. From retired law enforcement officers to licensed security personnel, we match staffing levels and expertise to your specific security needs. Whether coordinating venue access, managing crowd flow, or ensuring VIP protection, our team maintains vigilance while preserving a welcoming atmosphere.",
    icon: <Shield size={24} strokeWidth={1.2} />,
    faqs: [
      {
        question: "What types of security do you provide?",
        answer: "Unarmed security, armed security (retired law enforcement), executive protection, crowd management, access control, and event security coordination.",
      },
      {
        question: "Are your security personnel licensed?",
        answer: "Yes. All security staff are fully licensed per state requirements. Armed security personnel are retired law enforcement with current certifications.",
      },
      {
        question: "How many security staff do I need?",
        answer: "Typical ratios range from 1 security per 75 guests for low-profile events to 1 per 25 for high-security situations. We provide recommendations based on your event type and risk assessment.",
      },
      {
        question: "Can security coordinate with venue staff?",
        answer: "Our security leads coordinate directly with venue management, local law enforcement (when applicable), and event organizers to ensure integrated security protocols.",
      },
    ],
    certifications: [
      "State Security License",
      "First Aid/CPR Certification",
      "De-escalation Training",
      "Crowd Management Certification",
      "Executive Protection Training (for armed)",
    ],
    trainingProvided: [
      "Venue security protocols",
      "Emergency response procedures",
      "Communication protocols",
      "VIP protection standards",
      "Incident documentation",
    ],
  },
};

const EQUIPMENT_PACKAGES_FOR_SERVICE: Record<string, string[]> = {
  servers: ["basic-bar", "service-equipment"],
  cooks: ["kitchen-equipment"],
  housekeeping: [],
  promo: [],
  security: [],
};

export default function ServiceDetailModal({
  isOpen,
  onClose,
  serviceId,
  onRequestQuote,
}: ServiceDetailModalProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "ratios" | "equipment" | "certifications">("overview");

  const serviceDetail = SERVICE_DETAILS[serviceId];
  const pricing = SERVICE_PRICING[serviceId as ServiceType];
  const ratios = RATIOS_GUIDE[serviceId as keyof typeof RATIOS_GUIDE] || {};
  const equipmentPackages = EQUIPMENT_PACKAGES.filter(pkg =>
    EQUIPMENT_PACKAGES_FOR_SERVICE[serviceId]?.includes(pkg.id)
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setExpandedFaq(null);
    setActiveTab("overview");
  }, [serviceId]);

  if (!serviceDetail) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[85vh] z-50 overflow-hidden rounded-sm bg-[#0a0a0a] border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold-400/10 border border-gold-400/20 text-gold-400">
                  {serviceDetail.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
                    {serviceDetail.shortTitle}
                  </p>
                  <h2 className="font-serif text-xl font-light uppercase tracking-wide text-white">
                    {serviceDetail.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors rounded-sm"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/8">
              {(["overview", "ratios", "equipment", "certifications"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    activeTab === tab
                      ? "text-gold-400 border-b-2 border-gold-400 bg-gold-400/5"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <p className="text-[14px] text-white/70 leading-[1.8] font-light">
                      {serviceDetail.detailedDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/8 rounded-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Minimum Assignment</p>
                      <p className="font-serif text-2xl text-gold-400/70">{pricing.minimumHours}h</p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/8 rounded-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Planning Support</p>
                      <p className="font-serif text-2xl text-gold-400/70">Included</p>
                    </div>
                  </div>

                  {/* FAQs */}
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 flex items-center gap-2">
                      <HelpCircle size={12} className="text-gold-400/40" strokeWidth={1.5} />
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-2">
                      {serviceDetail.faqs.map((faq, index) => (
                        <div key={index} className="border border-white/8 rounded-sm overflow-hidden">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                          >
                            <span className="text-[12px] text-white/70 font-light pr-4">
                              {faq.question}
                            </span>
                            {expandedFaq === index ? (
                              <ChevronUp size={14} className="text-gold-400/50 shrink-0" strokeWidth={1.5} />
                            ) : (
                              <ChevronDown size={14} className="text-white/30 shrink-0" strokeWidth={1.5} />
                            )}
                          </button>
                          <AnimatePresence>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4">
                                  <p className="text-[12px] text-white/50 leading-relaxed font-light">
                                    {faq.answer}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ratios Tab */}
              {activeTab === "ratios" && (
                <div className="space-y-6">
                  <p className="text-[13px] text-white/50 leading-relaxed">
                    Industry-standard staffing ratios for optimal service delivery. These guidelines are
                    adjusted based on event complexity, venue layout, and service style.
                  </p>
                  <div className="space-y-2">
                    {Object.entries(ratios).map(([eventType, ratio]) => (
                      <div
                        key={eventType}
                        className="flex items-center justify-between py-3 px-4 border-b border-white/6 last:border-b-0"
                      >
                        <span className="text-[12px] uppercase tracking-[0.1em] text-white/50 font-light">
                          {eventType}
                        </span>
                        <span className="text-[12px] text-white/70 font-light">
                          {ratio}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/8 rounded-sm">
                    <div className="flex items-start gap-3">
                      <Users size={16} className="text-gold-400/60 mt-0.5 shrink-0" strokeWidth={1.5} />
                      <p className="text-[12px] text-white/60 leading-relaxed">
                        For events outside these guidelines or with specific requirements, our account
                        executives provide personalized recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Equipment Tab */}
              {activeTab === "equipment" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">
                      Staff Equipment
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(SERVICE_EQUIPMENT[serviceId as ServiceType] || []).map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/8 rounded-sm text-[11px] text-white/50"
                        >
                          <CheckCircle size={10} className="text-gold-400/50" strokeWidth={2} />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {equipmentPackages.length > 0 && (
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">
                        Available Equipment Packages
                      </h3>
                      <div className="space-y-3">
                        {equipmentPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="p-4 bg-white/[0.02] border border-white/8 rounded-sm"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-[12px] uppercase tracking-[0.1em] text-white/70 font-medium">
                                {pkg.name}
                              </h4>
                              <span className="text-[11px] text-white/35 uppercase tracking-[0.16em]">
                                Available on request
                              </span>
                            </div>
                            <p className="text-[11px] text-white/40 font-light mb-3">
                              {pkg.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {pkg.items.map((item) => (
                                <span
                                  key={item}
                                  className="px-2 py-0.5 bg-white/[0.03] rounded-sm text-[10px] text-white/35"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Certifications Tab */}
              {activeTab === "certifications" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 flex items-center gap-2">
                      <Shield size={12} className="text-gold-400/40" strokeWidth={1.5} />
                      Staff Certifications
                    </h3>
                    <div className="grid gap-2">
                      {serviceDetail.certifications.map((cert) => (
                        <div
                          key={cert}
                          className="flex items-center gap-3 py-2 px-3 bg-white/[0.02] border border-white/6 rounded-sm"
                        >
                          <CheckCircle size={12} className="text-gold-400/60 shrink-0" strokeWidth={1.5} />
                          <span className="text-[12px] text-white/60 font-light">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 flex items-center gap-2">
                      <Clock size={12} className="text-gold-400/40" strokeWidth={1.5} />
                      Training Provided
                    </h3>
                    <div className="grid gap-2">
                      {serviceDetail.trainingProvided.map((training) => (
                        <div
                          key={training}
                          className="flex items-center gap-3 py-2 px-3 bg-white/[0.02] border border-white/6 rounded-sm"
                        >
                          <CheckCircle size={12} className="text-gold-400/60 shrink-0" strokeWidth={1.5} />
                          <span className="text-[12px] text-white/60 font-light">{training}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 p-6 border-t border-white/8 bg-black/30">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                <MapPin size={10} className="text-gold-400/40" strokeWidth={1.5} />
                Serving NYC, Long Island, NJ & South Florida
              </div>
              <button
                onClick={() => {
                  onRequestQuote?.(serviceId as ServiceType);
                  onClose();
                }}
                className="inline-flex items-center gap-2 border border-gold-400/30 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-gold-400 hover:bg-gold-400 hover:text-black transition-all duration-500 rounded-sm"
              >
                Request staff
                <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
