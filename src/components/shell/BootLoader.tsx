import { useEffect, useState } from "react";

import { lockScroll, unlockScroll } from "@/hooks/useLenis";
import { cn } from "@/lib/utils";

const LINES = [
  "mounting perception stack",
  "loading policy weights",
  "calibrating sensor array",
  "syncing environment model",
  "arming reward signal",
  "handshake complete",
];

const STEP = 200;

/** Decorative boot overlay. Client-only: SSR content is never blocked. */
export function BootLoader() {
  const [phase, setPhase] = useState<"idle" | "run" | "wipe" | "done">("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let booted = false;
    try {
      booted = sessionStorage.getItem("booted") === "1";
    } catch {
      /* storage unavailable */
    }
    if (reduced || booted) {
      setPhase("done");
      return;
    }
    setPhase("run");
    lockScroll();
    const timers: number[] = [];
    LINES.forEach((_, i) => timers.push(window.setTimeout(() => setCount(i + 1), (i + 1) * STEP)));
    timers.push(window.setTimeout(() => setPhase("wipe"), LINES.length * STEP + 120));
    timers.push(
      window.setTimeout(
        () => {
          setPhase("done");
          try {
            sessionStorage.setItem("booted", "1");
          } catch {
            /* storage unavailable */
          }
        },
        LINES.length * STEP + 120 + 520,
      ),
    );
    return () => {
      timers.forEach(clearTimeout);
      unlockScroll();
    };
  }, []);

  if (phase === "idle" || phase === "done") return null;
  const pct = Math.round((count / LINES.length) * 100);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[80] flex items-end bg-background transition-[clip-path] duration-500 ease-[var(--ease-in-out-quart)]",
        phase === "wipe" ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]",
      )}
    >
      <div className="blueprint-grid absolute inset-0 opacity-60" />
      <div className="container-x relative pb-[10vh]">
        <ul className="telemetry space-y-2 text-muted-foreground">
          {LINES.slice(0, count).map((l) => (
            <li key={l} className="flex gap-3">
              <span className="text-primary">[ OK ]</span>
              {l}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border">
            <div
              className="h-px bg-primary transition-[width] duration-200 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="telemetry w-10 text-right text-primary">{pct}%</span>
        </div>
      </div>
    </div>
  );
}
