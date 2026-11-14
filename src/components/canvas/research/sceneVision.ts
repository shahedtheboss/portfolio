import { clamp01, lerp, rand, type Scene } from "./types";

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  lock: number;
  seen: boolean;
};

const SWEEP_S = 4.5;

function makeBlobs(): Blob[] {
  return Array.from({ length: 4 }, (_, i) => ({
    x: 0.15 + i * 0.22 + rand(-0.04, 0.04),
    y: rand(0.25, 0.75),
    vx: rand(-0.025, 0.025),
    vy: rand(-0.02, 0.02),
    r: rand(0.07, 0.1),
    lock: 0,
    seen: false,
  }));
}

function bracket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  k: number,
) {
  const s = Math.min(w, h) * 0.3;
  ctx.beginPath();
  for (const [cx, cy, dx, dy] of [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ] as const) {
    ctx.moveTo(cx + dx * s * k, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * s * k);
  }
  ctx.stroke();
}

/** Scan grid, sweeping line, and bounding boxes that lock on to drifting blobs. */
export function createVisionScene(): Scene {
  let clock = 0;
  const blobs = makeBlobs();

  return {
    draw(ctx, w, h, dt, c) {
      clock += dt;
      const sweep = (clock % SWEEP_S) / SWEEP_S;
      if (sweep < dt / SWEEP_S + 0.001) blobs.forEach((b) => ((b.seen = false), (b.lock = 0)));
      const sx = sweep * w;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = c.n1;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < 12; i++) {
        ctx.moveTo((i / 12) * w, 0);
        ctx.lineTo((i / 12) * w, h);
      }
      for (let j = 1; j < 7; j++) {
        ctx.moveTo(0, (j / 7) * h);
        ctx.lineTo(w, (j / 7) * h);
      }
      ctx.stroke();

      for (const b of blobs) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x < 0.1 || b.x > 0.9) b.vx *= -1;
        if (b.y < 0.2 || b.y > 0.8) b.vy *= -1;
        if (!b.seen && sx > b.x * w) b.seen = true;
        if (b.seen) b.lock = clamp01(b.lock + dt * 1.1);
        const px = b.x * w;
        const py = b.y * h;
        const rad = b.r * Math.min(w, h * 1.6);
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, c.n4);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (b.lock > 0) {
          const e = 1 - (1 - b.lock) ** 3;
          const size = lerp(rad * 3.2, rad * 1.7, e);
          ctx.strokeStyle = c.primary;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.35 + 0.65 * e;
          bracket(ctx, px - size / 2, py - size / 2, size, size, 1);
          // confidence ticks
          const filled = Math.round(e * 5);
          for (let t = 0; t < 5; t++) {
            ctx.fillStyle = t < filled ? c.primary : c.n2;
            ctx.fillRect(px - size / 2 + t * 5, py + size / 2 + 5, 3, 3);
          }
          ctx.globalAlpha = 1;
        }
      }

      // sweep line with trailing fade
      const grad = ctx.createLinearGradient(sx - 40, 0, sx, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, c.secondary);
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = grad;
      ctx.fillRect(Math.max(0, sx - 40), 0, Math.min(40, sx), h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.secondary;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, h);
      ctx.stroke();
    },
  };
}
