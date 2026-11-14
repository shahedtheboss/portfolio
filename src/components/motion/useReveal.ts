import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Reveal-on-view state that is SSR-safe: content is visible on the server and on the
 * first client render, then armed (hidden) in an effect and released when seen.
 */
export function useReveal<T extends Element = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") return;
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold]);

  return { ref, hidden: armed && !seen, seen, reduced };
}
