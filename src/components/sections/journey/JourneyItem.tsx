import { motion } from "motion/react";

import { StatusLight } from "@/components/motion/StatusLight";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { RouteStatus } from "./RoutePath";

type JourneyItemProps = {
  step: string;
  title: string;
  body: string;
  status: RouteStatus;
  /** Layout only: which side the text sits on at md+. */
  left: boolean;
  /** Content is hidden until `revealed` (only armed after measurement, never on SSR). */
  armed: boolean;
  revealed: boolean;
  wide: boolean;
  nodeRef: (el: HTMLElement | null) => void;
};

function Node({ status }: { status: RouteStatus }) {
  if (status === "in-progress") {
    return (
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border border-secondary"
          style={{ animation: "status-ring 1.8s var(--ease-out-expo) infinite 0.9s" }}
        />
        <StatusLight tone="warn" className="h-3 w-3 [&>span]:h-3 [&>span]:w-3" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "block h-3 w-3 rounded-full border",
        status === "completed"
          ? "border-primary bg-primary shadow-[0_0_10px_var(--primary)]"
          : "border-n-3 bg-background",
      )}
    />
  );
}

export function JourneyItem({
  step,
  title,
  body,
  status,
  left,
  armed,
  revealed,
  wide,
  nodeRef,
}: JourneyItemProps) {
  const hidden = armed && !revealed;
  const side = wide ? (left ? -48 : 48) : 0;
  return (
    <li className="relative grid grid-cols-[1.5rem_1fr] gap-x-4 pb-12 md:grid-cols-[1fr_12rem_1fr] md:gap-x-6 md:pb-16">
      <span className="relative z-10 block h-6 md:col-start-2 md:row-start-1">
        <span
          ref={nodeRef}
          className={cn(
            "absolute top-3 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
            left ? "left-1 md:left-[15%]" : "left-3 md:left-[85%]",
          )}
        >
          <Node status={status} />
        </span>
      </span>
      <motion.div
        initial={false}
        animate={{ opacity: hidden ? 0 : 1, x: hidden ? side : 0, y: hidden && !wide ? 16 : 0 }}
        transition={{ duration: hidden ? 0 : 0.7, ease: ease.outExpo }}
        className={cn("md:row-start-1", left ? "md:col-start-1 md:text-right" : "md:col-start-3")}
      >
        <div
          className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", left && "md:justify-end")}
        >
          <span className="font-mono text-xs text-primary">{step}</span>
          <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
          {status === "in-progress" && (
            <span className="bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-secondary-foreground">
              IN PROGRESS
            </span>
          )}
          {status === "ahead" && (
            <span className="border border-n-3 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              AHEAD
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      </motion.div>
    </li>
  );
}
