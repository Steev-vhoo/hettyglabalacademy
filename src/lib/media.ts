/**
 * Site photography in one place.
 * To add a photo: put the file in /public/images (e.g. harriet-portrait.jpg) and set `src: "/images/harriet-portrait.jpg"`.
 * While `src` is empty, a designed brand panel is shown instead, so the layout never looks broken.
 */
export type Media = { src: string; alt: string; label?: string; icon: "nurse" | "study" | "people" | "book" | "globe" | "video" };

export const media = {
  heroPortrait: { src: "", alt: "Harriet K, Registered Nurse and founder of Hetty Global Academy", label: "Taught by a Registered Nurse", icon: "nurse" },
  heroClass: { src: "", alt: "An online NCLEX study session", label: "Live online classes", icon: "video" },
  heroStudy: { src: "", alt: "A nurse studying for an exam", label: "Personal study plans", icon: "study" },
  aboutTop: { src: "", alt: "Harriet with nursing students", icon: "people" },
  aboutBottom: { src: "", alt: "A one-to-one coaching session", icon: "study" },
  hub: { src: "", alt: "A nurse in scrubs smiling", icon: "nurse" },
  mentor: { src: "", alt: "Portrait of Harriet K", label: "Harriet K · RN", icon: "nurse" },
  connect: { src: "", alt: "A student in a video call with Harriet", icon: "video" },
  program: {
    nclex: { src: "", alt: "Nurse reviewing clinical notes", icon: "nurse" },
    celpip: { src: "", alt: "Student practising for the CELPIP speaking test", icon: "globe" },
    english: { src: "", alt: "Nurses in conversation", icon: "book" },
    mentorship: { src: "", alt: "Mentoring session", icon: "people" },
  } as Record<string, Media>,
} satisfies Record<string, Media | Record<string, Media>>;
