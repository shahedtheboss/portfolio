import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import { ResearchVisual } from "@/components/canvas/research/ResearchVisual";
import type { Variant } from "@/components/canvas/research/types";
import { Chip } from "@/components/motion/Chip";
import { cn } from "@/lib/utils";

export const COLLAPSED_H = 88;

type Interest = { key: string; title: string; body: string; topics: readonly string[] };

type Props = {
  interest: Interest;
  Icon: LucideIcon;
  variant: Variant;
  active: boolean;
  reduced: boolean;
  fine: boolean;
  onActivate: () => void;
  onIntent: () => void;
  onIntentCancel: () => void;
};

/** One accordion channel: slim strip when collapsed, full panel when active. */
export function ResearchRow({
  interest,
  Icon,
  variant,
  active,
  reduced,
  fine,
  onActivate,
  onIntent,
  onIntentCancel,
}: Props) {
  const btnId = `research-btn-${interest.key}`;
  const bodyId = `research-body-${interest.key}`;
  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.article
      initial={false}
      animate={{ height: active ? "auto" : COLLAPSED_H }}
      transition={transition}
      onPointerEnter={fine ? onIntent : undefined}
      onPointerLeave={fine ? onIntentCancel : undefined}
      data-active={active}
      className={cn(
        "group relative overflow-hidden border-b border-border transition-colors duration-300",
        active ? "bg-signal-dim" : "hover:bg-card/60",
      )}
    >
      <h3 className="m-0">
        <button
          id={btnId}
          type="button"
          aria-expanded={active}
          aria-controls={bodyId}
          onClick={onActivate}
          onFocus={onIntent}
          onBlur={onIntentCancel}
          data-cursor="link"
          style={{ height: COLLAPSED_H }}
          className="flex w-full items-center gap-4 px-1 text-left md:gap-8 md:px-4"
        >
          <span
            aria-hidden="true"
            className={cn(
              "numeral w-[3.2rem] shrink-0 text-[3.2rem] transition-colors duration-300 md:w-[5.5rem] md:text-[4.5rem]",
              active && "[-webkit-text-stroke-color:var(--primary)]",
            )}
          >
            {interest.key}
          </span>
          <span
            className={cn(
              "font-display min-w-0 flex-1 text-[length:var(--text-step-1)] font-semibold leading-snug transition-colors duration-300",
              active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
            )}
          >
            {interest.title}
          </span>
          <Icon
            size={20}
            aria-hidden="true"
            className={cn("shrink-0 transition-colors", active ? "text-primary" : "text-n-3")}
          />
        </button>
      </h3>

      <div
        id={bodyId}
        role="region"
        aria-labelledby={btnId}
        className="grid gap-6 px-1 pb-8 pt-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-10 md:px-4 md:pl-[8.25rem]"
      >
        <div className="order-2 md:order-1">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {interest.body}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {interest.topics.map((topic, i) => (
              <motion.li
                key={topic}
                initial={false}
                animate={
                  active ? { opacity: 1, y: 0 } : { opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }
                }
                transition={
                  reduced ? { duration: 0 } : { duration: 0.4, delay: active ? 0.25 + i * 0.06 : 0 }
                }
              >
                <Chip>{topic}</Chip>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="order-1 aspect-[16/7] w-full border border-border bg-background/50 md:order-2 md:aspect-[16/9]">
          <ResearchVisual variant={variant} active={active} />
        </div>
      </div>
    </motion.article>
  );
}
