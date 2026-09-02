/**
 * Dynamic Pricing Engine
 * Handles service combinations, surge pricing, volume discounts by region
 * for Grandeur Hospitality Staffing
 */

export type Region = "nyc" | "long_island" | "new_jersey" | "south_florida";
export type ServiceType = "servers" | "bartenders" | "captains" | "kitchen" | "housekeeping" | "promotional" | "security";

export interface ServicePricing {
  baseRatePerHour: number;      // Base hourly rate
  minimumHours: number;         // Minimum billable hours
  halfDayRate: number;          // 4-6 hours
  fullDayRate: number;          // 6+ hours
  weekendRate: number;          // Saturday surcharge
  holidayRate: number;          // Holiday surcharge
}

export interface RegionPricing {
  multiplier: number;           // Regional cost multiplier
  description: string;
}

export interface SurgeCondition {
  type: "date_range" | "day_of_week" | "event_type";
  value: string;
  surgeMultiplier: number;
  description: string;
}

// Regional pricing multipliers
export const REGION_PRICING: Record<Region, RegionPricing> = {
  nyc: { multiplier: 1.25, description: "New York City Metro" },
  long_island: { multiplier: 1.15, description: "Long Island" },
  new_jersey: { multiplier: 1.10, description: "New Jersey" },
  south_florida: { multiplier: 1.00, description: "South Florida (Palm Beach to Miami)" },
};

// Base service pricing
export const SERVICE_PRICING: Record<ServiceType, ServicePricing> = {
  servers: {
    baseRatePerHour: 45,
    minimumHours: 4,
    halfDayRate: 225,
    fullDayRate: 380,
    weekendRate: 55,
    holidayRate: 75,
  },
  bartenders: {
    baseRatePerHour: 55,
    minimumHours: 4,
    halfDayRate: 275,
    fullDayRate: 460,
    weekendRate: 65,
    holidayRate: 90,
  },
  captains: {
    baseRatePerHour: 75,
    minimumHours: 4,
    halfDayRate: 375,
    fullDayRate: 620,
    weekendRate: 85,
    holidayRate: 115,
  },
  kitchen: {
    baseRatePerHour: 50,
    minimumHours: 4,
    halfDayRate: 250,
    fullDayRate: 420,
    weekendRate: 60,
    holidayRate: 80,
  },
  housekeeping: {
    baseRatePerHour: 40,
    minimumHours: 4,
    halfDayRate: 200,
    fullDayRate: 340,
    weekendRate: 50,
    holidayRate: 65,
  },
  promotional: {
    baseRatePerHour: 60,
    minimumHours: 4,
    halfDayRate: 300,
    fullDayRate: 500,
    weekendRate: 70,
    holidayRate: 95,
  },
  security: {
    baseRatePerHour: 65,
    minimumHours: 4,
    halfDayRate: 325,
    fullDayRate: 540,
    weekendRate: 75,
    holidayRate: 100,
  },
};

// Surge pricing conditions
export const SURGE_CONDITIONS: SurgeCondition[] = [
  // Holiday surges
  { type: "date_range", value: "2026-12-24|2026-12-26", surgeMultiplier: 1.5, description: "Christmas Week" },
  { type: "date_range", value: "2026-12-31|2027-01-02", surgeMultiplier: 1.75, description: "New Year's Eve" },
  { type: "date_range", value: "2026-11-26|2026-11-29", surgeMultiplier: 1.4, description: "Thanksgiving Week" },
  { type: "date_range", value: "2026-12-15|2026-12-23", surgeMultiplier: 1.25, description: "Holiday Season" },
  // Day of week surcharges
  { type: "day_of_week", value: "Saturday", surgeMultiplier: 1.15, description: "Saturday Premium" },
  { type: "day_of_week", value: "Sunday", surgeMultiplier: 1.25, description: "Sunday Premium" },
  // Event type surcharges
  { type: "event_type", value: "Wedding Reception", surgeMultiplier: 1.2, description: "Wedding Event" },
  { type: "event_type", value: "Holiday Party", surgeMultiplier: 1.3, description: "Holiday Event" },
  { type: "event_type", value: "Product Launch", surgeMultiplier: 1.15, description: "Corporate Launch" },
];

