import { rand, type Scene } from "./types";

type Trace = { edges: number[]; start: 0 | 1 };

const TRACES = 5;
const WINDOW_S = 6;
const SPEED = 0.16; // belt units per second
const SPACING = 0.2;
const LOOP = 1.2;

function extend(tr: Trace, until: number) {
  let last = tr.edges[tr.edges.length - 1] ?? 0;
  while (last < until) {
    last += rand(0.35, 1.6);
    tr.edges.push(last);
  }
}

function level(tr: Trace, t: number): 0 | 1 {
  let v = tr.start;
  for (const e of tr.edges) {
    if (e > t) break;
    v = v ? 0 : 1;
  }
  return v;
}

/** Scrolling digital traces like a logic analyser, plus a small conveyor with one diverted block. */
export function createPlcScene(): Scene {
  let clock = 0;
  let beltX = 0;
  const traces: Trace[] = Array.from({ length: TRACES }, () => ({
    edges: [],
    start: Math.random() < 0.5 ? 0 : 1,
  }));

  return {
    draw(ctx, w, h, dt, c) {
      clock += dt;
      beltX += dt * SPEED;
      const left = clock - WINDOW_S;
      const x0 = w * 0.04;
      const x1 = w * 0.96;
      const ladderH = h * 0.58;
      const rowH = ladderH / TRACES;

      ctx.clearRect(0, 0, w, h);
      traces.forEach((tr, i) => {
        extend(tr, clock + 0.1);
        while (tr.edges.length > 1 && (tr.edges[0] ?? 0) < left) {
          tr.edges.shift();
          tr.start = tr.start ? 0 : 1;
        }
        const yHi = i * rowH + rowH * 0.22 + 2;
        const yLo = i * rowH + rowH * 0.82;
        const xOf = (t: number) => x0 + ((t - left) / WINDOW_S) * (x1 - x0);
        ctx.strokeStyle = i === 2 ? c.secondary : c.primary;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        let v = level(tr, left);
        ctx.moveTo(x0, v ? yHi : yLo);
        for (const e of tr.edges) {
          if (e < left || e > clock) continue;
          ctx.lineTo(xOf(e), v ? yHi : yLo);
          v = v ? 0 : 1;
          ctx.lineTo(xOf(e), v ? yHi : yLo);
        }
        ctx.lineTo(x1, v ? yHi : yLo);
        ctx.stroke();
        ctx.strokeStyle = c.n1;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, (i + 1) * rowH - 1);
        ctx.lineTo(x1, (i + 1) * rowH - 1);
        ctx.stroke();
      });

      // conveyor
      const beltY = h * 0.84;
      const bs = Math.min(h * 0.1, 14);
      ctx.strokeStyle = c.n3;
      ctx.beginPath();
      ctx.moveTo(x0, beltY + bs);
      ctx.lineTo(x1, beltY + bs);
      ctx.stroke();
      const divertAt = 0.62;
      const phase = beltX % LOOP;
      for (let k = 0; k < LOOP / SPACING; k++) {
        const pos = (k * SPACING + phase) % LOOP;
        if (pos > 1) continue;
        const diverted = k === 0;
        const past = diverted ? Math.min(1, Math.max(0, (pos - divertAt) / 0.1)) : 0;
        ctx.globalAlpha = 1 - past * 0.4;
        ctx.fillStyle = diverted ? c.secondary : c.n4;
        ctx.fillRect(x0 + pos * (x1 - x0) - bs / 2, beltY - past * bs * 1.8, bs, bs);
      }
      ctx.globalAlpha = 1;
    },
  };
}
