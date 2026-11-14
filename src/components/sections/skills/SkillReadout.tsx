import { AnimatePresence, motion } from "motion/react";

import { skillGroups } from "@/data/portfolio";
import { Chip } from "@/components/motion/Chip";

import { LevelGlyph } from "./LevelGlyph";

const list = {
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/** Side readout for the selected layer: title, level and its skills as staggered chips. */
export function SkillReadout({ active, id }: { active: number; id: string }) {
  const group = skillGroups[active];
  if (!group) return null;
  return (
    <div id={id} role="region" aria-label="Selected skill group" className="p-5">
      <p className="telemetry flex items-center gap-3 text-primary">
        <LevelGlyph level={group.level} />
        {group.level.toUpperCase()}
      </p>
      <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground">
        {group.title}
      </h3>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={active}
          variants={list}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {group.skills.map((s) => (
            <motion.li key={s} variants={item}>
              <Chip>{s}</Chip>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
