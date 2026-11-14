import { useEffect, useRef } from "react";

import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

import { ARROWS, BUS_X, EDGES, L1, L2, LAYERS, NODES, PORT, POSES, SHOULDER } from "./net-layout";
import { simSignal } from "./signal";

const FULL = "0 0 520 400";
const COMPACT = "296 28 224 290";

type Pulse = { edge: number; p: number; speed: number; on: boolean };

const hair = "fill-none stroke-n-4 [vector-effect:non-scaling-stroke]";
const hairLit = "fill-none stroke-primary [vector-effect:non-scaling-stroke]";

/** Decorative line-art robot wired to a policy net that mirrors the live simulation. */
export function RobotNet({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const $ = (id: string) => svg.querySelector<SVGElement>(`[data-id="${id}"]`);
    const all = (sel: string) => Array.from(svg.querySelectorAll<SVGElement>(sel));
    const set = (el: Element | null, a: Record<string, string | number>) => {
      if (el) for (const k in a) el.setAttribute(k, String(a[k]));
    };

    const compactMq = window.matchMedia("(max-width: 767px)");
    const applyView = () => svg.setAttribute("viewBox", compactMq.matches ? COMPACT : FULL);
    applyView();
    compactMq.addEventListener("change", applyView);

    const cores = LAYERS.map((n, l) =>
      Array.from({ length: n }, (_, i) => svg.querySelector<SVGElement>(`[data-n="${l}-${i}"]`)),
    );
    const act = LAYERS.map((n) => new Array<number>(n).fill(0.12));
    const pulseEls = all("[data-pulse]");
    const pulses: Pulse[] = pulseEls.map(() => ({ edge: 0, p: 0, speed: 0, on: false }));
    const eye = $("eye");
    const tip = $("tip");
    const body = $("body");
    const upper = $("upper");
    const fore = $("fore");
    const joints = [$("j-elbow"), $("j-wrist"), $("j-shoulder")];
    const claw = $("claw");
    const bars = all("[data-bar]");
    const cable = $("cable-pulse");
    const rnd = (() => {
      let s = 11;
      return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
    })();

    const spawn = (pl: Pulse) => {
      let r = rnd() * simSignal.inputs.reduce((a, b) => a + b, 0);
      let i = 0;
      for (; i < 3; i++) {
        r -= simSignal.inputs[i] ?? 0;
        if (r <= 0) break;
      }
      const n1 = LAYERS[1];
      pl.edge = i * n1 + Math.floor(rnd() * n1);
      pl.p = 0;
      pl.speed = 0.7 + rnd() * 0.6;
      pl.on = true;
    };
    const advance = (pl: Pulse) => {
      const e = EDGES[pl.edge];
      if (!e) {
        pl.on = false;
        return;
      }
      const l = e.l + 1;
      const row = act[l];
      if (row) row[e.j] = 1;
      if (l >= LAYERS.length - 1) {
        pl.on = false;
        return;
      }
      const n = LAYERS[l + 1] ?? 1;
      const start = EDGES.findIndex((x) => x.l === l && x.i === e.j);
      pl.edge = start + Math.floor(rnd() * n);
      pl.p = 0;
    };

    const eyeCur = { x: 0, y: 0 };
    const eyeTarget = { x: 0, y: 0 };
    let mx = 0;
    let my = 0;
    let havePtr = false;
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      mx = (e.clientX - (r.left + r.width * 0.73)) / Math.max(200, window.innerWidth * 0.4);
      my = (e.clientY - (r.top + r.height * 0.3)) / Math.max(200, window.innerHeight * 0.4);
      havePtr = true;
    };
    if (fine && !reduced) window.addEventListener("pointermove", onMove, { passive: true });

    const hand = { ...POSES[1]! };
    let poseIdx = 1;
    let poseAt = 0;
    let lastAction = simSignal.at;
    let cableT = 1;
    let t = 0;

    const arm = (tx: number, ty: number) => {
      const dx = tx - SHOULDER.x;
      const dy = ty - SHOULDER.y;
      const d = Math.min(L1 + L2 - 1, Math.max(24, Math.hypot(dx, dy)));
      const a = Math.atan2(dy, dx);
      const A = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
      const ex = SHOULDER.x + L1 * Math.cos(a + A);
      const ey = SHOULDER.y + L1 * Math.sin(a + A);
      const wx = SHOULDER.x + d * Math.cos(a);
      const wy = SHOULDER.y + d * Math.sin(a);
      set(upper, { x2: ex, y2: ey });
      set(fore, { x1: ex, y1: ey, x2: wx, y2: wy });
      set(joints[0] ?? null, { cx: ex, cy: ey });
      set(joints[1] ?? null, { cx: wx, cy: wy });
      const f = Math.atan2(wy - ey, wx - ex);
      const c = 9;
      const p = (ang: number) => `${wx + Math.cos(f + ang) * c},${wy + Math.sin(f + ang) * c}`;
      set(claw, { points: `${p(0.7)} ${wx},${wy} ${p(-0.7)}` });
    };

    const paint = (dt: number, still: boolean) => {
      t += dt;
      // body float, antenna blink
      set(body, { transform: `translate(0 ${still ? 0 : Math.sin(t / 1100) * 3})` });
      set(tip, { opacity: still || t % 1400 < 700 ? 1 : 0.25 });
      // eye tracking / idle scan
      if (havePtr && fine) {
        eyeTarget.x = Math.max(-1, Math.min(1, mx));
        eyeTarget.y = Math.max(-1, Math.min(1, my));
      } else {
        eyeTarget.x = still ? 0 : Math.sin(t / 1700);
        eyeTarget.y = 0;
      }
      const k = still ? 1 : 1 - Math.exp(-dt * 8);
      eyeCur.x += (eyeTarget.x - eyeCur.x) * k;
      eyeCur.y += (eyeTarget.y - eyeCur.y) * k;
      set(eye, { cx: 380 + eyeCur.x * 15, cy: 118 + eyeCur.y * 5 });
      // arm poses
      if (!still && t - poseAt > 2.8) {
        poseAt = t;
        poseIdx = (poseIdx + 1) % POSES.length;
      }
      const tp = POSES[still ? 1 : poseIdx] ?? hand;
      const ak = still ? 1 : 1 - Math.exp(-dt * 3.2);
      hand.x += (tp.x - hand.x) * ak;
      hand.y += (tp.y - hand.y) * ak;
      arm(hand.x, hand.y + (still ? 0 : Math.sin(t / 900) * 2));
      bars.forEach((b, i) =>
        set(b, { width: still ? 20 : 8 + (0.5 + 0.5 * Math.sin(t * (1.3 + i * 0.7) + i)) * 28 }),
      );

      // pulses
      const running = simSignal.running;
      pulses.forEach((pl, i) => {
        const el = pulseEls[i];
        if (still) return set(el ?? null, { opacity: 0 });
        if (!pl.on) {
          if (rnd() < (running ? 0.04 : 0.012)) spawn(pl);
          return set(el ?? null, { opacity: 0 });
        }
        pl.p += dt * pl.speed * (running ? 1.4 : 0.6);
        if (pl.p >= 1) advance(pl);
        const e = EDGES[pl.edge];
        if (!pl.on || !e) return set(el ?? null, { opacity: 0 });
        set(el ?? null, {
          cx: e.a.x + (e.b.x - e.a.x) * pl.p,
          cy: e.a.y + (e.b.y - e.a.y) * pl.p,
          opacity: 1,
        });
      });
      // action flash
      if (simSignal.at !== lastAction) {
        lastAction = simSignal.at;
        const out = act[3];
        if (out && simSignal.action >= 0) out[simSignal.action] = 1.6;
        cableT = 0;
      }
      if (simSignal.running && !still) {
        const inp = act[0];
        if (inp) simSignal.inputs.forEach((v, i) => (inp[i] = Math.max(inp[i] ?? 0, v * 0.55)));
      }
      cableT = Math.min(1, cableT + dt * 2.2);
      set(cable, {
        cx: BUS_X + (PORT.x - BUS_X) * cableT,
        cy: 200 + (PORT.y - 200) * cableT,
        opacity: cableT >= 1 || still ? 0 : 1,
      });
      // node glow, decay
      act.forEach((row, l) =>
        row.forEach((v, i) => {
          const el = cores[l]?.[i];
          if (!still) row[i] = Math.max(0.12, v * Math.exp(-dt * 2.6));
          const lit = Math.min(1, row[i] ?? 0);
          set(el ?? null, { opacity: lit, ...(l === 3 ? {} : { r: 2.2 + lit * 2.4 }) });
        }),
      );
    };

    paint(0, true);
    if (reduced) {
      return () => compactMq.removeEventListener("change", applyView);
    }

    let raf = 0;
    let last = 0;
    let inView = true;
    let tabVisible = !document.hidden;
    const frame = (ts: number) => {
      raf = 0;
      const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      paint(dt, false);
      if (inView && tabVisible) raf = requestAnimationFrame(frame);
    };
    const update = () => {
      if (inView && tabVisible && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const io = new IntersectionObserver((es) => {
      inView = es.some((e) => e.isIntersecting);
      update();
    });
    io.observe(svg);
    const onVis = () => {
      tabVisible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVis);
    update();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      compactMq.removeEventListener("change", applyView);
    };
  }, [fine, reduced]);

  const outs = NODES[3] ?? [];
  return (
    <svg
      ref={ref}
      viewBox={FULL}
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none block h-full w-full overflow-visible", className)}
    >
      {/* policy net */}
      <g>
        <text x={34} y={62} className="fill-n-4 font-mono text-[9px] tracking-[0.18em]">
          POLICY NET
        </text>
        {EDGES.map((e, k) => (
          <line
            key={k}
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            className="stroke-n-2 [vector-effect:non-scaling-stroke]"
            strokeOpacity={0.7}
          />
        ))}
        {NODES.map((layer, l) =>
          layer.map((p, i) =>
            l === 3 ? (
              <g key={`${l}-${i}`}>
                <rect x={p.x - 11} y={p.y - 11} width={22} height={22} className={hair} />
                <rect
                  data-n={`${l}-${i}`}
                  x={p.x - 11}
                  y={p.y - 11}
                  width={22}
                  height={22}
                  className="fill-primary"
                  fillOpacity={0.25}
                  opacity={0.12}
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  className="fill-n-5 font-mono text-[11px]"
                >
                  {ARROWS[i]}
                </text>
              </g>
            ) : (
              <g key={`${l}-${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  className="fill-background stroke-n-4 [vector-effect:non-scaling-stroke]"
                />
                <circle
                  data-n={`${l}-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={2.2}
                  className="fill-primary"
                  opacity={0.12}
                />
              </g>
            ),
          ),
        )}
        <text
          x={214}
          y={outs[3] ? outs[3].y + 30 : 340}
          textAnchor="middle"
          className="fill-n-4 font-mono text-[9px] tracking-[0.18em]"
        >
          ACTION
        </text>
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} data-pulse r={2.4} className="fill-primary" opacity={0} />
        ))}
        {/* output bus and cable into the chest */}
        {outs.map((p, i) => (
          <line
            key={i}
            x1={p.x + 11}
            y1={p.y}
            x2={BUS_X}
            y2={p.y}
            className={hair}
            strokeOpacity={0.6}
          />
        ))}
        <line
          x1={BUS_X}
          y1={outs[0]?.y ?? 120}
          x2={BUS_X}
          y2={outs[3]?.y ?? 280}
          className={hair}
        />
        <polyline
          points={`${BUS_X},200 290,200 290,${PORT.y} ${PORT.x},${PORT.y}`}
          className={hairLit}
          strokeOpacity={0.7}
        />
        <circle data-id="cable-pulse" r={3} className="fill-primary" opacity={0} />
      </g>

      {/* robot */}
      <g data-id="body">
        <line x1={380} y1={90} x2={380} y2={62} className={hair} />
        <circle data-id="tip" cx={380} cy={57} r={4.5} className="fill-secondary" />
        <circle
          cx={380}
          cy={57}
          r={9}
          className="fill-none stroke-secondary [vector-effect:non-scaling-stroke]"
          strokeOpacity={0.4}
        />
        <rect x={338} y={90} width={84} height={64} rx={6} className={cn(hair, "stroke-n-5")} />
        <rect x={350} y={104} width={60} height={28} rx={14} className={hair} />
        <circle data-id="eye" cx={380} cy={118} r={7} className="fill-primary" />
        <circle
          cx={380}
          cy={118}
          r={12}
          className="fill-none stroke-primary [vector-effect:non-scaling-stroke]"
          strokeOpacity={0.25}
        />
        <line x1={346} y1={144} x2={366} y2={144} className={hair} />
        <line x1={394} y1={144} x2={414} y2={144} className={hair} />
        <path d="M368 154 V168 M392 154 V168" className={hair} />
        <rect x={330} y={168} width={100} height={116} rx={4} className={cn(hair, "stroke-n-5")} />
        <rect x={344} y={182} width={72} height={46} className={hair} />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            data-bar
            x={350}
            y={190 + i * 12}
            width={20}
            height={4}
            className="fill-primary"
            opacity={0.8 - i * 0.2}
          />
        ))}
        <circle cx={406} cy={191} r={2.5} className="fill-primary" />
        <path d="M344 252 H416 M344 262 H400 M344 272 H388" className={hair} strokeOpacity={0.5} />
        <path d="M312 284 H448 L460 306 H300 Z" className={hair} />
        {/* left arm at rest */}
        <path d="M330 196 L304 226 L308 262" className={hair} />
        <circle cx={304} cy={226} r={4} className={hair} />
        {/* articulated right arm */}
        <line
          data-id="upper"
          x1={SHOULDER.x}
          y1={SHOULDER.y}
          x2={SHOULDER.x + L1}
          y2={SHOULDER.y}
          className={cn(hair, "stroke-n-5")}
          strokeWidth={1.5}
        />
        <line
          data-id="fore"
          x1={SHOULDER.x + L1}
          y1={SHOULDER.y}
          x2={SHOULDER.x + L1 + L2}
          y2={SHOULDER.y}
          className={cn(hair, "stroke-n-5")}
          strokeWidth={1.5}
        />
        <circle
          data-id="j-shoulder"
          cx={SHOULDER.x}
          cy={SHOULDER.y}
          r={5}
          className="fill-background stroke-primary [vector-effect:non-scaling-stroke]"
        />
        <circle
          data-id="j-elbow"
          cx={SHOULDER.x + L1}
          cy={SHOULDER.y}
          r={4}
          className="fill-background stroke-primary [vector-effect:non-scaling-stroke]"
        />
        <circle
          data-id="j-wrist"
          cx={SHOULDER.x + L1 + L2}
          cy={SHOULDER.y}
          r={3}
          className="fill-primary"
        />
        <polyline data-id="claw" points="0,0 0,0 0,0" className={hairLit} />
      </g>
    </svg>
  );
}
