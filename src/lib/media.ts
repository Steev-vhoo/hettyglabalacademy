/**
 * Site photography in one place.
 * To add a photo: put the file in /public/images (e.g. harriet-portrait.jpg) and set `src: "/images/harriet-portrait.jpg"`.
 * While `src` is empty, a designed brand panel is shown instead, so the layout never looks broken.
 */
export type Media = { src: string; alt: string; label?: string; focus?: string; icon: "nurse" | "study" | "people" | "book" | "globe" | "video" };

export const media = {
  heroPortrait: { src: "/images/harriet-vancouver-portrait.webp", focus: "56% 30%", alt: "Harriet K, founder of Hetty Global Academy, smiling at a restaurant overlooking Vancouver harbour at night", label: "Registered Nurse", icon: "nurse" },
  heroClass: { src: "/images/harriet-scrubs-square.webp", alt: "Harriet K in nursing scrubs", label: "1:1 coaching", focus: "50% 25%", icon: "video" },
  heroStudy: { src: "/images/harriet-stethoscope-portrait.webp", focus: "50% 22%", alt: "Harriet K with her stethoscope and hospital badge", label: "Nursing educator", icon: "study" },
  aboutTop: { src: "/images/harriet-scrubs-landscape.webp", alt: "Harriet K, Registered Nurse, in scrubs", focus: "50% 30%", icon: "people" },
  aboutBottom: { src: "", alt: "A one-to-one coaching session", icon: "study" },
  hub: { src: "/images/harriet-scrubs-portrait.webp", alt: "Harriet K in nursing scrubs", focus: "50% 35%", icon: "nurse" },
  mentor: { src: "/images/harriet-stethoscope-portrait.webp", alt: "Portrait of Harriet K with her stethoscope", focus: "50% 25%", label: "Harriet K · RN", icon: "nurse" },
  connect: { src: "", alt: "A student in a video call with Harriet", icon: "video" },
  story: { src: "/images/harriet-vancouver-portrait.webp", alt: "Harriet K in Vancouver, Canada", focus: "50% 30%", icon: "globe" },
  popup: { src: "/images/harriet-scrubs-portrait.webp", alt: "Harriet K, Registered Nurse", focus: "50% 30%", icon: "nurse" },
  program: {
    nursing: { src: "/images/harriet-stethoscope-wide.webp", alt: "Harriet K, Registered Nurse, with her stethoscope and hospital badge", focus: "50% 30%", icon: "nurse" },
    english: { src: "/images/harriet-scrubs-landscape.webp", alt: "Harriet K, nursing educator", focus: "50% 30%", icon: "book" },
    mentorship: { src: "/images/harriet-vancouver-landscape.webp", alt: "Harriet K at a restaurant overlooking Vancouver harbour at night", focus: "70% 40%", icon: "globe" },
  } as Record<string, Media>,
} satisfies Record<string, Media | Record<string, Media>>;
