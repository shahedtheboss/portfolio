import { dir, QSim, createWorld, gridFor, mulberry32, pickGoal } from "./qlearn";
import { senseAt, simSignal } from "./signal";
import { Renderer, readPalette, type Geometry, type Scene } from "./render";

export type HudRefs = {
  episode: HTMLElement | null;
  ret: HTMLElement | null;
  epsilon: HTMLElement | null;
  success: HTMLElement | null;
};

export type SimOptions = {
  canvas: HTMLCanvasElement;
  /** Element that receives pointer input and whose visibility pauses the loop. */
  section: HTMLElement;
  hud: HudRefs;
  coarse: boolean;
  reduced: boolean;
  /** Hover + click-to-place-obstacle (fine pointer, motion allowed). */
  interactive: boolean;
};

export type SimController = {
  setRunning: (running: boolean) => void;
  destroy: () => void;
};

const MOVES_PER_SEC = 14;
const TRAIN_PER_FRAME = 20;
const TRAIN_PER_FRAME_COARSE = 10;
const TRAIL = 40;
const DPR_CAP = 1.75;
const IGNORE = "a, button, input, textarea, [data-sim-ignore]";
const GOAL_AFTER_MS = 10_000;

const ease = (t: number) => t * t * (3 - 2 * t);

export function createSimController(opts: SimOptions): SimController {
  const { canvas, section, hud, coarse, reduced, interactive } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setRunning: () => {}, destroy: () => {} };

  let sim: QSim | null = null;
  let renderer: Renderer | null = null;
  let geo: Geometry | null = null;
  let palette = readPalette(ctx);
  let raf = 0;
  let last = 0;
  let wantRun = false;
  let inView = true;
  let tabVisible = !document.hidden;
  let resizeTimer = 0;
  let hudTimer = 0;
  let destroyed = false;
  let pendingReset = false;

  const scene: Scene = {
    ax: 0,
    ay: 0,
    heading: 0,
    trail: [],
    hover: -1,
    flashes: [],
    bursts: [],
    path: null,
    showAgent: true,
    time: 0,
  };
  // visible agent segment state
  let segFrom = 0;
  let segTo = 0;
  let segT = 1;
  let pauseUntil = 0;
  let trainAcc = 0;
  let convergedSince = 0;

  const cellXY = (c: number): [number, number] => {
    const x = c % (geo?.cols ?? 1);
    return [x + 0.5, (c - x) / (geo?.cols ?? 1) + 0.5];
  };

  const placeAgent = (cell: number) => {
    segFrom = segTo = cell;
    segT = 1;
    const [x, y] = cellXY(cell);
    scene.ax = x;
    scene.ay = y;
    scene.trail = [];
  };

  const writeHud = () => {
    if (!sim) return;
    const s = sim.stats();
    if (hud.episode) hud.episode.textContent = String(s.episode).padStart(4, "0");
    if (hud.ret) hud.ret.textContent = (s.lastReturn >= 0 ? "+" : "") + s.lastReturn.toFixed(2);
    if (hud.epsilon) hud.epsilon.textContent = s.epsilon.toFixed(2);
    if (hud.success) hud.success.textContent = `${Math.round(s.successRate * 100)}%`;
  };

  const build = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w < 40 || h < 40) return;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const g = gridFor(w, h, coarse);
    geo = { ...g, dpr };
    const rng = mulberry32((Date.now() ^ (Math.random() * 1e9)) >>> 0);
    sim = new QSim(createWorld(g.cols, g.rows, rng), rng);
    renderer = new Renderer(ctx, sim, geo, palette, w, h);
    scene.hover = -1;
    scene.flashes = [];
    scene.bursts = [];
    convergedSince = 0;
    placeAgent(sim.world.start);
    if (reduced) {
      sim.trainSync(400);
      scene.path = sim.greedyPath();
      scene.showAgent = false;
      renderer.draw(scene, true);
      renderer.draw(scene, true);
      writeHud();
    } else {
      renderer.draw(scene);
    }
  };

  const advanceAgent = (dt: number, now: number) => {
    if (!sim || !geo) return;
    if (now < pauseUntil) return;
    if (pendingReset) {
      pendingReset = false;
      placeAgent(sim.world.start);
    }
    segT += (dt * MOVES_PER_SEC) / 1000;
    while (segT >= 1) {
      segT -= 1;
      segFrom = segTo;
      const r = sim.step(sim.visible);
      segTo = r.to;
      simSignal.action = r.action;
      simSignal.at = now;
      simSignal.inputs = senseAt(sim.world, r.from);
      const [dx, dy] = dir(r.action);
      scene.heading = Math.atan2(dy, dx);
      if (r.done) {
        if (r.reachedGoal) scene.bursts.push({ t0: now });
        pauseUntil = now + (r.reachedGoal ? 650 : 250);
        segT = 1;
        pendingReset = true; // restart from the start cell once the pause ends
        break;
      }
    }
    const t = ease(Math.min(1, segT));
    const [fx, fy] = cellXY(segFrom);
    const [tx, ty] = cellXY(segTo);
    scene.ax = fx + (tx - fx) * t;
    scene.ay = fy + (ty - fy) * t;
    const tail = scene.trail[scene.trail.length - 1];
    if (!tail || Math.abs(tail.x - scene.ax) + Math.abs(tail.y - scene.ay) > 0.12) {
      scene.trail.push({ x: scene.ax, y: scene.ay });
      if (scene.trail.length > TRAIL) scene.trail.shift();
    }
  };

  const frame = (ts: number) => {
    raf = 0;
    if (destroyed || !sim || !renderer) return;
    const dt = Math.min(50, last ? ts - last : 16.7);
    last = ts;
    scene.time = ts;
    trainAcc += (dt / 16.7) * (coarse ? TRAIN_PER_FRAME_COARSE : TRAIN_PER_FRAME);
    const n = Math.floor(trainAcc);
    trainAcc -= n;
    sim.train(n);
    advanceAgent(dt, ts);

    if (sim.converged()) {
      if (!convergedSince) convergedSince = ts;
      else if (ts - convergedSince > GOAL_AFTER_MS) {
        const goal = pickGoal(sim.world, Math.random, [sim.world.start, segTo]);
        if (goal !== sim.world.goal) {
          sim.relocateGoal(goal);
          placeAgent(sim.world.start);
        }
        convergedSince = 0;
      }
    } else {
      convergedSince = 0;
    }

    scene.flashes = scene.flashes.filter((f) => ts - f.t0 < 520);
    scene.bursts = scene.bursts.filter((b) => ts - b.t0 < 900);
    renderer.draw(scene);
    schedule();
  };

  const running = () => wantRun && inView && tabVisible && !reduced && !destroyed;
  const schedule = () => {
    if (running() && !raf) raf = requestAnimationFrame(frame);
  };
  const update = () => {
    simSignal.running = running();
    if (running()) {
      last = 0;
      schedule();
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    if (reduced && renderer) renderer.draw(scene, true);
  };

  // ---- observers ----
  const io = new IntersectionObserver((es) => {
    inView = es.some((e) => e.isIntersecting);
    update();
  });
  io.observe(section);
  const onVis = () => {
    tabVisible = !document.hidden;
    update();
  };
  document.addEventListener("visibilitychange", onVis);

  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      build();
      update();
    }, 200);
  });
  ro.observe(canvas);

  const mo = new MutationObserver(() => {
    palette = readPalette(ctx);
    if (renderer) renderer.palette = palette;
    if (reduced && renderer) renderer.draw(scene, true);
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // ---- pointer ----
  const ignored = (e: Event) => e.target instanceof Element && !!e.target.closest(IGNORE);
  const local = (e: PointerEvent | MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onMove = (e: PointerEvent) => {
    if (!renderer) return;
    const p = local(e);
    scene.hover = ignored(e) ? -1 : renderer.cellAt(p.x, p.y);
  };
  const onLeave = () => {
    scene.hover = -1;
  };
  const onClick = (e: MouseEvent) => {
    if (!sim || !renderer || ignored(e)) return;
    if (window.getSelection()?.toString()) return;
    const p = local(e);
    const cell = renderer.cellAt(p.x, p.y);
    if (cell < 0) return;
    const protectedCells = [segFrom, segTo, sim.visible.pos];
    if (!sim.toggleObstacle(cell, protectedCells)) {
      scene.flashes.push({ cell, t0: scene.time || performance.now() });
    }
  };
  if (interactive && !reduced) {
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("click", onClick);
  }

  hudTimer = window.setInterval(writeHud, 200);
  build();

  return {
    setRunning(v) {
      wantRun = v;
      update();
    },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.clearInterval(hudTimer);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("click", onClick);
    },
  };
}
