import type { Academy } from "./constants";

export type Program = {
  slug: string;
  academy: Academy;
  name: string;
  short: string;
  label: string; // e.g. "NCLEX Preparation"
  icon: "stethoscope" | "globe" | "book" | "people";
  intro: string;
  teaser: string;
  forWho: string[];
  atAGlance?: { label: string; value: string }[];
  sections: { title: string; body: string; points?: string[] }[];
  howWeHelp: string[];
  faqs: { q: string; a: string }[];
  officialLinks?: { label: string; href: string }[];
};

/*
 * Exam facts reflect the official NCSBN and CELPIP descriptions as of 2026.
 * Re-check the linked official pages before launch and whenever the exams change.
 */
export const programs: Program[] = [
  {
    slug: "nclex",
    teaser: "NCLEX-RN and NCLEX-PN preparation: clinical judgement, NGN-style practice and a personal study plan.",
    academy: "nursing",
    name: "Hetty Nursing Academy",
    short: "NCLEX Preparation",
    label: "NCLEX Preparation",
    icon: "stethoscope",
    intro:
      "Structured NCLEX preparation from a practising Registered Nurse — built for internationally educated nurses from Ghana preparing to practise in Canada or the United States.",
    forWho: [
      "Nurses trained in Ghana preparing for the NCLEX-RN or NCLEX-PN",
      "Nursing students who want to build strong clinical-judgement habits early",
      "Candidates who sat the exam before and want a focused plan for the next attempt",
    ],
    atAGlance: [
      { label: "Format", value: "Computerised adaptive test (CAT)" },
      { label: "Length", value: "85–150 questions" },
      { label: "Time limit", value: "Up to 5 hours" },
      { label: "Result", value: "Pass / fail" },
    ],
    sections: [
      {
        title: "What is the NCLEX?",
        body: "The National Council Licensure Examination (NCLEX) is the licensing exam nurses must pass to practise in the United States and in most Canadian provinces. It is developed by the NCSBN. The NCLEX-RN is for Registered Nurses and the NCLEX-PN for Practical Nurses.",
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
        title: "The road to sitting the exam",
        body: "Internationally educated nurses usually need their education and registration assessed before they can book the NCLEX. In most Canadian provinces this starts with the National Nursing Assessment Service (NNAS); in the US it goes through the state board of nursing. Requirements differ by province and state, so always confirm with your regulator.",
      },
    ],
    howWeHelp: [
      "A personal study plan based on a diagnostic of your strengths and gaps",
      "Clinical-judgement practice with NGN-style case studies and rationales",
      "One-to-one tutoring on the topics that cost you the most marks",
      "Test-day strategy, time management and confidence coaching",
      "Guidance on the application steps for your province or state",
    ],
    faqs: [
      { q: "Do you guarantee a pass?", a: "No honest program can. We give you a clear plan, focused practice and honest feedback so you walk in prepared." },
      { q: "Are classes online?", a: "Yes. Sessions run online, so you can join from Ghana, Canada or anywhere else. Times are shown in your own timezone when you book." },
      { q: "Do you prepare for NCLEX-PN as well as NCLEX-RN?", a: "Yes — tell us which exam you are sitting when you book and we will tailor the sessions." },
    ],
    officialLinks: [
      { label: "NCSBN — NCLEX", href: "https://www.nclex.com/" },
      { label: "NNAS (Canada)", href: "https://www.nnas.ca/" },
    ],
  },
  {
    slug: "celpip",
    teaser: "CELPIP test preparation across listening, reading, writing and speaking.",
    academy: "celpip",
    name: "Hetty CELPIP Academy",
    short: "Test Preparation",
    label: "CELPIP Test Preparation",
    icon: "globe",
    intro:
      "Focused coaching for the CELPIP test — Canada's English language proficiency test — with practice in all four skills and honest feedback on your speaking and writing.",
    forWho: [
      "Nurses and professionals applying for permanent residence in Canada",
      "Applicants for Canadian citizenship who need the CELPIP-General LS test",
      "Anyone who needs a specific CELPIP level for work, study or immigration",
    ],
    atAGlance: [
      { label: "Delivery", value: "Computer-based, one sitting" },
      { label: "Duration", value: "About 3 hours (General)" },
      { label: "Skills", value: "Listening, Reading, Writing, Speaking" },
      { label: "Scores", value: "CELPIP levels M, 1–12" },
    ],
    sections: [
      {
        title: "What is CELPIP?",
        body: "The Canadian English Language Proficiency Index Program (CELPIP) is a general English test designated by Immigration, Refugees and Citizenship Canada (IRCC). It uses everyday Canadian English and is taken entirely on a computer.",
      },
      {
        title: "CELPIP-General vs CELPIP-General LS",
        body: "CELPIP-General tests all four skills and is used for permanent residence and many professional designations. CELPIP-General LS tests Listening and Speaking only and is used for Canadian citizenship applications.",
      },
      {
        title: "Test sections",
        body: "Every part of the test is completed in a single sitting, and speaking responses are recorded by the computer.",
        points: [
          "Listening — conversations, news items and discussions",
          "Reading — correspondence, diagrams, information and viewpoints",
          "Writing — an email and a response to a survey question",
          "Speaking — eight tasks such as giving advice, describing a scene and making predictions",
        ],
      },
      {
        title: "Understanding your score",
        body: "Each skill receives a CELPIP level from M (minimal) up to 12. CELPIP levels line up with the Canadian Language Benchmarks (CLB), which is how IRCC and many employers set their requirements — so know the level you need before you book your test.",
      },
    ],
    howWeHelp: [
      "A diagnostic to find your current level in each skill",
      "Speaking practice with timed tasks and personal feedback",
      "Writing practice with corrections for task completion, vocabulary and tone",
      "Strategies for the listening and reading question types",
      "A study timeline that fits your target test date",
    ],
    faqs: [
      { q: "Which CELPIP level do I need?", a: "It depends on your program — for example Express Entry, a provincial nominee program or your profession. Check the official requirement, then we plan backwards from it." },
      { q: "Is CELPIP accepted by nursing regulators?", a: "Some Canadian nursing regulators accept CELPIP and some prefer other tests. Check your regulator's current list before booking." },
      { q: "Can I prepare if I'm still in Ghana?", a: "Yes. Coaching is online and the CELPIP test itself is offered at test centres in Canada and in several other countries." },
    ],
    officialLinks: [{ label: "CELPIP official site", href: "https://www.celpip.ca/" }],
  },
  {
    slug: "english",
    teaser: "Everyday and professional English for nurses and newcomers.",
    academy: "english",
    name: "Hetty English Academy",
    short: "Communication",
    label: "English Communication",
    icon: "book",
    intro:
      "Confident everyday and professional English for nurses and newcomers — speaking with patients and colleagues, writing clearly, and settling into life abroad.",
    forWho: [
      "Nurses preparing to work in English-speaking healthcare settings",
      "Newcomers who want to feel confident at work and in daily life",
      "Learners building a base before starting CELPIP preparation",
    ],
    sections: [
      {
        title: "What you'll practise",
        body: "Sessions are built around real situations rather than grammar drills.",
        points: [
          "Patient communication, handovers and phone calls",
          "Professional emails and documentation",
          "Interviews and workplace conversations",
          "Pronunciation and listening for different accents",
        ],
      },
    ],
    howWeHelp: ["Small-group and one-to-one sessions", "Role-plays based on real workplace scenarios", "Personal feedback after every session"],
    faqs: [{ q: "Do I need a certain level to join?", a: "No. We start with a short assessment and place you at the right level." }],
  },
  {
    slug: "mentorship",
    teaser: "One-to-one career guidance for nurses planning their next step, at home or abroad.",
    academy: "mentorship",
    name: "Hetty Mentorship",
    short: "Career Guidance",
    label: "Career Guidance",
    icon: "people",
    intro:
      "One-to-one career guidance from a nurse who has walked the path — planning your move, preparing your documents and growing your career once you arrive.",
    forWho: [
      "Ghanaian nurses considering working in Canada or abroad",
      "Nurses who have arrived and want to plan their next step",
      "Students choosing their path in nursing",
    ],
    sections: [
      {
        title: "Topics we cover",
        body: "Every mentorship session starts with your goals.",
        points: ["Understanding licensing pathways", "CV and cover letter reviews", "Interview preparation", "Building a study and work plan", "Wellbeing and settling in"],
      },
    ],
    howWeHelp: ["A clear, written action plan after each session", "Follow-up check-ins on WhatsApp", "Honest advice based on real experience"],
    faqs: [{ q: "Is mentorship only for nurses?", a: "It is designed for nurses and nursing students, but healthcare professionals in related fields are welcome to book a discovery call." }],
  },
];

export const programBySlug = (slug: string) => programs.find((p) => p.slug === slug);
export const programByAcademy = (a: string) => programs.find((p) => p.academy === a);
