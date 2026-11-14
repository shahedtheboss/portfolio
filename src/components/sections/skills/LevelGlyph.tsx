import { motion } from "motion/react";

import type { SkillGroup } from "@/data/portfolio";
import { cn } from "@/lib/utils";

import { levelShape } from "./graphLayout";

type Level = SkillGroup["level"];

export function LevelGlyph({
  level,
  animate = false,
}: {
  level: Level;
  /** Loop a gentle sequential pulse across the three marks. */
  animate?: boolean;
}) {
  const shape = levelShape(level);
  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn(
            "h-2 w-2 border border-primary bg-signal-dim",
            shape === "circle" && "rounded-full",
            shape === "diamond" && "rotate-45",
          )}
          animate={animate ? { opacity: [0.35, 1, 0.35] } : { opacity: 1 }}
          transition={
            animate
              ? { duration: 1.8, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  );
}
