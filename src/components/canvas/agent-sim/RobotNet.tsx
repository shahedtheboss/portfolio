import { useEffect, useRef } from "react";

import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

import { BUS_X, EDGES, L1, L2, LAYERS, PORT, POSES, SHOULDER } from "./net-layout";
import { NetArt } from "./NetArt";
import { RobotArt } from "./RobotArt";
import { simSignal } from "./signal";

const VIEW = "10 40 510 285";

type Pulse = { edge: number; p: number; speed: number; on: boolean };

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
      return;
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
    };
  }, [fine, reduced]);

  return (
    <svg
      ref={ref}
      viewBox={VIEW}
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none block h-full w-full overflow-visible", className)}
    >
      <NetArt />
      <RobotArt />
    </svg>
  );
}
