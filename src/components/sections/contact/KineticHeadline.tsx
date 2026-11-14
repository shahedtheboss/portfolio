import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";

import { useRichPointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { ease } from "@/lib/motion";

import { useMinWidth } from "./useMinWidth";

type WordProps = {
  word: string;
  index: number;
  shown: boolean;
  reduced: boolean;
  stretch: string;
  px: MotionValue<number>;
};

function Word({ word, index, shown, reduced, stretch, px }: WordProps) {
  const dir = index % 2 ? -1 : 1;
  const skew = useTransform(px, (v) => v * 5 * dir);
  return (
    <span className="inline-block overflow-hidden align-top [padding-bottom:0.08em] [margin-bottom:-0.08em]">
      <motion.span style={{ skewX: skew }} className="inline-block">
        <motion.span
          initial={false}
          animate={
            shown || reduced ? { y: "0%", fontStretch: stretch } : { y: "105%", fontStretch: "62%" }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, delay: shown ? index * 0.07 : 0, ease: ease.outExpo }
          }
          className="inline-block"
        >
          {word}
        </motion.span>
      </motion.span>
    </span>
  );
}

/** The contact title as huge kinetic type. Renders as plain text inside the caller's h2. */
export function KineticHeadline({ text }: { text: string }) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>(0.2);
  const reduced = usePrefersReducedMotion();
  const rich = useRichPointer();
  const wide = useMinWidth(1280);
  const raw = useSpring(0, { stiffness: 90, damping: 18, mass: 0.8 });

  useEffect(() => {
    if (!rich) return;
    const onMove = (e: PointerEvent) => raw.set((e.clientX / window.innerWidth) * 2 - 1);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rich, raw]);

  const words = text.split(" ");
  const stretch = wide ? "125%" : "100%";

  return (
    <span ref={ref} className="block">
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <Word word={w} index={i} shown={seen} reduced={reduced} stretch={stretch} px={raw} />
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
