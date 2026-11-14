import { useId, useLayoutEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

import { segmentPath, type Waypoints } from "./useWaypoints";

export type RouteStatus = "completed" | "in-progress" | "ahead";

type RoutePathProps = {
  geom: Waypoints;
  /** Status of the item each segment leads INTO (segment k joins point k-1 to k). */
  statuses: RouteStatus[];
  progress: MotionValue<number>;
  /** Draw everything and hide the marker. */
  still: boolean;
  /** Called with the number of waypoints the marker has (almost) reached. */
  onReach: (count: number) => void;
};

const LOOKAHEAD = 48;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function strokeFor(status: RouteStatus) {
  if (status === "in-progress") return "text-secondary";
  if (status === "ahead") return "text-n-4";
  return "text-primary";
}

/** One <path> per segment, drawn by scroll progress, with a marker on the leading end. */
export function RoutePath({ geom, statuses, progress, still, onReach }: RoutePathProps) {
  const uid = useId().replace(/:/g, "");
  const base = useRef<(SVGPathElement | null)[]>([]);
  const drawn = useRef<(SVGPathElement | null)[]>([]);
  const masks = useRef<(SVGPathElement | null)[]>([]);
  const marker = useRef<SVGGElement>(null);
  const lens = useRef<number[]>([]);
  const reached = useRef(-1);

  const segs = geom.pts.flatMap((p, i) => {
    const a = geom.pts[i - 1];
    return a ? [segmentPath(a, p)] : [];
  });
  const st = (k: number): RouteStatus => statuses[k] ?? "completed";

  const update = (p: number) => {
    const L = lens.current;
    if (L.length !== segs.length) return;
    const total = L.reduce((s, n) => s + n, 0);
    const pos = still ? total : clamp(p, 0, 1) * total;
    let cum = 0;
    let at = 0;
    let count = 1;
    L.forEach((len, k) => {
      const f = clamp((pos - cum) / len, 0, 1);
      const target = st(k) === "ahead" ? masks.current[k] : drawn.current[k];
      if (target) {
        target.setAttribute("stroke-dasharray", `${len}`);
        target.setAttribute("stroke-dashoffset", `${len * (1 - f)}`);
      }
      if (pos + LOOKAHEAD >= cum + len) count = k + 2;
      if (pos >= cum) at = k;
      cum += len;
    });
    if (count !== reached.current) {
      reached.current = count;
      onReach(count);
    }
    const el = base.current[at];
    const g = marker.current;
    if (!el || !g || still) return;
    let start = 0;
    for (let k = 0; k < at; k++) start += L[k] ?? 0;
    const segLen = L[at] ?? 0;
    const d = clamp(pos - start, 0, segLen);
    const a = el.getPointAtLength(clamp(d - 2, 0, segLen));
    const b = el.getPointAtLength(clamp(d + 2, 0, segLen));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
    g.setAttribute("transform", `translate(${b.x} ${b.y}) rotate(${ang})`);
  };

  useLayoutEffect(() => {
    lens.current = base.current.slice(0, segs.length).map((el) => el?.getTotalLength() ?? 0);
    reached.current = -1;
    update(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geom, still]);

  useMotionValueEvent(progress, "change", update);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      width={geom.w}
      height={geom.h}
      viewBox={`0 0 ${geom.w} ${geom.h}`}
    >
      <defs>
        {segs.map((d, k) =>
          st(k) === "ahead" ? (
            <mask
              key={k}
              id={`${uid}-m${k}`}
              maskUnits="userSpaceOnUse"
              x={0}
              y={-20}
              width={geom.w}
              height={geom.h + 40}
            >
              <path
                ref={(el) => {
                  masks.current[k] = el;
                }}
                d={d}
                fill="none"
                stroke="#fff"
                strokeWidth={8}
              />
            </mask>
          ) : null,
        )}
      </defs>
      {/* faint full route */}
      {segs.map((d, k) => (
        <path
          key={`b${k}`}
          ref={(el) => {
            base.current[k] = el;
          }}
          d={d}
          fill="none"
          stroke="var(--n-2)"
          strokeWidth={1}
          strokeDasharray={st(k) === "ahead" ? "4 6" : undefined}
        />
      ))}
      {/* drawn route, styled by the status of the item each segment leads to */}
      {segs.map((d, k) => {
        const ahead = st(k) === "ahead";
        return (
          <path
            key={`d${k}`}
            ref={(el) => {
              drawn.current[k] = el;
            }}
            d={d}
            fill="none"
            className={strokeFor(st(k))}
            stroke="currentColor"
            strokeWidth={ahead ? 1.5 : 2}
            strokeLinecap="round"
            strokeDasharray={ahead ? "4 6" : undefined}
            mask={ahead ? `url(#${uid}-m${k})` : undefined}
            style={ahead ? undefined : { filter: "drop-shadow(0 0 4px currentColor)" }}
          />
        );
      })}
      {!still && (
        <g ref={marker} className="text-primary">
          <circle r={11} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
          <path d="M0 -7L6 6L0 3L-6 6Z" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}
