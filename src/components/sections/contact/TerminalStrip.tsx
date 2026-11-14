import { useEffect, useState } from "react";

import { useReveal } from "@/components/motion/useReveal";

const LINES = ["> open channel", "> handshake … ok", "> link established"];
const TOTAL = LINES.reduce((n, l) => n + l.length, 0);

/** Decorative handshake that types in once on view. Purely visual. */
export function TerminalStrip() {
  const { ref, hidden, seen, reduced } = useReveal<HTMLDivElement>(0.4);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!seen) return;
    const id = setInterval(() => setCount((c) => Math.min(TOTAL, c + 1)), 38);
    return () => clearInterval(id);
  }, [seen]);

  const full = reduced || (!hidden && !seen);
  let left = full ? TOTAL : count;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="mt-10 border border-border bg-background/60 px-4 py-4 font-mono text-xs text-muted-foreground md:text-sm"
    >
      {LINES.map((line, i) => {
        const take = Math.max(0, Math.min(line.length, left));
        left -= take;
        const last = i === LINES.length - 1;
        const typing = take > 0 && take < line.length;
        return (
          <p key={line} className="min-h-[1.5em] leading-6">
            <span className={last && take === line.length ? "text-primary" : undefined}>
              {line.slice(0, take)}
            </span>
            {(typing || (last && take === line.length)) && (
              <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-primary [animation:caret_1s_steps(1)_infinite]" />
            )}
          </p>
        );
      })}
    </div>
  );
}
