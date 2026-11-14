import type { Project } from "@/data/portfolio";
import { projectImages } from "@/lib/media";
import { StatusLight, type StatusTone } from "@/components/motion/StatusLight";
import { cn } from "@/lib/utils";

import { useMaskReveal } from "./useMaskReveal";

function statusTone(status: Project["status"]): StatusTone {
  if (status.startsWith("Completed")) return "ok";
  if (status === "In Progress") return "warn";
  return "idle";
}

const ease = "ease-[var(--ease-out-expo)]";

/** Card image area: clip-path wipe with a leading signal edge, hover zoom and light sweep. */
export function ProjectMedia({ project, late }: { project: Project; late: boolean }) {
  const { ref, hidden } = useMaskReveal<HTMLDivElement>(late, 0.25);
  const image = projectImages[project.image];
  const zoom = cn(
    "duration-[1400ms] transition-transform",
    ease,
    hidden ? "scale-110" : "scale-100 group-hover:scale-[1.05]",
  );
  return (
    <div
      ref={ref}
      data-cursor="image"
      className="relative overflow-hidden border-b border-border bg-background"
    >
      <div
        className={cn(
          "transition-[clip-path] duration-[1100ms]",
          ease,
          hidden ? "[clip-path:inset(0_100%_0_0)]" : "[clip-path:inset(0_0%_0_0)]",
        )}
      >
        {typeof image === "string" ? (
          <img
            src={image}
            alt={`Illustration for ${project.title}`}
            loading="lazy"
            width={1200}
            height={800}
            className={cn("aspect-[3/2] w-full object-cover", zoom)}
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
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 z-10 w-px bg-primary shadow-[0_0_14px_var(--primary)] transition-[left,opacity] duration-[1100ms]",
          ease,
          hidden ? "left-0 opacity-100" : "left-full opacity-0",
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/10 opacity-0 group-hover:opacity-100 group-hover:[animation:sheen_900ms_var(--ease-out-expo)]"
      />
      <span className="telemetry absolute left-3 top-3 z-20 inline-flex items-center gap-2 border border-border bg-background/90 px-2.5 py-1 text-foreground">
        <StatusLight tone={statusTone(project.status)} />
        {project.status.toUpperCase()}
      </span>
    </div>
  );
}
