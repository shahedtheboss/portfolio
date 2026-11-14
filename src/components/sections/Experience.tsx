import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

import { SectionHeader } from "@/components/motion/SectionHeader";
import { experience } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { spring } from "@/lib/motion";

import { EducationDock } from "./experience/EducationDock";
import { LogEntry } from "./experience/LogEntry";

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 60%"],
  });
  const smooth = useSpring(scrollYProgress, spring);
  const fill = useTransform(smooth, (v) => (reduced ? 1 : Math.min(1, Math.max(0, v))));
  const headTop = useTransform(fill, (v) => `${v * 100}%`);

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative scroll-mt-20 border-t border-border bg-surface py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="06"
          id="experience-title"
          eyebrow="EXPERIENCE"
          title="Experience & engineering exposure"
        />
        <div ref={listRef} className="relative ml-2 md:ml-[7.5rem]">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-n-1" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: fill }}
            className="absolute inset-y-0 left-0 w-px origin-top bg-primary shadow-[0_0_10px_var(--primary)]"
          />
          {!reduced && (
            <motion.span
              aria-hidden="true"
              style={{ top: headTop }}
              className="absolute -left-[6px] z-10 h-3 w-3 -translate-y-1/2 rotate-45 border border-primary bg-background shadow-[0_0_14px_var(--primary)]"
            />
          )}
          <ol>
            {experience.map((item, i) => (
              <LogEntry
                key={item.title}
                index={i}
                kind={item.kind}
                period={item.period}
                title={item.title}
                body={item.body}
              />
            ))}
          </ol>
        </div>
        <EducationDock />
      </div>
    </section>
  );
}
