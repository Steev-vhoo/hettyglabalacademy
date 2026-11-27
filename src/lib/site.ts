export const site = {
  name: "Hetty Global Academy",
  shortName: "HGA",
  tagline: "Empowering Minds. Elevating Careers. Transforming Futures.",
  motto: "Learn · Grow · Excel",
  pillars: ["Nursing", "Language", "Education", "Mentorship"],
  description:
    "NCLEX preparation, CELPIP test prep, English communication and career mentorship led by Registered Nurse Harriet K — for Ghanaian learners at home and abroad.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "registerednursehetty.ca@gmail.com",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  founder: { name: "Harriet K", title: "Registered Nurse · Founder & CEO" },
  social: {
    tiktokHandle: process.env.NEXT_PUBLIC_TIKTOK_HANDLE || "stylenurse1",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  },
};

export const tiktokProfileUrl = `https://www.tiktok.com/@${site.social.tiktokHandle}`;

export function whatsappLink(text = "Hello Hetty Global Academy, I'd like to ask about your programs.") {
  if (!site.whatsapp) return "/contact";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/videos", label: "Videos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
