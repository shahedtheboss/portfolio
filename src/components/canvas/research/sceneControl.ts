import { rand, type Scene } from "./types";

const PAD = { l: 0.08, r: 0.04, t: 0.14, b: 0.14 };
const DRAW_S = 4.2;
const HOLD_S = 1.2;

/** Underdamped second-order step response, normalised time 0..1. */
function response(tau: number, zeta: number): number {
  const wn = 14;
  const t = tau;
  const wd = wn * Math.sqrt(1 - zeta * zeta);
  const k = zeta / Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + k * Math.sin(wd * t));
}

/** Setpoint plus a step response that overshoots, then settles; damping varies per loop. */
export function createControlScene(): Scene {
  let clock = 0;
  let zeta = 0.22;

  return {
    draw(ctx, w, h, dt, c) {
      clock += dt;
      if (clock > DRAW_S + HOLD_S) {
        clock = 0;
        zeta = rand(0.14, 0.55);
      }
      const prog = Math.min(1, clock / DRAW_S);
      const x0 = PAD.l * w;
      const x1 = w * (1 - PAD.r);
      const yTop = PAD.t * h;
      const yBase = h * (1 - PAD.b);
      const yOf = (v: number) => yBase - (v / 1.6) * (yBase - yTop);

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = c.n2;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, yTop - 4);
      ctx.lineTo(x0, yBase);
      ctx.lineTo(x1, yBase);
      ctx.stroke();
      ctx.strokeStyle = c.n1;
      for (let i = 1; i <= 8; i++) {
        const x = x0 + ((x1 - x0) * i) / 8;
        ctx.beginPath();
        ctx.moveTo(x, yBase);
        ctx.lineTo(x, yBase + (i % 2 ? 3 : 6));
        ctx.stroke();
      }
      for (let i = 0; i <= 4; i++) {
        const y = yOf((1.6 * i) / 4);
        ctx.beginPath();
        ctx.moveTo(x0 - 3, y);
        ctx.lineTo(x0, y);
        ctx.stroke();
      }

      // setpoint
      ctx.strokeStyle = c.secondary;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(x0, yOf(1));
      ctx.lineTo(x1, yOf(1));
      ctx.stroke();
      ctx.setLineDash([]);

      // response
      const n = 140;
      const last = Math.floor(n * prog);
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x0, yOf(0));
      let hx = x0;
      let hy = yOf(0);
      for (let i = 1; i <= last; i++) {
        const u = i / n;
        hx = x0 + (x1 - x0) * u;
        hy = yOf(Math.max(0, response(u, zeta)));
        ctx.lineTo(hx, hy);
      }
      ctx.stroke();
      ctx.fillStyle = c.primary;
      ctx.beginPath();
      ctx.arc(hx, hy, 3, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}
