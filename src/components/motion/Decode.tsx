import { useEffect, useState, type ElementType } from "react";

import { useReveal } from "./useReveal";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\_-=+*#";

type DecodeProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Total scramble time in ms. */
  duration?: number;
};

/**
 * Scramble-to-text on first view. The final text is always in the DOM for SSR and
 * assistive tech; the scrambled glyphs are an aria-hidden overlay of identical length.
 */
export function Decode({ text, as: Tag = "span", className, duration = 900 }: DecodeProps) {
  const { ref, seen, reduced } = useReveal<HTMLElement>(0.3);
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!seen || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const locked = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < locked || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(p >= 1 ? null : out);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduced, text, duration]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown ?? text}</span>
    </Tag>
  );
}
