import { motion, type MotionValue } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const pts = (n: number, f: (t: number) => [number, number]) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const [x, y] = f(i / n);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

/** Deterministic generative drawings, one per feed (viewBox 400x300). */
const ART: readonly (readonly string[])[] = [
  [
    pts(160, (t) => [
      200 + 150 * Math.sin(6 * Math.PI * t + Math.PI / 2),
      150 + 105 * Math.sin(4 * Math.PI * t),
    ]),
    pts(80, (t) => [40 + 320 * t, 150 + 40 * Math.sin(10 * Math.PI * t)]),
  ],
  [
    pts(50, (t) => [
      400 * t,
      215 - 46 * Math.sin(t * 10.8) - 28 * Math.sin(t * 23.5 + 1) - 16 * Math.sin(t * 44),
    ]),
    "M300 60 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0 M300 14 V106 M254 60 H346",
  ],
  [
    pts(160, (t) => {
      const a = t * Math.PI * 5;
      const r = 8 + t * 120;
      return [200 + r * Math.cos(a), 150 + r * 0.78 * Math.sin(a)];
    }),
    "M30 270 H110 V230 H170 V190 H230 V150 H290 V110 H350 V70",
  ],
];

type FeedArtProps = { index: number; draw: MotionValue<number> | number; className?: string };

/** Faint line drawing for a feed; `draw` is a path-length progress (0..1). */
export function FeedArt({ index, draw, className }: FeedArtProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
    >
      {(ART[index] ?? []).map((d, i) => (
        <motion.path
          key={i}
          d={d}
          pathLength={draw}
          stroke="var(--primary)"
          strokeOpacity={i === 0 ? 0.5 : 0.28}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

const lines =
  "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, color-mix(in oklab, var(--n-5) 5%, transparent) 2px, color-mix(in oklab, var(--n-5) 5%, transparent) 3px)";

/** Scanlines, a slow rolling band and a faint vignette. Decorative. */
export function ScanOverlay() {
  const reduced = usePrefersReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: lines }} />
      {!reduced && (
        <motion.div
          className="absolute inset-x-0 top-0 h-1/3"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--signal-dim), transparent)",
          }}
          initial={{ y: "-100%" }}
          animate={{ y: "300%" }}
          transition={{ duration: 5.5, ease: "linear", repeat: Infinity }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 90px color-mix(in oklab, var(--background) 70%, transparent)",
        }}
      />
    </div>
  );
}