// Volume discount thresholds
export const VOLUME_DISCOUNTS = [
  { minStaff: 1, maxStaff: 9, discountPercent: 0 },
  { minStaff: 10, maxStaff: 19, discountPercent: 5 },
  { minStaff: 20, maxStaff: 34, discountPercent: 10 },
  { minStaff: 35, maxStaff: 49, discountPercent: 15 },
  { minStaff: 50, maxStaff: Infinity, discountPercent: 20 },
];

// Event type service combinations
export interface EventServiceCombination {
  eventType: string;
  services: ServiceType[];
  defaultRatios: {
    servers: number;     // 1 server per X guests
    bartenders: number; // 1 bartender per X guests
    captains: number;   // 1 captain per X servers
    kitchen: number;    // 1 kitchen staff per X guests
  };
}

export const EVENT_COMBINATIONS: Record<string, EventServiceCombination> = {
  "Cocktail Reception": {
    eventType: "Cocktail Reception",
    services: ["servers", "bartenders", "captains"],
    defaultRatios: { servers: 25, bartenders: 50, captains: 8, kitchen: 0 },
  },
  "Sit-Down Dinner": {
    eventType: "Sit-Down Dinner",
    services: ["servers", "bartenders", "captains", "kitchen"],
    defaultRatios: { servers: 15, bartenders: 50, captains: 8, kitchen: 30 },
  },
  "Buffet / Station": {
    eventType: "Buffet / Station",
    services: ["servers", "bartenders", "captains", "kitchen"],
    defaultRatios: { servers: 25, bartenders: 50, captains: 10, kitchen: 25 },
  },
  "Corporate Event": {
    eventType: "Corporate Event",
    services: ["servers", "bartenders", "captains"],
    defaultRatios: { servers: 20, bartenders: 40, captains: 10, kitchen: 0 },
  },
  "Wedding Reception": {
    eventType: "Wedding Reception",
    services: ["servers", "bartenders", "captains", "kitchen"],
    defaultRatios: { servers: 15, bartenders: 40, captains: 8, kitchen: 25 },
  },
  "Charity Gala": {
    eventType: "Charity Gala",
    services: ["servers", "bartenders", "captains", "promotional"],
    defaultRatios: { servers: 12, bartenders: 35, captains: 10, kitchen: 40 },
  },
  "Trade Show": {
    eventType: "Trade Show",
    services: ["servers", "promotional", "security"],
    defaultRatios: { servers: 40, bartenders: 0, captains: 12, kitchen: 0 },
  },
  "Private Dinner": {
    eventType: "Private Dinner",
    services: ["servers", "bartenders", "captains"],
    defaultRatios: { servers: 10, bartenders: 60, captains: 12, kitchen: 0 },
  },
};

// Equipment packages
export interface EquipmentPackage {
  id: string;
  name: string;
  description: string;
  pricePerEvent: number;
  items: string[];
}

export const EQUIPMENT_PACKAGES: EquipmentPackage[] = [
  {
    id: "basic-bar",
    name: "Basic Bar Setup",
    description: "Standard bar equipment for cocktail service",
    pricePerEvent: 150,
    items: ["Ice buckets", "Speed racks", "Garnish trays", "Napkins", "Stirrers"],
  },
  {
    id: "premium-bar",
    name: "Premium Bar Package",
    description: "Full bar setup with glassware and garnishes",
    pricePerEvent: 350,
    items: ["Everything in Basic", "Crystal glassware", "Premium garnishes", "Cocktail napkins", "Coasters"],
  },
  {
    id: "service-equipment",
    name: "Service Equipment",
    description: "Additional service items for large events",
    pricePerEvent: 200,
    items: ["Chafing stands", "Serving trays", "Pliers", "Tongs", "Decanters"],
  },
  {
    id: "kitchen-equipment",
    name: "Kitchen Support Kit",
    description: "Essential kitchen equipment for prep support",
    pricePerEvent: 175,
    items: ["Knife sets", "Cutting boards", "Mixing bowls", "Towels", "Thermometers"],
  },
];

// Calculate surge multiplier for a given date and event type
export function calculateSurgeMultiplier(eventDate: Date, eventType: string): { multiplier: number; conditions: string[] } {
  let totalMultiplier = 1.0;
  const activeConditions: string[] = [];
  const dateStr = eventDate.toISOString().split("T")[0];
  const dayName = eventDate.toLocaleDateString("en-US", { weekday: "long" });

  for (const condition of SURGE_CONDITIONS) {
    let isActive = false;

    if (condition.type === "date_range") {
      const [startDate, endDate] = condition.value.split("|");
      if (dateStr >= startDate && dateStr <= endDate) {
        isActive = true;
      }
    } else if (condition.type === "day_of_week" && condition.value === dayName) {
      isActive = true;
    } else if (condition.type === "event_type" && condition.value === eventType) {
      isActive = true;
    }

    if (isActive) {
      totalMultiplier *= condition.surgeMultiplier;
      activeConditions.push(condition.description);
    }
  }

  return { multiplier: totalMultiplier, conditions: activeConditions };
}

