import { useState } from "react";
import { ArrowRight, ArrowUp, Github } from "lucide-react";

import { identity, projects, projectCategories } from "@/data/portfolio";
import { scrollToTarget } from "@/hooks/useLenis";
import { Button } from "@/components/motion/Button";
import { SectionHeader } from "@/components/motion/SectionHeader";

import { ProjectCard } from "./ProjectCard";

function ProjectCategoryBand({
  category,
  index,
}: {
  category: (typeof projectCategories)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const items = projects.filter((p) => p.category === category.key);
  const projectCount = items.filter((p) => p.kind !== "industrialVisit").length;
  const visitCount = items.length - projectCount;
  const shown = expanded ? items : items.slice(0, 2);
  const remaining = items.length - shown.length;
  const remainingVisits = items
    .slice(shown.length)
    .filter((p) => p.kind === "industrialVisit").length;
  const remainingLabel =
    remainingVisits === remaining
      ? remaining === 1
        ? "industrial visit"
        : "industrial visits"
      : remaining === 1
        ? "project"
        : "projects";

  return (
    <div id={`projects-${category.key}`} className="grid scroll-mt-24 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <span aria-hidden="true" className="numeral block text-[clamp(4rem,9vw,8rem)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="display-type mt-3 text-[length:var(--text-step-1)] [overflow-wrap:anywhere] text-foreground">
            {category.label}
          </h3>
          <div className="mt-3 space-y-1">
            <p className="telemetry text-primary">
              {projectCount} {projectCount === 1 ? "PROJECT" : "PROJECTS"}
            </p>
            {visitCount > 0 && (
              <p className="telemetry text-primary">
                {visitCount} {visitCount === 1 ? "INDUSTRIAL VISIT" : "INDUSTRIAL VISITS"}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-8">
        <div className="grid gap-5 md:grid-cols-2">
          {shown.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
        {(remaining > 0 || (expanded && items.length > 2)) && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                if (expanded) scrollToTarget(`#projects-${category.key}`);
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <>
                  View less <ArrowUp size={16} />
                </>
              ) : (
                <>
                  View more ({remaining} more {remainingLabel}) <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

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
        <div className="space-y-24">
          {projectCategories.map((c, i) => (
            <ProjectCategoryBand key={c.key} category={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
