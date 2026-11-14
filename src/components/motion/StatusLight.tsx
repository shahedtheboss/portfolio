import { cn } from "@/lib/utils";

export type StatusTone = "ok" | "active" | "idle" | "warn";

const tones: Record<StatusTone, string> = {
  ok: "bg-primary",
  active: "bg-primary",
  idle: "bg-n-3",
  warn: "bg-secondary",
};

/** Decorative state light; pair with a text label for meaning. */
export function StatusLight({ tone, className }: { tone: StatusTone; className?: string }) {
  const pulse = tone === "active" || tone === "warn";
  return (
    <span aria-hidden="true" className={cn("relative inline-flex h-2 w-2 shrink-0", className)}>
      {pulse && (
        <span
          className={cn("absolute inset-0 rounded-full", tones[tone])}
          style={{ animation: "status-ring 1.8s var(--ease-out-expo) infinite" }}
        />
      )}
      <span className={cn("relative h-2 w-2 rounded-full", tones[tone])} />
    </span>
  );
}
