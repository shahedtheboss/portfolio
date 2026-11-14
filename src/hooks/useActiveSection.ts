import { useEffect, useState } from "react";

export const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "research",
  "experience",
  "certifications",
  "journey",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Tracks which of the nine sections crosses the middle band of the viewport. */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("home");
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}
