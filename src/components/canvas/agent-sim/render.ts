import { dir, type QSim } from "./qlearn";

type RGB = readonly [number, number, number];

export type Palette = {
  primary: string;
  secondary: string;
  destructive: string;
  n1: string;
  n2: string;
  n3: string;
  n5: string;
  bg: string;
};

export type Geometry = {
  cols: number;
  rows: number;
  cell: number;
  ox: number;
  oy: number;
  dpr: number;
};

export type Scene = {
  /** Agent position in cell units (centre of cell = x + 0.5). */
  ax: number;
  ay: number;
  heading: number;
  trail: Array<{ x: number; y: number }>;
  hover: number;
  flashes: Array<{ cell: number; t0: number }>;
  bursts: Array<{ t0: number }>;
  path: number[] | null;
  showAgent: boolean;
  time: number;
};

const VARS: Array<[keyof Palette, string]> = [
  ["primary", "--primary"],
  ["secondary", "--secondary"],
  ["destructive", "--destructive"],
  ["n1", "--n-1"],
  ["n2", "--n-2"],
  ["n3", "--n-3"],
  ["n5", "--n-5"],
  ["bg", "--background"],
];

/** Read the theme tokens and normalise each to an `rgb()` string via the canvas parser. */
export function readPalette(ctx: CanvasRenderingContext2D): Palette {
  const cs = getComputedStyle(document.documentElement);
  const out: Record<string, string> = {};
  for (const [key, v] of VARS) {
    ctx.fillStyle = "#808080";
    ctx.fillStyle = cs.getPropertyValue(v).trim() || "#808080";
    const rgb = parse(String(ctx.fillStyle));
    out[key] = `${rgb[0]},${rgb[1]},${rgb[2]}`;
  }
  return out as unknown as Palette;
}

