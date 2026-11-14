import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** True only for a hover-capable fine pointer (mouse/trackpad). False on SSR. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

/** Fine pointer and motion allowed: gate for cursor, tilt and magnetic effects. */
export function useRichPointer() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  return fine && !reduced;
}
