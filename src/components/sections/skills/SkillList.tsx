import { skillGroups } from "@/data/portfolio";
import { Chip } from "@/components/motion/Chip";
import { Panel } from "@/components/motion/Panel";
import { useReveal } from "@/components/motion/useReveal";
import { cn } from "@/lib/utils";

import { LevelGlyph } from "./LevelGlyph";

function GroupPanel({
  group,
  index,
  active,
  pulse,
  onActivate,
}: {
  group: (typeof skillGroups)[number];
  index: number;
  active: boolean;
  pulse: boolean;
  onActivate: (i: number) => void;
}) {
  const { ref, hidden } = useReveal<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      data-active={active}
      onPointerEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      style={{ transitionDelay: hidden ? "0ms" : `${(index % 3) * 80}ms` }}
      className={cn(
        "h-full transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] data-[active=true]:[&>article]:border-primary/60",
        hidden && "translate-y-6 opacity-0",
      )}
    >
      <Panel
        as="article"
        label={group.level.toUpperCase()}
        meta={<LevelGlyph level={group.level} animate={pulse || active} />}
        className="h-full border-border/70 bg-[color-mix(in_oklab,var(--card)_88%,transparent)] [@media(hover:hover)_and_(pointer:fine)]:bg-[color-mix(in_oklab,var(--card)_62%,transparent)] [@media(hover:hover)_and_(pointer:fine)]:backdrop-blur-md transition-colors hover:border-n-3"
        bodyClassName="p-5"
      >
        <h3 className="font-display text-lg font-semibold text-foreground">{group.title}</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {group.skills.map((skill, i) => (
            <li
              key={skill}
              style={{ transitionDelay: hidden ? "0ms" : `${Math.min(i * 40, 400)}ms` }}
              className={cn(
                "transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]",
                hidden && "translate-y-2 opacity-0",
              )}
            >
              <Chip>{skill}</Chip>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/** Full accessible list: every group and every skill. Hover/focus drives the graph. */
export function SkillList({
  active,
  onActivate,
  pulse,
}: {
  active: number;
  onActivate: (i: number) => void;
  /** Animate every header glyph (small screens, where the graph is hidden). */
  pulse: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, i) => (
        <GroupPanel
          key={group.title}
          group={group}
          index={i}
          active={active === i}
          pulse={pulse}
          onActivate={onActivate}
        />
      ))}
    </div>
  );
}
