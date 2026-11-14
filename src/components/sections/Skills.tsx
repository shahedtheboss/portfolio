import { useState } from "react";

import { Panel } from "@/components/motion/Panel";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { useMediaQuery } from "./about/useMediaQuery";
import { SkillsBackdrop } from "./skills/SkillsBackdrop";
import { SkillGraph } from "./skills/SkillGraph";
import { SkillList } from "./skills/SkillList";
import { SkillReadout } from "./skills/SkillReadout";

const READOUT_ID = "skills-readout";

export function Skills() {
  const [active, setActive] = useState(0);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative isolate scroll-mt-20 overflow-clip border-t border-border py-16 md:py-32"
    >
      <SkillsBackdrop />
      <div className="container-x">
        <SectionHeader
          index="03"
          id="skills-title"
          eyebrow="TECHNICAL SKILLS"
          title="Tools of the trade, honestly labeled"
        />
        <Panel
          scan={false}
          className="mb-6 hidden border-border/70 bg-[color-mix(in_oklab,var(--card)_60%,transparent)] [@media(hover:hover)_and_(pointer:fine)]:backdrop-blur-md transition-colors hover:border-n-3 lg:block"
          label={<span aria-hidden="true">SKILL NETWORK / 8 LAYERS</span>}
          bodyClassName="grid xl:grid-cols-[minmax(0,1fr)_19rem]"
        >
          <div className="p-5">
            <SkillGraph
              active={active}
              onActivate={setActive}
              animate={desktop && !reduced}
              controls={READOUT_ID}
            />
          </div>
          <div className="border-t border-border xl:border-l xl:border-t-0">
            <SkillReadout active={active} id={READOUT_ID} />
          </div>
        </Panel>
        <SkillList active={active} onActivate={setActive} pulse={!desktop && !reduced} />
      </div>
    </section>
  );
}