function parse(s: string): RGB {
  if (s.startsWith("#")) {
    const n = parseInt(s.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = s.match(/[\d.]+/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [128, 128, 128];
}

const rgba = (c: string, a: number) => `rgba(${c},${a})`;

/** Snap a CSS-pixel coordinate onto the device-pixel grid so 1px lines stay crisp. */
const snap = (v: number, dpr: number) => Math.round(v * dpr) / dpr + 0.5 / dpr;

export class Renderer {
  private disp: Float32Array;
  private vmax = 0.05;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly sim: QSim,
    private readonly g: Geometry,
    public palette: Palette,
    private readonly width: number,
    private readonly height: number,
  ) {
    this.disp = new Float32Array(g.cols * g.rows);
  }

  cellAt(px: number, py: number): number {
    const { cols, rows, cell, ox, oy } = this.g;
    const x = Math.floor((px - ox) / cell);
    const y = Math.floor((py - oy) / cell);
    return x < 0 || y < 0 || x >= cols || y >= rows ? -1 : y * cols + x;
  }

  private px(cx: number) {
    return this.g.ox + cx * this.g.cell;
  }
  private py(cy: number) {
    return this.g.oy + cy * this.g.cell;
  }

  draw(sc: Scene, instant = false) {
    const { ctx, g, sim, palette: p } = this;
    const { cols, rows, cell, dpr } = g;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.lineWidth = 1 / dpr;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // value heatmap (max-Q, eased so it never flickers)
    let vmax = 0.05;
    for (let i = 0; i < cols * rows; i++) vmax = Math.max(vmax, sim.maxQ(i));
    this.vmax += (vmax - this.vmax) * (instant ? 1 : 0.05);
    ctx.fillStyle = rgba(p.primary, 1);
    for (let i = 0; i < cols * rows; i++) {
      if (sim.world.obstacles[i]) continue;
      const target = Math.max(0, Math.min(1, sim.maxQ(i) / this.vmax));
      const v = (this.disp[i] ?? 0) + (target - (this.disp[i] ?? 0)) * (instant ? 1 : 0.12);
      this.disp[i] = v;
      if (v < 0.03) continue;
      ctx.globalAlpha = Math.pow(v, 1.4) * 0.3;
      const x = i % cols;
      ctx.fillRect(this.px(x), this.py((i - x) / cols), cell, cell);
    }
    ctx.globalAlpha = 1;

    this.grid();
    this.chevrons();
    this.obstacles();
    if (sc.path) this.pathLine(sc.path);
    this.goal(sc.time);
    this.bursts(sc);
    if (sc.showAgent) this.agent(sc);
    this.hover(sc);
  }

  private grid() {
    const { ctx, g, palette: p } = this;
    ctx.strokeStyle = rgba(p.n2, 0.3);
    ctx.beginPath();
    const x0 = this.px(0);
    const x1 = this.px(g.cols);
    const y0 = this.py(0);
    const y1 = this.py(g.rows);
    for (let x = 0; x <= g.cols; x++) {
      const sx = snap(this.px(x), g.dpr);
      ctx.moveTo(sx, y0);
      ctx.lineTo(sx, y1);
    }
    for (let y = 0; y <= g.rows; y++) {
      const sy = snap(this.py(y), g.dpr);
      ctx.moveTo(x0, sy);
      ctx.lineTo(x1, sy);
    }
    ctx.stroke();
  }

  private chevrons() {
    const { ctx, g, sim, palette: p } = this;
    const r = g.cell * 0.13;
    ctx.strokeStyle = rgba(p.primary, 0.4);
    ctx.beginPath();
    for (let i = 0; i < g.cols * g.rows; i++) {
      if (!sim.visited[i] || sim.world.obstacles[i] || i === sim.world.goal) continue;
      const a = sim.policyAction(i);
      if (a === null) continue;
      const x = i % g.cols;
      const cx = this.px(x + 0.5);
      const cy = this.py((i - x) / g.cols + 0.5);
      const [dx, dy] = dir(a);
      const tx = cx + dx * r;
      const ty = cy + dy * r;
      ctx.moveTo(tx - dx * r * 1.1 - dy * r * 0.9, ty - dy * r * 1.1 + dx * r * 0.9);
      ctx.lineTo(tx, ty);
      ctx.lineTo(tx - dx * r * 1.1 + dy * r * 0.9, ty - dy * r * 1.1 - dx * r * 0.9);
    }
    ctx.stroke();
  }

  private obstacles() {
    const { ctx, g, sim, palette: p } = this;
    const inset = Math.max(3, g.cell * 0.08);
    const a = g.cell - inset * 2;
    const step = 6;
    ctx.fillStyle = rgba(p.n1, 0.55);
    ctx.strokeStyle = rgba(p.n3, 0.75);
    const hatch = new Path2D();
    for (let i = 0; i < g.cols * g.rows; i++) {
      if (!sim.world.obstacles[i]) continue;
      const cx = i % g.cols;
      const x = this.px(cx) + inset;
      const y = this.py((i - cx) / g.cols) + inset;
      ctx.fillRect(x, y, a, a);
      ctx.strokeRect(snap(x, g.dpr), snap(y, g.dpr), a, a);
      for (let k = step; k < a; k += step) {
        hatch.moveTo(x + k, y);
        hatch.lineTo(x, y + k);
        hatch.moveTo(x + a, y + k);
        hatch.lineTo(x + k, y + a);
      }
    }
    ctx.strokeStyle = rgba(p.n3, 0.4);
    ctx.stroke(hatch);
  }

  private pathLine(path: number[]) {
    const { ctx, g, palette: p } = this;
    ctx.strokeStyle = rgba(p.primary, 0.85);
    ctx.lineWidth = 2;
    ctx.beginPath();
    path.forEach((c, i) => {
      const x = c % g.cols;
      const cx = this.px(x + 0.5);
      const cy = this.py((c - x) / g.cols + 0.5);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.stroke();
    ctx.lineWidth = 1 / g.dpr;
  }

  private goalCentre() {
    const c = this.sim.world.goal;
    const x = c % this.g.cols;
    return { x: this.px(x + 0.5), y: this.py((c - x) / this.g.cols + 0.5) };
  }

  private goal(time: number) {
    const { ctx, g, palette: p } = this;
    const { x, y } = this.goalCentre();
    const pulse = 0.5 + 0.5 * Math.sin(time / 380);
    const r = g.cell * (0.26 + pulse * 0.04);
    for (let k = 0; k < 2; k++) {
      const ph = (time / 1800 + k * 0.5) % 1;
      ctx.strokeStyle = rgba(p.secondary, (1 - ph) * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, g.cell * (0.3 + ph * 0.7), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.fillStyle = rgba(p.secondary, 0.25 + pulse * 0.2);
    ctx.fill();
    ctx.strokeStyle = rgba(p.secondary, 0.95);
    ctx.stroke();
  }

  private bursts(sc: Scene) {
    const { ctx, g, palette: p } = this;
    const { x, y } = this.goalCentre();
    for (const b of sc.bursts) {
      const t = (sc.time - b.t0) / 900;
      if (t < 0 || t > 1) continue;
      ctx.strokeStyle = rgba(p.secondary, (1 - t) * 0.8);
      ctx.beginPath();
      ctx.arc(x, y, g.cell * (0.4 + t * 2.4), 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = rgba(p.primary, (1 - t) * 0.6);
      ctx.beginPath();
      ctx.arc(x, y, g.cell * (0.2 + t * 1.6), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private agent(sc: Scene) {
    const { ctx, g, palette: p } = this;
    const n = sc.trail.length;
    ctx.lineWidth = 1.5;
    for (let i = 1; i < n; i++) {
      ctx.strokeStyle = rgba(p.primary, (i / n) * 0.55);
      ctx.beginPath();
      const a = sc.trail[i - 1];
      const b = sc.trail[i];
      if (!a || !b) continue;
      ctx.moveTo(this.px(a.x), this.py(a.y));
      ctx.lineTo(this.px(b.x), this.py(b.y));
      ctx.stroke();
    }
    ctx.lineWidth = 1 / g.dpr;
    const x = this.px(sc.ax);
    const y = this.py(sc.ay);
    const r = g.cell * 0.2;
    const ux = Math.cos(sc.heading);
    const uy = Math.sin(sc.heading);
    ctx.fillStyle = rgba(p.primary, 0.95);
    ctx.beginPath();
    ctx.moveTo(x + ux * r * 1.2, y + uy * r * 1.2);
    ctx.lineTo(x - ux * r * 0.8 - uy * r * 0.8, y - uy * r * 0.8 + ux * r * 0.8);
    ctx.lineTo(x - ux * r * 0.35, y - uy * r * 0.35);
    ctx.lineTo(x - ux * r * 0.8 + uy * r * 0.8, y - uy * r * 0.8 - ux * r * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(p.primary, 0.6);
    ctx.beginPath();
    ctx.arc(x, y, r * 1.9, 0, Math.PI * 2);
    ctx.stroke();
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2 + Math.PI / 4;
      const c = Math.cos(a);
      const s = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(x + c * r * 1.9, y + s * r * 1.9);
      ctx.lineTo(x + c * r * 2.5, y + s * r * 2.5);
      ctx.stroke();
    }
  }

  private hover(sc: Scene) {
    const { ctx, g, palette: p } = this;
    for (const f of sc.flashes) {
      const t = (sc.time - f.t0) / 520;
      if (t < 0 || t > 1) continue;
      const x = f.cell % g.cols;
      ctx.fillStyle = rgba(p.destructive, (1 - t) * 0.45);
      ctx.fillRect(this.px(x), this.py((f.cell - x) / g.cols), g.cell, g.cell);
    }
    if (sc.hover < 0) return;
    const x = this.px(sc.hover % g.cols);
    const y = this.py(Math.floor(sc.hover / g.cols));
    const l = g.cell * 0.28;
    const s = g.cell;
    ctx.strokeStyle = rgba(p.primary, 0.9);
    ctx.beginPath();
    const corners: Array<[number, number, number, number]> = [
      [x, y, 1, 1],
      [x + s, y, -1, 1],
      [x, y + s, 1, -1],
      [x + s, y + s, -1, -1],
    ];
    for (const [cx, cy, sx, sy] of corners) {
      ctx.moveTo(snap(cx, g.dpr) + sx * l, snap(cy, g.dpr));
      ctx.lineTo(snap(cx, g.dpr), snap(cy, g.dpr));
      ctx.lineTo(snap(cx, g.dpr), snap(cy, g.dpr) + sy * l);
    }
    ctx.stroke();
  }
}
