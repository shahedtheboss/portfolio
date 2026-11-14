import { Github } from "lucide-react";
import { LayoutGroup, MotionConfig } from "motion/react";

import { identity, projectCategories } from "@/data/portfolio";
import { Button } from "@/components/motion/Button";
import { SectionHeader } from "@/components/motion/SectionHeader";

import { CategoryBand } from "./projects/CategoryBand";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative scroll-mt-20 border-t border-border bg-surface py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="04"
          id="projects-title"
          eyebrow="FEATURED PROJECTS"
          title="Work in progress, work in production"
        />
        <p className="-mt-4 mb-16 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted-foreground">
          All project details and source codes are available in my GitHub:
          <Button href={identity.github} target="_blank" rel="noreferrer" variant="ghost">
            <Github size={14} />
            Visit my GitHub
          </Button>
        </p>
        <MotionConfig reducedMotion="user">
          <LayoutGroup>
            <div className="space-y-24">
              {projectCategories.map((c, i) => (
                <CategoryBand key={c.key} category={c} index={i} />
              ))}
            </div>
          </LayoutGroup>
        </MotionConfig>
      </div>
    </section>
  );
}
