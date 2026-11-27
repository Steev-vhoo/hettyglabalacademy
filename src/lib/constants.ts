// Shared by server and browser code — keep this file free of database imports.
export const ACADEMIES = ["nursing", "celpip", "english", "mentorship", "general"] as const;
export type Academy = (typeof ACADEMIES)[number];

export const BOOKING_STATUSES = ["pending_payment", "pending", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const POST_CATEGORIES = ["Nursing & NCLEX", "CELPIP", "English", "Mentorship & Careers", "Academy News"] as const;
