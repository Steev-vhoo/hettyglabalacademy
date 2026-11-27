/**
 * Editable site copy that isn't managed in the admin dashboard yet.
 * Only add testimonials the student has agreed to publish. The section stays hidden while this list is empty.
 */
export const testimonials: { quote: string; name: string; detail: string }[] = [];

export const generalFaqs = [
  { q: "Are the classes online or in person?", a: "Classes and consultations are online, so you can join from Ghana, Canada or anywhere else. Your booking confirmation includes the meeting link." },
  { q: "Can I join from outside Ghana?", a: "Yes. When you book, available times are shown in your own timezone." },
  { q: "How do I pay?", a: "In Ghana you can pay in cedis with Mobile Money or card through Paystack. Outside Ghana you can pay by card in Canadian dollars through Stripe. Payment pages are hosted by the provider, so we never see your card details." },
  { q: "Can I reschedule or cancel?", a: "Yes — reply to your confirmation email or message us on WhatsApp at least 24 hours before your session and we'll help you move it." },
  { q: "Which exams do you prepare students for?", a: "The NCLEX (RN and PN) for nursing licensure, and CELPIP for Canadian immigration and citizenship. We also teach English communication and offer career mentorship." },
  { q: "Do I need an account to book?", a: "No, but a free student account lets you see all your bookings in one place and speeds up future bookings." },
];
