import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * SSR-safe one-shot "reached" flag. Content is visible on the server and first client
 * render, is armed (hidden) in an effect, and released when the element crosses the
 * given bottom rootMargin (e.g. "-35%" = once it passes 65% of the viewport height).
 */
export function useArmedInView<T extends Element = HTMLDivElement>(bottomMargin = "-35%") {
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
      { rootMargin: `0px 0px ${bottomMargin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, bottomMargin]);

  return { ref, hidden: armed && !seen, seen, reduced };
}
