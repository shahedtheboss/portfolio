import { Brain, Cpu, Eye, Factory } from "lucide-react";

import { researchInterests } from "@/data/portfolio";
import { Chip } from "@/components/motion/Chip";
import { SectionHeader } from "@/components/motion/SectionHeader";

const researchIcons = [Brain, Cpu, Eye, Factory];

export function Research() {
  return (
    <section
      id="research"
      aria-labelledby="research-title"
      className="relative scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="05"
          id="research-title"
          eyebrow="RESEARCH INTERESTS"
          title={
            <>
              Where Engineering <span className="text-primary">Meets Intelligence</span>
            </>
          }
        />
        <div className="border-t border-border">
          {researchInterests.map((interest, i) => {
            const Icon = researchIcons[i % researchIcons.length] ?? Brain;
            return (
              <article
                key={interest.key}
                className="group grid gap-5 border-b border-border py-10 transition-colors hover:bg-signal-dim md:grid-cols-[7rem_1fr_1.3fr] md:gap-10 md:px-4"
              >
                <div className="flex items-center gap-4 md:block">
                  <span className="numeral block text-[4.5rem] transition-colors group-hover:[-webkit-text-stroke-color:var(--primary)]">
                    {interest.key}
                  </span>
                  <Icon size={18} className="text-primary md:mt-4" aria-hidden="true" />
                </div>
                <h3 className="font-display text-[length:var(--text-step-1)] font-semibold leading-snug text-foreground">
                  {interest.title}
                </h3>
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{interest.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {interest.topics.map((topic) => (
                      <Chip as="li" key={topic}>
                        {topic}
                      </Chip>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
