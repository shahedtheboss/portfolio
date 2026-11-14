import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Palette = { signal: string; alert: string; dim: string };
type Particle = { x: number; y: number; layer: number; hot: boolean; age: number };
type Node = { x: number; y: number; phase: number; speed: number };

const LAYERS = [
  { speed: 0.55, alpha: 0.22, width: 0.8 },
  { speed: 0.95, alpha: 0.38, width: 1 },
  { speed: 1.4, alpha: 0.55, width: 1.3 },
] as const;

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth pseudo-noise angle; snaps to 45 degree steps in some regions (PCB-style bends). */
function flow(x: number, y: number, t: number) {
  const a =
    Math.sin(x * 0.0021 + t * 0.07) + Math.cos(y * 0.0027 - t * 0.05) + Math.sin((x + y) * 0.0012);
  const zone = Math.sin(x * 0.0009 + 1.7) * Math.cos(y * 0.0011 - 0.6);
  const ang = a * 1.6;
  return zone > 0.15 ? Math.round(ang / (Math.PI / 4)) * (Math.PI / 4) : ang;
}

function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
  return {
    signal: v("--primary", "#b6ff3c"),
    alert: v("--secondary", "#ffa62b"),
    dim: v("--n-3", "#5b6779"),
  };
}

/** Full-bleed animated signal field: flow-field traces, pulsing junction nodes, pointer reaction. */
export function SkillsBackdrop() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;
    const section = host.parentElement ?? host;
    let lastW = 0;
    let lastH = 0;
    let q = 1;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const random = rng(20240611);
    let w = 0;
    let h = 0;
    let t = 0;
    let particles: Particle[] = [];
    let nodes: Node[] = [];
    let palette = readPalette(section);
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let visible = false;
    let running = false;

    const spawn = (p: Particle) => {
      p.x = random() * w;
      p.y = random() * h;
      p.age = 0;
      p.hot = random() < 0.06;
    };

    const setup = () => {
      // Viewport-tall sticky canvas at reduced resolution: only what is on screen is painted.
      w = Math.max(1, host.getBoundingClientRect().width);
      h = Math.max(1, window.innerHeight);
      lastW = w;
      lastH = h;
      q = fine ? 0.75 : 0.6;
      cv.width = Math.round(w * q);
      cv.height = Math.round(h * q);
      ctx.setTransform(q, 0, 0, q, 0, 0);
      const area = (w * h) / 1e6;
      const count = Math.min(48, Math.round(area * (fine ? 16 : 8)) + 10);
      particles = Array.from({ length: count }, (_, i) => {
        const p: Particle = { x: 0, y: 0, layer: i % LAYERS.length, hot: false, age: 0 };
        spawn(p);
        return p;
      });
      const nCount = Math.min(20, Math.round(area * (fine ? 7 : 4)) + 4);
      nodes = Array.from({ length: nCount }, () => ({
        x: random() * w,
        y: random() * h,
        phase: random() * 6.28,
        speed: 0.6 + random() * 0.9,
      }));
      ctx.clearRect(0, 0, w, h);
    };

    const step = (dt: number) => {
      t += dt;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.045)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      for (const p of particles) {
        const L = LAYERS[p.layer] ?? LAYERS[0];
        let ang = flow(p.x, p.y, t);
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) ang = ang * 0.5 + Math.atan2(dy, dx) * 0.5 + (1 - d2 / 22500) * 1.2;
        const sp = L.speed * 1.5 * dt * 60;
        const nx = p.x + Math.cos(ang) * sp;
        const ny = p.y + Math.sin(ang) * sp;
        ctx.globalAlpha = L.alpha;
        ctx.strokeStyle = p.hot ? palette.alert : p.layer === 0 ? palette.dim : palette.signal;
        ctx.lineWidth = L.width;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        p.age += dt;
        if (p.x < -20 || p.y < -20 || p.x > w + 20 || p.y > h + 20 || p.age > 14) spawn(p);
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n) continue;
        const pulse = Math.max(0, Math.sin(t * n.speed + n.phase)) ** 6;
        const near = fine && Math.hypot(pointer.x - n.x, pointer.y - n.y) < 140 ? 0.5 : 0;
        const glow = Math.min(1, pulse + near);
        ctx.globalAlpha = 0.18 + glow * 0.55;
        ctx.fillStyle = palette.signal;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 + glow * 2.2, 0, 6.283);
        ctx.fill();
        if (glow > 0.25) {
          for (let j = i + 1; j < nodes.length; j++) {
            const m = nodes[j];
            if (!m) continue;
            const d = Math.hypot(n.x - m.x, n.y - m.y);
            if (d < 230) {
              ctx.globalAlpha = glow * 0.4 * (1 - d / 230);
              ctx.strokeStyle = palette.signal;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(m.x, m.y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    let last = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      step(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    setup();
    if (reduced) for (let i = 0; i < 400; i++) step(1 / 60);

    const io = new IntersectionObserver((e) => {
      visible = e.some((x) => x.isIntersecting);
      if (visible) start();
      else stop();
    });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      if (Math.abs(host.getBoundingClientRect().width - lastW) < 1 && window.innerHeight === lastH)
        return;
      setup();
      if (reduced) for (let i = 0; i < 400; i++) step(1 / 60);
    });
    ro.observe(host);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(() => {
      palette = readPalette(section);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_bottom,#000_0%,rgb(0_0_0/0.55)_30%,rgb(0_0_0/0.4)_60%,#000_100%),radial-gradient(ellipse_at_center,rgb(0_0_0/0.45)_0%,#000_75%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
    >
      <div className="sticky top-0 h-[100svh] w-full">
        <canvas ref={canvas} aria-hidden="true" className="h-full w-full" />
      </div>
    </div>
  );
}
