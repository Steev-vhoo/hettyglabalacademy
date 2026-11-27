/**
 * Site photography in one place.
 * To add a photo: put the file in /public/images (e.g. harriet-portrait.jpg) and set `src: "/images/harriet-portrait.jpg"`.
 * While `src` is empty, a designed brand panel is shown instead, so the layout never looks broken.
 */
export type Media = { src: string; alt: string; label?: string; focus?: string; icon: "nurse" | "study" | "people" | "book" | "globe" | "video" };

export const media = {
  heroPortrait: { src: "/images/harriet-stethoscope-portrait.webp", focus: "50% 30%", alt: "Harriet K, Registered Nurse and founder of Hetty Global Academy", label: "Taught by a Registered Nurse", icon: "nurse" },
  heroClass: { src: "/images/harriet-scrubs-square.webp", alt: "Harriet K in nursing scrubs", label: "1:1 coaching with Harriet", focus: "50% 25%", icon: "video" },
  heroStudy: { src: "", alt: "A nurse studying for an exam", label: "Personal study plans", icon: "study" },
  aboutTop: { src: "/images/harriet-scrubs-landscape.webp", alt: "Harriet K, Registered Nurse, in scrubs", focus: "50% 30%", icon: "people" },
  aboutBottom: { src: "", alt: "A one-to-one coaching session", icon: "study" },
  hub: { src: "/images/harriet-scrubs-portrait.webp", alt: "Harriet K in nursing scrubs", focus: "50% 35%", icon: "nurse" },
  mentor: { src: "/images/harriet-stethoscope-portrait.webp", alt: "Portrait of Harriet K with her stethoscope", focus: "50% 25%", label: "Harriet K · RN", icon: "nurse" },
  connect: { src: "", alt: "A student in a video call with Harriet", icon: "video" },
  popup: { src: "/images/harriet-scrubs-portrait.webp", alt: "Harriet K, Registered Nurse", focus: "50% 30%", icon: "nurse" },
  program: {
    nclex: { src: "/images/harriet-stethoscope-wide.webp", alt: "Harriet K, Registered Nurse, with her stethoscope and hospital badge", focus: "50% 30%", icon: "nurse" },
    celpip: { src: "", alt: "Student practising for the CELPIP speaking test", icon: "globe" },
    english: { src: "", alt: "Nurses in conversation", icon: "book" },
    mentorship: { src: "", alt: "Mentoring session", icon: "people" },
  } as Record<string, Media>,
} satisfies Record<string, Media | Record<string, Media>>;
