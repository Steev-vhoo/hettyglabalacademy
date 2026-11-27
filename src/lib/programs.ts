import type { Academy } from "./constants";

export type Program = {
  slug: string;
  /** Service categories (admin › Services) that are bookable from this department's page. */
  academies: Academy[];
  name: string;
  short: string;
  label: string;
  icon: "stethoscope" | "globe" | "book" | "people";
  intro: string;
  teaser: string;
  offerings: string[];
  forWho: string[];
  atAGlance?: { label: string; value: string }[];
  sections: { id?: string; title: string; body: string; points?: string[]; glance?: { label: string; value: string }[] }[];
  howWeHelp: string[];
  faqs: { q: string; a: string }[];
  officialLinks?: { label: string; href: string }[];
};

/*
 * The academy's three departments.
 * Exam facts reflect the official NCSBN and CELPIP descriptions as of 2026 —
 * re-check the linked official pages before launch and whenever the exams change.
 */
export const programs: Program[] = [
  {
    slug: "nursing",
    academies: ["nursing"],
    name: "Nursing Education",
    short: "NCLEX-RN & Nursing",
    label: "Department of Nursing Education",
    icon: "stethoscope",
    intro:
      "NCLEX-RN preparation, nursing exam coaching and clinical education from a practising Registered Nurse — for internationally educated nurses preparing to practise in Canada, the United States and beyond.",
    teaser: "NCLEX-RN preparation, exam coaching, clinical knowledge and guidance for internationally educated nurses.",
    offerings: [
      "NCLEX-RN preparation",
      "Nursing examination coaching",
      "Clinical knowledge and skills education",
      "Nursing mentorship",
      "Internationally educated nurse (IEN) guidance",
    ],
    forWho: [
      "Internationally educated nurses preparing for the NCLEX-RN",
      "Nursing students who want strong clinical-judgement habits early",
      "Nurses who sat the exam before and want a focused plan for the next attempt",
    ],
    atAGlance: [
      { label: "Format", value: "Computerised adaptive test (CAT)" },
      { label: "Length", value: "85–150 questions" },
      { label: "Time limit", value: "Up to 5 hours" },
      { label: "Result", value: "Pass / fail" },
    ],
    sections: [
      {
        id: "nclex",
        title: "What is the NCLEX-RN?",
        body: "The National Council Licensure Examination for Registered Nurses (NCLEX-RN) is the licensing exam nurses must pass to practise as an RN in the United States and in most Canadian provinces. It is developed by the NCSBN.",
      },
      {
        title: "How the exam works",
        body: "The NCLEX is adaptive: each answer you give helps decide the difficulty of the next question. The exam stops when it is confident whether you are above or below the passing standard, so test-takers see different numbers of questions.",
        points: [
          "The Next Generation NCLEX (NGN) focuses on clinical judgement, using unfolding case studies",
          "Question types include multiple response, matrix/grid, drag-and-drop, highlight and bow-tie items",
          "Content follows the NCLEX client-needs categories: safe and effective care, health promotion, psychosocial and physiological integrity",
        ],
      },
      {
        title: "The road for internationally educated nurses",
        body: "Internationally educated nurses usually need their education and registration assessed before they can book the NCLEX. In most Canadian provinces this starts with the National Nursing Assessment Service (NNAS); in the US it goes through the state board of nursing. Requirements differ by province, state and country of education, so always confirm with your regulator — we help you understand each step.",
      },
    ],
    howWeHelp: [
      "A personal study plan based on a diagnostic of your strengths and gaps",
      "Clinical-judgement practice with NGN-style case studies and rationales",
      "Individual and group tutoring on the topics that cost you the most marks",
      "Test-day strategy, time management and confidence coaching",
      "Guidance through the registration steps for your province or state",
    ],
    faqs: [
      { q: "Do you guarantee a pass?", a: "No honest program can. We give you a clear plan, focused practice and honest feedback so you walk in prepared." },
      { q: "I trained outside Ghana — can I join?", a: "Yes. The academy supports internationally educated nurses from any country, and sessions run online in your own timezone." },
      { q: "Is teaching ever in Twi?", a: "Sessions are in English. Some of Harriet's free video lessons explain nursing topics in Twi, and you're welcome to ask questions in Twi during mentorship." },
    ],
    officialLinks: [
      { label: "NCSBN — NCLEX", href: "https://www.nclex.com/" },
      { label: "NNAS (Canada)", href: "https://www.nnas.ca/" },
    ],
  },
  {
    slug: "english",
    academies: ["english", "celpip"],
    name: "English Language Academy",
    short: "English for Beginners & CELPIP",
    label: "English Language Academy for Beginners",
    icon: "book",
    intro:
      "English for beginners through to CELPIP — the Canadian English language test. Build confidence in speaking, writing, reading and listening with individual or group tutoring.",
    teaser: "English for beginners, CELPIP preparation, and speaking, writing, reading and listening practice.",
    offerings: [
      "CELPIP preparation",
      "English proficiency coaching",
      "Speaking and writing practice",
      "Reading and listening strategies",
      "Individual and group tutoring",
    ],
    forWho: [
      "Beginners who want a confident foundation in everyday English",
      "Nurses and professionals who need CELPIP for Canadian immigration or work",
      "Anyone who wants to communicate clearly at work and in daily life abroad",
    ],
    atAGlance: [
      { label: "Levels", value: "Beginner to advanced" },
      { label: "Sessions", value: "Individual or group" },
      { label: "Test focus", value: "CELPIP-General & LS" },
      { label: "Delivery", value: "Online — Zoom or WhatsApp" },
    ],
    sections: [
      {
        title: "English for beginners",
        body: "We start where you are. A short assessment places you at the right level, then lessons build vocabulary, grammar and confidence through real conversations — introducing yourself, phone calls, appointments, workplace English and more.",
        points: ["Everyday and workplace conversation", "Pronunciation and listening for different accents", "Clear, simple writing — emails, forms and messages"],
      },
      {
        id: "celpip",
        title: "What is CELPIP?",
        body: "The Canadian English Language Proficiency Index Program (CELPIP) is a general English test designated by Immigration, Refugees and Citizenship Canada (IRCC). It uses everyday Canadian English and is taken entirely on a computer, in one sitting.",
        glance: [
          { label: "Duration", value: "About 3 hours (General)" },
          { label: "Skills", value: "Listening, Reading, Writing, Speaking" },
          { label: "Scores", value: "CELPIP levels M, 1–12" },
        ],
      },
      {
        title: "CELPIP-General vs CELPIP-General LS",
        body: "CELPIP-General tests all four skills and is used for permanent residence and many professional designations. CELPIP-General LS tests Listening and Speaking only and is used for Canadian citizenship applications. CELPIP levels line up with the Canadian Language Benchmarks (CLB), which is how IRCC and many employers set their requirements.",
        points: [
          "Listening — conversations, news items and discussions",
          "Reading — correspondence, diagrams, information and viewpoints",
          "Writing — an email and a response to a survey question",
          "Speaking — eight tasks such as giving advice, describing a scene and making predictions",
        ],
      },
    ],
    howWeHelp: [
      "A placement assessment and a learning plan for your level",
      "Timed speaking practice with personal feedback",
      "Writing practice with corrections for task, vocabulary and tone",
      "Strategies for every CELPIP reading and listening question type",
      "A study timeline that fits your target test date",
    ],
    faqs: [
      { q: "I'm a complete beginner — is this for me?", a: "Yes. The academy is designed for beginners as well as advanced learners. We start with a short assessment and teach at your pace." },
      { q: "Which CELPIP level do I need?", a: "It depends on your program — for example Express Entry, a provincial nominee program or your profession. Check the official requirement, then we plan backwards from it." },
      { q: "Is CELPIP accepted by nursing regulators?", a: "Some Canadian nursing regulators accept CELPIP and some prefer other tests. Check your regulator's current list before booking your test." },
    ],
    officialLinks: [{ label: "CELPIP official site", href: "https://www.celpip.ca/" }],
  },
  {
    slug: "mentorship",
    academies: ["mentorship"],
    name: "Global Mentorship & Career Development",
    short: "International Careers",
    label: "Global & International Mentorship",
    icon: "globe",
    intro:
      "International career mentorship from someone who has built a nursing career across borders — pathway guidance, interview preparation and the confidence to pursue opportunities worldwide.",
    teaser: "International career mentorship, pathway guidance, interview preparation and career readiness.",
    offerings: [
      "International career mentorship",
      "Professional development",
      "Educational pathway guidance",
      "Interview preparation",
      "Career readiness coaching",
    ],
    forWho: [
      "Internationally trained nurses and professionals planning a move abroad",
      "Newcomers who want to plan their next career step",
      "Students choosing an educational or professional pathway",
    ],
    sections: [
      {
        title: "Topics we cover",
        body: "Every mentorship session starts with your goals and your story.",
        points: [
          "Understanding licensing and educational pathways",
          "CV, cover letter and LinkedIn reviews",
          "Interview preparation and mock interviews",
          "Professional confidence and career readiness",
          "Wellbeing and settling into a new country",
        ],
      },
    ],
    howWeHelp: [
      "A clear, written action plan after each session",
      "Follow-up check-ins on WhatsApp",
      "Honest advice based on real experience across countries",
    ],
    faqs: [
      { q: "Is mentorship only for nurses?", a: "It's designed for nurses and healthcare professionals, but anyone seeking international educational or career guidance is welcome to book a discovery call." },
      { q: "Can I book a group session with friends or colleagues?", a: "Yes — choose a group session when you book, or message us on WhatsApp to arrange one." },
    ],
  },
];

export const programBySlug = (slug: string) => programs.find((p) => p.slug === slug);
