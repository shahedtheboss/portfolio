import { Github, Linkedin, ScanLine } from "lucide-react";

import { type Project } from "@/data/portfolio";
import { Chip } from "@/components/motion/Chip";
import { DrawLink } from "@/components/motion/DrawLink";
import { Panel } from "@/components/motion/Panel";
import { Tilt } from "@/components/motion/Tilt";
import { cn } from "@/lib/utils";

import { ProjectMedia } from "./projects/ProjectMedia";
import { useMaskReveal } from "./projects/useMaskReveal";

const bracket =
  "pointer-events-none absolute h-2 w-2 border-primary transition-[width,height] duration-300 ease-[var(--ease-out-expo)] group-hover:h-5 group-hover:w-5 group-focus-within:h-5 group-focus-within:w-5";

/** `late` is true for cards mounted after hydration ("View more"). */
export function ProjectCard({ project, late = false }: { project: Project; late?: boolean }) {
  const isVisit = project.kind === "industrialVisit";
  const { ref: chipsRef, hidden: chipsHidden } = useMaskReveal<HTMLUListElement>(late, 0.3);
  return (
    <Tilt className="h-full" max={3}>
      <Panel
        as="article"
        className="group flex h-full flex-col transition-colors duration-300 hover:border-n-3"
        bodyClassName="relative flex flex-1 flex-col"
      >
        <span aria-hidden="true" className={cn(bracket, "left-0 top-0 border-l border-t")} />
        <span aria-hidden="true" className={cn(bracket, "right-0 top-0 border-r border-t")} />
        <span aria-hidden="true" className={cn(bracket, "bottom-0 left-0 border-b border-l")} />
        <span aria-hidden="true" className={cn(bracket, "bottom-0 right-0 border-b border-r")} />
        <ProjectMedia project={project} late={late} />
        <div className="flex flex-1 flex-col p-5">
          <p className="telemetry text-primary">{project.categoryLabel.toUpperCase()}</p>
          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
          <ul className="mt-4 space-y-1.5">
            {project.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                <ScanLine size={12} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
          <ul ref={chipsRef} className="mt-4 flex flex-wrap gap-2 pt-2">
            {project.tech.map((t, i) => (
              <li
                key={t}
                style={{ transitionDelay: chipsHidden ? "0ms" : `${Math.min(i * 45, 450)}ms` }}
                className={cn(
                  "transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]",
                  chipsHidden && "translate-y-2 opacity-0",
                )}
              >
                <Chip>{t}</Chip>
              </li>
            ))}
          </ul>
          {project.link && (
            <DrawLink
              href={project.link}
              external
              className="mt-auto inline-flex items-center gap-2 self-start pt-5 font-mono text-xs text-primary"
            >
              {isVisit ? <Linkedin size={14} /> : <Github size={14} />}
              {isVisit ? "View post on LinkedIn" : "View source on GitHub"}
            </DrawLink>
          )}
        </div>
      </Panel>
    </Tilt>
  );
}
