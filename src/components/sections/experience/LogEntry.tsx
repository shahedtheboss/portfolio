import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { useArmedInView } from "./useArmedInView";

type Props = {
  index: number;
  kind: string;
  period: string;
  title: string;
  body: string;
};

/** A log entry that stamps in when the playhead reaches it. */
export function LogEntry({ index, kind, period, title, body }: Props) {
  const { ref, hidden, reduced } = useArmedInView<HTMLLIElement>("-35%");
  const lit = !hidden;
  const snap = reduced ? { duration: 0 } : { duration: 0.28, ease: [0.2, 0.9, 0.1, 1] as const };

  return (
    <li ref={ref} className="relative pb-14 pl-8 last:pb-0 md:pl-14">
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={lit ? { scale: reduced ? 1 : [1.9, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={snap}
        className={cn(
          "absolute -left-[5px] top-1.5 h-2.5 w-2.5 border transition-[background-color,border-color,box-shadow] duration-300",
          lit
            ? "border-primary bg-primary shadow-[0_0_12px_var(--primary)]"
            : "border-n-2 bg-background",
        )}
      />
      <motion.div
        initial={false}
        animate={lit ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
        transition={snap}
        style={{ transformOrigin: "left top" }}
      >
        <div className="relative pt-3">
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={lit ? { opacity: [1, 0.35], scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={reduced ? { duration: 0 } : { duration: lit ? 0.5 : 0, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
            className="absolute inset-x-0 top-0 h-px bg-primary shadow-[0_0_8px_var(--primary)]"
          />
          <p className="telemetry flex flex-wrap items-center gap-x-3 gap-y-1 text-primary">
            <span aria-hidden="true" className="text-n-3">
              {String(index + 1).padStart(3, "0")}
            </span>
            <span>
              <span aria-hidden="true">[ </span>
              {kind.toUpperCase()}
              <span aria-hidden="true"> ]</span>
            </span>
            <span className="text-muted-foreground">{period}</span>
          </p>
        </div>
        <h3 className="font-display mt-3 text-[length:var(--text-step-2)] font-semibold leading-tight text-foreground">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {body}
        </p>
      </motion.div>
    </li>
  );
}
