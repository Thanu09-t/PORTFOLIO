// Lightweight mutable store so the persistent R3F canvas can read scroll
// progress every frame without going through React state / re-renders.
export type SectionKey =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "certifications"
  | "education"
  | "contact";

export const scrollStore = {
  progress: 0, // 0..1 across the whole document
  velocity: 0,
  mouseX: 0, // -1..1
  mouseY: 0, // -1..1
  activeSection: "home" as SectionKey,
};
