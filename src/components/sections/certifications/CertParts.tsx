import { Award, BadgeCheck, FileText } from "lucide-react";

import { DrawLink } from "@/components/motion/DrawLink";
import type { Certification } from "@/data/portfolio";
import { certificationMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

export function AwardBadge({ award, className }: { award: string; className?: string }) {
  return (
    <span
      className={cn(
        "telemetry inline-flex items-center gap-1.5 border border-primary/60 bg-background/90 px-2.5 py-1 text-primary",
        className,
      )}
    >
      <BadgeCheck size={12} aria-hidden="true" />
      {award}
    </span>
  );
}

export function CertLink({ item, className }: { item: Certification; className?: string }) {
  const media = certificationMedia[item.key];
  return (
    <DrawLink
      href={media.full}
      external
      className={cn("inline-flex items-center gap-2 font-mono text-xs text-primary", className)}
    >
      {media.isPdf ? <FileText size={14} /> : <Award size={14} />}
      View certificate
    </DrawLink>
  );
}

/** Title, issuer, period and body, shared by the grid, the index and the viewer. */
export function CertText({
  item,
  titleClassName,
}: {
  item: Certification;
  titleClassName?: string;
}) {
  return (
    <>
      <h3
        className={cn(
          "font-display text-base font-semibold leading-snug text-foreground",
          titleClassName,
        )}
      >
        {item.title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-primary">{item.issuer}</p>
      {item.period && (
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{item.period}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
    </>
  );
}
