import { useMemo } from "react";
import { motion } from "motion/react";

import { skillGroups } from "@/data/portfolio";
import { cn } from "@/lib/utils";

import { LevelGlyph } from "./LevelGlyph";
import { COL_W, VB_H, VB_W, layoutEdges, layoutNodes, levelShape } from "./graphLayout";

type SkillGraphProps = {
  active: number;
  onActivate: (i: number) => void;
  /** Run signal pulses (desktop, motion allowed). */
  animate: boolean;
  controls: string;
};

const R = 5;

function Pulse({ d, fast, delay }: { d: string; fast: boolean; delay: number }) {
  return (
    <motion.path
      d={d}
      pathLength={100}
      fill="none"
      stroke="var(--primary)"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeDasharray="6 94"
      initial={{ strokeDashoffset: 0 }}
      animate={{ strokeDashoffset: -100 }}
      transition={{ duration: fast ? 1.6 : 4.5, repeat: Infinity, ease: "linear", delay }}
    />
  );
}

function NodeShape({ x, y, shape, lit }: { x: number; y: number; shape: string; lit: boolean }) {
  const cls = cn(
    "transition-[fill,stroke,opacity] duration-300",
    lit ? "fill-primary stroke-primary" : "fill-card stroke-n-3",
  );
  if (shape === "circle") return <circle cx={x} cy={y} r={R} className={cls} strokeWidth={1.5} />;
  if (shape === "diamond")
    return (
      <rect
        x={x - R}
        y={y - R}
        width={R * 2}
        height={R * 2}
        transform={`rotate(45 ${x} ${y})`}
        className={cls}
        strokeWidth={1.5}
      />
    );
  return (
    <rect x={x - R} y={y - R} width={R * 2} height={R * 2} className={cls} strokeWidth={1.5} />
  );
}

/** Layered node graph: one layer per skill group; the active layer and its edges light up. */
export function SkillGraph({ active, onActivate, animate, controls }: SkillGraphProps) {
  const { nodes, edges } = useMemo(() => {
    const n = layoutNodes(skillGroups);
    return { nodes: n, edges: layoutEdges(n) };
  }, []);

  return (
    <div>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="block h-auto w-full"
        fill="none"
      >
        {skillGroups.map((g, i) => (
          <rect
            key={g.title}
            x={i * COL_W}
            y={0}
            width={COL_W}
            height={VB_H}
            fill={i === active ? "var(--signal-dim)" : "transparent"}
            className="transition-[fill] duration-300"
            onPointerEnter={() => onActivate(i)}
          />
        ))}
        {edges.map((e) => {
          const lit = e.from === active || e.to === active;
          return (
            <path
              key={e.key}
              d={e.d}
              strokeWidth={lit ? 1.2 : 1}
              className={cn(
                "transition-[stroke,opacity] duration-300",
                lit ? "stroke-primary opacity-70" : "stroke-n-2 opacity-40",
              )}
            />
          );
        })}
        {animate &&
          edges.map((e, i) => {
            const lit = e.from === active || e.to === active;
            if (!lit && i % 9 !== 0) return null;
            return <Pulse key={`p-${e.key}-${lit}`} d={e.d} fast={lit} delay={(i % 7) * 0.35} />;
          })}
        {skillGroups.map((g, gi) =>
          (nodes[gi] ?? []).map((n, k) => (
            <NodeShape
              key={`${gi}-${k}`}
              x={n.x}
              y={n.y}
              shape={levelShape(g.level)}
              lit={gi === active}
            />
          )),
        )}
      </svg>
      <div className="grid grid-cols-8" role="group" aria-label="Skill layers">
        {skillGroups.map((g, i) => (
          <button
            key={g.title}
            type="button"
            aria-pressed={i === active}
            aria-controls={controls}
            onClick={() => onActivate(i)}
            onFocus={() => onActivate(i)}
            onPointerEnter={() => onActivate(i)}
            className={cn(
              "flex flex-col items-center gap-2 border-t px-1 pb-1 pt-3 text-center transition-colors",
              i === active
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            <LevelGlyph level={g.level} />
            <span className="text-[11px] leading-tight [overflow-wrap:anywhere]">{g.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
