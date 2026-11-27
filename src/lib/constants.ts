// Shared by server and browser code — keep this file free of database imports.
export const ACADEMIES = ["nursing", "celpip", "english", "mentorship", "general"] as const;
export type Academy = (typeof ACADEMIES)[number];

export const BOOKING_STATUSES = ["pending_payment", "pending", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** The three departments and the service categories each one covers. */
export const DEPARTMENTS = {
  nursing: { label: "Nursing Education", academies: ["nursing"] },
  english: { label: "English Language Academy", academies: ["english", "celpip"] },
  mentorship: { label: "Global Mentorship & Career Development", academies: ["mentorship"] },
} as const;
export const ACADEMY_LABEL: Record<Academy, string> = {
  nursing: "Nursing Education",
  celpip: "English Language Academy — CELPIP",
  english: "English Language Academy",
  mentorship: "Global Mentorship & Career Development",
  general: "General (e.g. discovery call)",
};

export const SESSION_TYPES = ["individual", "group"] as const;
export type SessionType = (typeof SESSION_TYPES)[number];
export const PLATFORMS = ["zoom", "whatsapp"] as const;
export type Platform = (typeof PLATFORMS)[number];
export const PLATFORM_LABEL: Record<Platform, string> = { zoom: "Zoom video call", whatsapp: "WhatsApp call" };

export const RESOURCE_CATEGORIES = [
  "NCLEX study materials",
  "CELPIP practice resources",
  "English learning materials",
  "Downloadable study guides",
  "Nursing articles & links",
] as const;

export const POST_CATEGORIES = ["Nursing & NCLEX", "CELPIP", "English", "Mentorship & Careers", "Academy News"] as const;