// Calculate volume discount
export function calculateVolumeDiscount(totalStaff: number): { discountPercent: number; label: string } {
  for (const tier of VOLUME_DISCOUNTS) {
    if (totalStaff >= tier.minStaff && totalStaff <= tier.maxStaff) {
      let label = `${tier.discountPercent}% Volume Discount`;
      if (tier.discountPercent === 0) label = "Standard Rate";
      return { discountPercent: tier.discountPercent, label };
    }
  }
  return { discountPercent: 0, label: "Standard Rate" };
}

// Calculate pricing for a service quote
export interface QuoteLineItem {
  service: ServiceType;
  serviceLabel: string;
  quantity: number;
  hours: number;
  ratePerHour: number;
  subtotal: number;
  regionMultiplier: number;
  surgeMultiplier: number;
  volumeDiscount: number;
  total: number;
}

export interface QuoteSummary {
  lineItems: QuoteLineItem[];
  subtotal: number;
  surgeFees: number;
  volumeDiscount: number;
  total: number;
  estimatedHours: number;
  regionLabel: string;
  eventType: string;
  guestCount: number;
  activeSurgeConditions: string[];
  volumeDiscountTier: string;
}

export function calculateQuote(params: {
  eventType: string;
  eventDate: Date;
  guestCount: number;
  region: Region;
  staffRequirements: { service: ServiceType; count: number }[];
  duration: number;
}): QuoteSummary {
  const { eventType, eventDate, guestCount, region, staffRequirements, duration } = params;

  const regionPricing = REGION_PRICING[region];
  const { multiplier: surgeMultiplier, conditions: activeSurgeConditions } = calculateSurgeMultiplier(eventDate, eventType);

  // Calculate line items
  const lineItems: QuoteLineItem[] = staffRequirements.map(({ service, count }) => {
    const pricing = SERVICE_PRICING[service];
    const serviceLabel = service.charAt(0).toUpperCase() + service.slice(1);

    // Determine rate based on duration
    let ratePerHour = pricing.baseRatePerHour;
    if (duration >= 6) {
      ratePerHour = pricing.fullDayRate / 6;
    } else if (duration >= 4) {
      ratePerHour = pricing.halfDayRate / duration;
    }

    const hours = Math.max(duration, pricing.minimumHours);
    const baseSubtotal = count * ratePerHour * hours;
    const subtotal = baseSubtotal * regionPricing.multiplier;

    return {
      service,
      serviceLabel,
      quantity: count,
      hours,
      ratePerHour,
      subtotal,
      regionMultiplier: regionPricing.multiplier,
      surgeMultiplier,
      volumeDiscount: 0, // Will be calculated after total
      total: subtotal,
    };
  });

  // Calculate subtotal before discounts
  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Calculate surge fees (additional cost from surge pricing)
  const surgeFees = subtotal * (surgeMultiplier - 1);

  // Calculate volume discount based on total staff
  const totalStaff = staffRequirements.reduce((sum, req) => sum + req.count, 0);
  const { discountPercent, label: volumeDiscountTier } = calculateVolumeDiscount(totalStaff);
  const volumeDiscount = (subtotal + surgeFees) * (discountPercent / 100);

  // Apply volume discount to line items
  lineItems.forEach((item) => {
    item.volumeDiscount = discountPercent;
    item.total = item.subtotal * surgeMultiplier * (1 - discountPercent / 100);
  });

  // Calculate final total
  const total = (subtotal + surgeFees) - volumeDiscount;
  const estimatedHours = Math.max(duration, 4);

  return {
    lineItems,
    subtotal,
    surgeFees,
    volumeDiscount,
    total,
    estimatedHours,
    regionLabel: regionPricing.description,
    eventType,
    guestCount,
    activeSurgeConditions,
    volumeDiscountTier,
  };
}

