import { usualHoursText } from "./slots";

/**
 * Editable site copy that isn't managed in the admin dashboard yet.
 * Only add testimonials the student has agreed to publish. The section stays hidden while this list is empty.
 */
export const testimonials: { quote: string; name: string; detail: string }[] = [];

export const generalFaqs = [
  { q: "Who is the academy for?", a: "Internationally trained nurses and professionals, nursing students and English learners — in Ghana, across Africa, in Canada and worldwide." },
  { q: "Are the classes online or in person?", a: "Everything runs online. Consultations happen on Zoom or as a WhatsApp call — you choose when you book." },
  { q: "When are consultations held?", a: `${usualHoursText()} Need another time? Ask us on WhatsApp.` },
  { q: "Can I book an individual or a group session?", a: "Both. Choose individual or group when you book — group sessions are a great option for friends or colleagues preparing together." },
  { q: "Which exams do you prepare students for?", a: "The NCLEX-RN for nursing licensure, and CELPIP — the Canadian English language test. We also teach English for complete beginners and offer international career mentorship." },
  { q: "How do I pay?", a: "In Ghana you can pay in cedis with Mobile Money or card through Paystack. Outside Ghana you can pay by card in Canadian dollars through Stripe. Payment pages are hosted by the provider, so we never see your card details." },
  { q: "Can I book on WhatsApp instead?", a: "Yes. You can book online or simply message us on WhatsApp and we'll arrange a time with you." },
  { q: "Can I reschedule or cancel?", a: "Yes — reply to your confirmation email or message us on WhatsApp at least 24 hours before your session and we'll help you move it." },
  { q: "Do I need an account to book?", a: "No, but a free student account lets you see all your bookings in one place and speeds up future bookings." },
];
