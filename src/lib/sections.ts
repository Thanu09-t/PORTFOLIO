export const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "certifications",
  "education",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "certifications", label: "CERTIFICATIONS" },
  { id: "contact", label: "CONTACT" },
];