// Generate quote ID
export function generateQuoteId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GDR-${timestamp}-${random}`;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate recommended staff based on event type and guest count
export function calculateRecommendedStaff(
  eventType: string,
  guestCount: number,
  includeSecurity: boolean = false
): { service: ServiceType; count: number }[] {
  const combination = EVENT_COMBINATIONS[eventType];
  if (!combination) return [];

  const { defaultRatios } = combination;
  const staff: { service: ServiceType; count: number }[] = [];

  if (defaultRatios.servers > 0) {
    const count = Math.max(2, Math.ceil(guestCount / defaultRatios.servers));
    staff.push({ service: "servers", count });
  }

  if (defaultRatios.bartenders > 0) {
    const count = Math.max(1, Math.ceil(guestCount / defaultRatios.bartenders));
    staff.push({ service: "bartenders", count });
  }

  if (defaultRatios.kitchen > 0) {
    const count = Math.max(1, Math.ceil(guestCount / defaultRatios.kitchen));
    staff.push({ service: "kitchen", count });
  }

  // Calculate captains based on server count
  const serverCount = staff.find(s => s.service === "servers")?.count || 0;
  if (serverCount > 0) {
    const captainCount = Math.max(1, Math.floor(serverCount / defaultRatios.captains));
    staff.push({ service: "captains", count: captainCount });
  }

  if (includeSecurity) {
    const securityCount = Math.max(2, Math.ceil(guestCount / 75));
    staff.push({ service: "security", count: securityCount });
  }

  return staff;
}

// Service labels for display
export const SERVICE_LABELS: Record<ServiceType, string> = {
  servers: "Servers",
  bartenders: "Bartenders",
  captains: "Captains",
  kitchen: "Kitchen Staff",
  housekeeping: "Housekeeping",
  promotional: "Promotional Staff",
  security: "Security",
};

// Equipment requirements per service
export const SERVICE_EQUIPMENT: Record<ServiceType, string[]> = {
  servers: ["Black-tie uniform", "Serving trays", "Notepad and pen", "Beverage keys"],
  bartenders: ["Bartender kit", "Shaker sets", "Speed pourers", "Jigger", "Mixing glass"],
  captains: ["Manager badge", "Radio/communication device", "Event timeline", "Emergency contacts"],
  kitchen: ["Chef whites or blacks", "Knife roll", "Apron", "Non-slip shoes"],
  housekeeping: ["Uniform", "Cleaning supplies kit", "Cart", "Key ring"],
  promotional: ["Brand apparel", "Name tag", "Product samples", "Signage materials"],
  security: ["Security uniform", "Radio", "Flashlight", "Incident report forms"],
};

// Staffing ratios guide
export const RATIOS_GUIDE = {
  servers: {
    "Cocktail Reception": "1 per 25 guests",
    "Sit-Down Dinner": "1 per 15 guests",
    "Buffet / Station": "1 per 25 guests",
    "Corporate Event": "1 per 20 guests",
    "Wedding Reception": "1 per 15 guests",
    "Charity Gala": "1 per 12 guests",
    "Trade Show": "1 per 40 guests",
    "Private Dinner": "1 per 10 guests",
  },
  bartenders: {
    "Cocktail Reception": "1 per 50 guests",
    "Sit-Down Dinner": "1 per 50 guests",
    "Buffet / Station": "1 per 50 guests",
    "Corporate Event": "1 per 40 guests",
    "Wedding Reception": "1 per 40 guests",
    "Charity Gala": "1 per 35 guests",
    "Trade Show": "N/A",
    "Private Dinner": "1 per 60 guests",
  },
  captains: {
    "Cocktail Reception": "1 per 8 servers",
    "Sit-Down Dinner": "1 per 8 servers",
    "Buffet / Station": "1 per 10 servers",
    "Corporate Event": "1 per 10 servers",
    "Wedding Reception": "1 per 8 servers",
    "Charity Gala": "1 per 10 servers",
    "Trade Show": "1 per 12 staff",
    "Private Dinner": "1 per 12 servers",
  },
  kitchen: {
    "Cocktail Reception": "1 per 40 guests",
    "Sit-Down Dinner": "1 per 30 guests",
    "Buffet / Station": "1 per 25 guests",
    "Corporate Event": "N/A",
    "Wedding Reception": "1 per 25 guests",
    "Charity Gala": "1 per 40 guests",
    "Trade Show": "N/A",
    "Private Dinner": "N/A",
  },
};
