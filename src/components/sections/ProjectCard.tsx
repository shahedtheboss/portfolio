import { Github, Linkedin, ScanLine } from "lucide-react";

import { type Project } from "@/data/portfolio";
import { projectImages } from "@/lib/media";
import { Chip } from "@/components/motion/Chip";
import { DrawLink } from "@/components/motion/DrawLink";
import { Panel } from "@/components/motion/Panel";
import { StatusLight, type StatusTone } from "@/components/motion/StatusLight";

function statusTone(status: Project["status"]): StatusTone {
  if (status.startsWith("Completed")) return "ok";
  if (status === "In Progress") return "warn";
  return "idle";
}

export function ProjectCard({ project }: { project: Project }) {
  const image = projectImages[project.image];
  const isVisit = project.kind === "industrialVisit";
  return (
    <Panel as="article" className="group flex h-full flex-col" bodyClassName="flex flex-1 flex-col">
      <div className="relative overflow-hidden border-b border-border">
        {typeof image === "string" ? (
          <img
            src={image}
            alt={`Illustration for ${project.title}`}
            loading="lazy"
            width={1200}
            height={800}
            className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid aspect-[3/2] grid-cols-2 gap-1 overflow-hidden bg-background">
            {Array.from(image).map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`${project.title} — photo ${index + 1}`}
                loading="lazy"
                width={600}
                height={800}
                className="h-full min-h-0 w-full object-contain"
              />
            ))}
          </div>
        )}
        <span className="telemetry absolute left-3 top-3 inline-flex items-center gap-2 border border-border bg-background/85 px-2.5 py-1 text-foreground backdrop-blur">
          <StatusLight tone={statusTone(project.status)} />
          {project.status.toUpperCase()}
        </span>
      </div>
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
        <ul className="mt-4 flex flex-wrap gap-2 pt-2">
          {project.tech.map((t) => (
            <Chip as="li" key={t}>
              {t}
            </Chip>
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
  );
}
