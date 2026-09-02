import {
  UtensilsCrossed,
  ChefHat,
  BedDouble,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Site-wide content extracted from grandeurstaffing.com              */
/* ------------------------------------------------------------------ */

export const COMPANY = {
  name: "Grandeur Hospitality Staffing",
  shortName: "Grandeur",
  tagline:
    "Premium Hospitality Staffing Solutions Since 1985",
  description:
    "Grandeur New York solves staffing challenges for hospitality professionals. We provide well-trained, highly skilled employees at an affordable price, reducing costs and increasing client productivity.",
  founded: 1985,
  growthRate: "40%+",
  regions: ["NYC", "Long Island", "New Jersey", "South Florida"],
};

export const PRICING = {
  description:
    "Grandeur does not publish fixed staffing rates online. Pricing is tailored to your service category, event scope, and staffing requirements.",
  note:
    "Contact us for pricing or to have one of our account executives come to you to discuss your staffing need.",
  categories: [
    "Captains, servers, and bartenders",
    "Chefs, cooks, preps, and dishwashers",
    "Housekeepers, bellman, and porters",
    "Promotional models and event security",
  ],
};

export const ABOUT = {
  paragraphs: [
    "Since 1985, Grandeur New York has helped caterers, country clubs, yacht clubs, hotels, Fortune 500 companies, and restaurants across the tri-state area. Our staffing service reduces administrative work, controls costs, and lets operators focus on growth.",
    "The individuals who comprise the working core of Grandeur New York share years of academic achievements and cumulatively possess decades of insightful knowledge gained through on-the-job experience. Our experience and credentials mean you're getting stability and security along with proven service.",
    "With an average annual growth rate of over 40%, Grandeur New York has been the fastest growing professional staffing company in the Hospitality industry since its founding in 1985. We have and will continue to establish our company as the respected leader in professional staffing for the Hospitality industry.",
  ],
};

export const COMPANY_FACTS = [
  {
    title: "Employee Administration Relief",
    detail:
      "Grandeur positions its service as a way to free hospitality operators from the burdens of employee administration so they can focus on growing profits.",
  },
  {
    title: "Front & Back of House Coverage",
    detail:
      "The company provides custom front-of-house and back-of-house staffing solutions for hotels, clubs, caterers, yacht clubs, restaurants, and Fortune 500 companies.",
  },
  {
    title: "Client-Specific Training",
    detail:
      "Hotel support staff can be trained to your standards using your training manual, and front-of-house teams are prepared through Grandeur's in-house training process.",
  },
  {
    title: "Account Executive Support",
    detail:
      "Grandeur invites clients to meet with an account executive or Senior Account Manager to review staffing needs, availability, and references.",
  },
] as const;

export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
}

export const SERVICES: Service[] = [
  {
    id: "servers",
    title: "Captains / Servers / Bartenders",
    shortTitle: "Front of House",
    description:
      "Professionally trained in fine dining and banquet service, our front-of-house staff can manage the entire event or work closely with your management to execute the perfect event.",
    icon: UtensilsCrossed,
  },
  {
    id: "cooks",
    title: "Chefs / Cooks / Preps / Dishwashers",
    shortTitle: "Back of House",
    description:
      "Professionally trained in commercial kitchens, our back-of-house staff fill gaps when you need extra kitchen personnel, from executive chefs to dishwashers.",
    icon: ChefHat,
  },
  {
    id: "housekeepers",
    title: "Housekeepers / Bellman / Porters",
    shortTitle: "Hotel Staff",
    description:
      "Professionally trained in mock hotel rooms in our training facility. Give us your training manual and we will train staff specifically to your standards.",
    icon: BedDouble,
  },
  {
    id: "promo",
    title: "Promotional Models / Shot Girls",
    shortTitle: "Promotional",
    description:
      "Add just the right touch to your charity golf tournament, trade show, or venue launch with polished promotional staff tailored to your brand.",
    icon: Sparkles,
  },
  {
    id: "security",
    title: "Event Security",
    shortTitle: "Security",
    description:
      "Armed or unarmed retired law-enforcement professionals. We have the necessary security professionals to ensure a safe, secure, and well-protected event.",
    icon: ShieldCheck,
  },
];

export interface ProcessStep {
  title: string;
  summary: string;
}

