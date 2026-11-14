import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { useReveal } from "./useReveal";

type MaskLinesProps = {
  text: string;
  className?: string;
  /** Delay between words in ms. */
  step?: number;
};

/** Paragraph whose words rise out of a clip mask in sequence once in view. */
export function MaskLines({ text, className, step = 14 }: MaskLinesProps) {
  const { ref, hidden } = useReveal<HTMLParagraphElement>(0.2);
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const style: CSSProperties = {
          transitionDelay: `${Math.min(i * step, 700)}ms`,
        };
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              className={cn(
                "inline-block transition-transform duration-[640ms] ease-[var(--ease-out-expo)]",
                hidden && "translate-y-full",
              )}
              style={style}
            >
              {w}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </p>
  );
}
