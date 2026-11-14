import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ChipProps = {
  children: ReactNode;
  tone?: "default" | "signal";
  as?: "li" | "span";
  className?: string;
};

/** Small mono tag. */
export function Chip({ children, tone = "default", as: Tag = "span", className }: ChipProps) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-[11px] leading-5 transition-colors",
        tone === "signal"
          ? "border-primary/50 bg-signal-dim text-primary"
          : "border-border bg-background/60 text-muted-foreground hover:border-n-3 hover:text-foreground",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
