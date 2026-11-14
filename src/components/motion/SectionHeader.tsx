import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Decode } from "./Decode";

type SectionHeaderProps = {
  /** "01".."09" */
  index: string;
  /** id for the h2 (use with aria-labelledby on the section). */
  id: string;
  eyebrow: string;
  title: string | ReactNode;
  large?: boolean;
  className?: string;
};

/** Huge outlined numeral, mono eyebrow with a rule, and an h2. */
export function SectionHeader({ index, id, eyebrow, title, large, className }: SectionHeaderProps) {
  return (
    <header className={cn("relative mb-12 md:mb-16", className)}>
      <span aria-hidden="true" className="numeral pointer-events-none block -translate-x-1">
        {index}
      </span>
      <div className="relative -mt-[0.2em] max-w-4xl md:-mt-16">
        <p className="telemetry flex items-center gap-3 text-muted-foreground">
          <span className="h-px w-10 bg-primary" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2
          id={id}
          className={cn(
            "display-type mt-4 [overflow-wrap:anywhere] text-foreground",
            large ? "text-[clamp(1.6rem,1rem+3.4vw,4rem)]" : "text-[clamp(1.6rem,1rem+3vw,3.6rem)]",
          )}
        >
          {typeof title === "string" ? <Decode text={title} /> : title}
        </h2>
      </div>
    </header>
  );
}
