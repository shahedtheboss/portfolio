import { skillGroups, type SkillGroup } from "@/data/portfolio";
import { Chip } from "@/components/motion/Chip";
import { Panel } from "@/components/motion/Panel";
import { SectionHeader } from "@/components/motion/SectionHeader";

/** Three equal-weight marks per level label; shape differs, none implies rank. */
function LevelGlyph({ level }: { level: SkillGroup["level"] }) {
  const mark =
    level === "Currently Practicing"
      ? "rounded-full"
      : level === "Working Knowledge"
        ? "rotate-45"
        : "";
  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`h-2 w-2 border border-primary bg-signal-dim ${mark}`} />
      ))}
    </span>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="03"
          id="skills-title"
          eyebrow="TECHNICAL SKILLS"
          title="Tools of the trade, honestly labeled"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <Panel
              key={group.title}
              as="article"
              label={group.level.toUpperCase()}
              meta={<LevelGlyph level={group.level} />}
              className="h-full"
              bodyClassName="p-5"
            >
              <h3 className="font-display text-lg font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Chip as="li" key={skill}>
                    {skill}
                  </Chip>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
}
