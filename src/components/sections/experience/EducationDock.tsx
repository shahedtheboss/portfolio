import { GraduationCap } from "lucide-react";
import { motion } from "motion/react";

import { Panel } from "@/components/motion/Panel";
import { education } from "@/data/portfolio";

import { useArmedInView } from "./useArmedInView";

const brackets = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-0 right-0 border-b-2 border-r-2",
];
const offsets = [
  { x: -14, y: -14 },
  { x: 14, y: -14 },
  { x: -14, y: 14 },
  { x: 14, y: 14 },
];

/** Education docked at the end of the log: slides up, then brackets lock in. */
export function EducationDock() {
  const { ref, hidden, reduced } = useArmedInView<HTMLDivElement>("-10%");

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={hidden ? { opacity: 0, y: 48 } : { opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-16"
    >
      <Panel
        label={<span aria-hidden="true">DOCK</span>}
        bodyClassName="p-6 sm:flex sm:items-center sm:gap-6 md:p-8"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-primary text-primary">
          <GraduationCap size={26} aria-hidden="true" />
        </span>
        <div className="mt-4 sm:mt-0">
          <h3 className="font-display text-lg font-semibold text-foreground md:text-xl">
            {education.institution}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {education.program} · {education.status} · {education.graduation}
          </p>
        </div>
      </Panel>
      {brackets.map((cls, i) => (
        <motion.span
          key={cls}
          aria-hidden="true"
          initial={false}
          animate={
            hidden
              ? { x: offsets[i]?.x ?? 0, y: offsets[i]?.y ?? 0, opacity: 0 }
              : { x: 0, y: 0, opacity: 1 }
          }
          transition={
            reduced ? { duration: 0 } : { duration: 0.5, delay: 0.55, ease: [0.2, 0.9, 0.1, 1] }
          }
          className={`pointer-events-none absolute z-10 h-4 w-4 border-primary ${cls}`}
        />
      ))}
    </motion.div>
  );
}