export const EMPLOYEE_PROCESS: ProcessStep[] = [
  {
    title: "Advertising",
    summary:
      "Targeted campaigns proven over years to attract the best hospitality industry professionals.",
  },
  {
    title: "Recruitment",
    summary:
      "Reliable referral networks and deep recruiting resources that produce quality candidates even during labor shortages.",
  },
  {
    title: "Screening",
    summary:
      "In-depth telephone interview before any in-person meeting. Appearance, attitude, and communication are rigorously evaluated.",
  },
  {
    title: "Interview",
    summary:
      "Thorough discussion of past experience, current goals, and future expectations. All required federal, state, and local forms are completed.",
  },
  {
    title: "Testing",
    summary:
      "Oral, written, and physical examinations regardless of past experience. Candidates must meet strict requirements.",
  },
  {
    title: "Uniform & Equipment",
    summary:
      "Meticulous inspection ensures every employee is well-dressed and well-equipped. First impressions matter.",
  },
  {
    title: "Background Check",
    summary:
      "Records from SSA, criminal courts, DMV, and credit bureaus verify information. All references checked before hire.",
  },
  {
    title: "Drug Screening",
    summary:
      "Urinalysis for drugs and illegal substances. Only candidates who test negative are hired.",
  },
  {
    title: "Training",
    summary:
      "Mandatory training seminars plus client-specific coaching from captains familiar with your operation.",
  },
  {
    title: "Evaluations",
    summary:
      "Post-assignment evaluations by a Grandeur Captain become part of each employee's permanent work record.",
  },
];

export const CLIENT_TYPES = [
  "Hotels",
  "Country Clubs",
  "Yacht Clubs",
  "Caterers",
  "Restaurants",
  "Fortune 500 Companies",
];

export const GALLERY_ITEMS = [
  {
    title: "Luxury Gala Service",
    detail:
      "Formal plated service teams supporting high-capacity evening galas with synchronized front-of-house execution.",
    tag: "Front of House",
    imageUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Elegant banquet hall set for a luxury gala with warm ambient lighting and refined table settings.",
  },
  {
    title: "Corporate Hospitality",
    detail:
      "Multi-shift staffing plans for corporate events, receptions, and executive guest programs.",
    tag: "Corporate",
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Corporate networking reception with guests conversing in a modern event venue.",
  },
  {
    title: "Culinary Operations",
    detail:
      "Skilled chefs, cooks, prep staff, and dishwashers supporting demanding kitchens with calm, precise execution.",
    tag: "Back of House",
    imageUrl: "/images/culinary-operations.jpeg",
    imageAlt:
      "Professional culinary team preparing plated dishes in a refined restaurant kitchen.",
  },
  {
    title: "Private Estate Events",
    detail:
      "Discreet, standards-led service teams for private estate dinners and weekend destination events.",
    tag: "Private",
    imageUrl: "/images/pine-hollow-club.webp",
    imageAlt:
      "Private evening event setup with candlelit tables in an artistic outdoor estate setting.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "How quickly can Grandeur staff an event?",
    answer:
      "Timelines vary by role and headcount, but Grandeur supports both planned staffing and rapid-response requests. Contact an account executive for current lead-time guidance.",
  },
  {
    question: "How does staffing coordination work?",
    answer:
      "Staffing is coordinated around your service type, event duration, guest count, and staffing profile after reviewing your requirements.",
  },
  {
    question: "Which regions do you currently serve?",
    answer:
      "Grandeur currently serves NYC, Long Island, New Jersey, and South Florida from Palm Beach to Miami.",
  },
  {
    question: "Can your team follow our internal service standards?",
    answer:
      "Yes. Grandeur supports client-specific onboarding and training alignment so staff can operate to your house standards and service protocols.",
  },
  {
    question: "Are references available?",
    answer:
      "References can be provided upon meeting with a Senior Account Manager, in line with Grandeur's published client process.",
  },
];

export const RESOURCES = [
  {
    title: "Event Staffing Readiness Checklist",
    excerpt:
      "A concise pre-event checklist for venue managers and planners to confirm staffing, timing, and service-flow requirements.",
    type: "Operations Guide",
  },
  {
    title: "Front-of-House Service Matrix",
    excerpt:
      "Role-by-role guidance for captains, servers, and bartenders by event format and guest count.",
    type: "Planning Template",
  },
  {
    title: "Hotel Surge Coverage Blueprint",
    excerpt:
      "A framework for scaling guest-facing and back-of-house support during seasonal or occupancy peaks.",
    type: "Hospitality Playbook",
  },
];

export const CLIENTS_COPY = {
  description:
    "We service a wide array of clients within the hospitality industry with custom staffing solutions designed around each operation's standards.",
  references:
    "A list of clients as well as manager names and phone numbers may be provided to you upon meeting with one of your Senior Account Managers.",
  closing:
    "We appreciate the opportunity to work our hardest to provide the ultimate staffing solution that will meet and exceed your expectations.",
};

export interface Office {
  name: string;
  serves: string;
  address: string[];
  phone: string;
  email: string;
}

export const OFFICES: Office[] = [
  {
    name: "NYC Office",
    serves: "Serving NYC, LI, NJ",
    address: ["745 5th Avenue, 5th Floor", "New York, NY 10151"],
    phone: "1-800-673-0010",
    email: "joegrandeur@yahoo.com",
  },
  {
    name: "South Florida Office",
    serves: "Serving the East Coast of FL from Palm Beach to Miami",
    address: ["19790 W Dixie Hwy, Suite 1101", "Miami, FL 33180"],
    phone: "561-325-9008",
    email: "gene.grandeur@gmail.com",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Clients", href: "#clients" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
] as const;
