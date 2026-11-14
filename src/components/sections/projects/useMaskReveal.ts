import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Reveal-on-view for cards. SSR-safe: content is visible on the server and during hydration.
 * `startHidden` is for cards mounted after hydration (e.g. "View more"), so there is no flash.
 */
export function useMaskReveal<T extends Element>(startHidden: boolean, threshold = 0.2) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [armed, setArmed] = useState(startHidden);
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

  return { ref, hidden: armed && !seen && !reduced };
}
