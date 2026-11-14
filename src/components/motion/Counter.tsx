import { useEffect, useState } from "react";

import { useReveal } from "./useReveal";

type CounterProps = {
  value: number;
  className?: string;
  /** Zero-pad to this many digits. */
  pad?: number;
  duration?: number;
};

/** Counts up to `value` on first view; renders the final value on the server. */
export function Counter({ value, className, pad = 0, duration = 1200 }: CounterProps) {
  const { ref, seen, reduced } = useReveal<HTMLSpanElement>(0.4);
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!seen || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(p >= 1 ? null : Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduced, value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {String(n ?? value).padStart(pad, "0")}
    </span>
  );
}
