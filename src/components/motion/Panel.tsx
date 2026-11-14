import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PanelProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  bodyClassName?: string;
  /** Header strip label (decorative telemetry or a real label). */
  label?: ReactNode;
  /** Right-aligned header meta. */
  meta?: ReactNode;
  /** Scanline sweep on hover. */
  scan?: boolean;
};

const corner = "pointer-events-none absolute h-2 w-2 border-primary";

/** Hairline box with corner brackets and an optional header strip. */
export function Panel({
  children,
  as: Tag = "div",
  className,
  bodyClassName,
  label,
  meta,
  scan = true,
}: PanelProps) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden border border-border bg-card/85",
        scan && "panel-scan",
        className,
      )}
    >
      <span aria-hidden="true" className={cn(corner, "left-0 top-0 border-l border-t")} />
      <span aria-hidden="true" className={cn(corner, "right-0 top-0 border-r border-t")} />
      <span aria-hidden="true" className={cn(corner, "bottom-0 left-0 border-b border-l")} />
      <span aria-hidden="true" className={cn(corner, "bottom-0 right-0 border-b border-r")} />
      {(label || meta) && (
        <div className="telemetry flex items-center justify-between gap-3 border-b border-border px-4 py-2 text-muted-foreground">
          <span className="min-w-0 truncate">{label}</span>
          <span className="shrink-0">{meta}</span>
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
}
