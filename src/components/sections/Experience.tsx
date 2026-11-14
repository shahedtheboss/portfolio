import { GraduationCap } from "lucide-react";

import { education, experience } from "@/data/portfolio";
import { Panel } from "@/components/motion/Panel";
import { SectionHeader } from "@/components/motion/SectionHeader";

export function Experience() {
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
        <ol className="relative ml-2 border-l border-n-2 md:ml-[7.5rem]">
          {experience.map((item) => (
            <li key={item.title} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 border border-primary bg-background"
              />
              <p className="telemetry flex flex-wrap items-center gap-x-4 gap-y-1 text-primary md:absolute md:-left-[8.5rem] md:top-1 md:w-28 md:flex-col md:items-end md:gap-1 md:text-right">
                <span>{item.kind.toUpperCase()}</span>
                <span className="text-muted-foreground">{item.period}</span>
              </p>
              <h3 className="font-display text-[length:var(--text-step-1)] font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        <Panel
          className="mt-16"
          label="EDUCATION"
          bodyClassName="p-6 sm:flex sm:items-center sm:gap-6"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-primary text-primary">
            <GraduationCap size={26} />
          </span>
          <div className="mt-4 sm:mt-0">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {education.institution}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {education.program} · {education.status} · {education.graduation}
            </p>
          </div>
        </Panel>
      </div>
    </section>
  );
}
