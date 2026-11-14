import { clamp01, rand, type Scene } from "./types";

type Pt = { x: number; y: number };

const START: Pt = { x: 0.1, y: 0.8 };
const GOAL: Pt = { x: 0.88, y: 0.22 };
const MAX_PATHS = 7;
const SPEED = 0.35; // unit-field distance per second
const GOAL_R = 0.05;

/** An agent that makes gradually more direct trajectories toward a target. */
export function createAgentScene(): Scene {
  let episode = 0;
  let pos: Pt = { ...START };
  let heading = 0;
  let path: Pt[] = [{ ...START }];
  let steps = 0;
  const past: Pt[][] = [];

  const directness = () => clamp01(0.05 + (episode % 9) * 0.115);

  return {
    draw(ctx, w, h, dt, c) {
      const sp = SPEED * dt;
      if (dt > 0) {
        const goalAngle = Math.atan2(GOAL.y - pos.y, GOAL.x - pos.x);
        const wander = rand(-1, 1) * 1.1 * (1 - directness());
        let diff = goalAngle - heading;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        heading += diff * (0.04 + directness() * 0.2) + wander * 0.25;
        pos = {
          x: Math.min(0.98, Math.max(0.02, pos.x + Math.cos(heading) * sp)),
          y: Math.min(0.96, Math.max(0.04, pos.y + Math.sin(heading) * sp * 1.3)),
        };
        steps += 1;
        if (steps % 3 === 0) path.push({ ...pos });
        const reached = Math.hypot(pos.x - GOAL.x, (pos.y - GOAL.y) * 0.8) < GOAL_R;
        if (reached || steps > 900) {
          past.push(path);
          if (past.length > MAX_PATHS) past.shift();
          episode += 1;
          pos = { ...START };
          heading = Math.atan2(GOAL.y - START.y, GOAL.x - START.x) + rand(-1.6, 1.6);
          path = [{ ...START }];
          steps = 0;
        }
      }

      ctx.clearRect(0, 0, w, h);
      // field dots
      ctx.fillStyle = c.n2;
      for (let gx = 0; gx <= 12; gx++) {
        for (let gy = 0; gy <= 7; gy++) {
          ctx.fillRect((gx / 12) * (w - 2), (gy / 7) * (h - 2), 1.5, 1.5);
        }
      }
      const line = (pts: Pt[], color: string, alpha: number, width: number) => {
        if (pts.length < 2) return;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        pts.forEach((p, i) => (i ? ctx.lineTo(p.x * w, p.y * h) : ctx.moveTo(p.x * w, p.y * h)));
        ctx.stroke();
      };
      past.forEach((p, i) => line(p, c.n4, 0.12 + (i / MAX_PATHS) * 0.45, 1));
      line(path, c.primary, 1, 1.6);
      ctx.globalAlpha = 1;

      // goal
      const gx = GOAL.x * w;
      const gy = GOAL.y * h;
      ctx.strokeStyle = c.secondary;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(gx, gy, 9, 0, Math.PI * 2);
      ctx.moveTo(gx - 14, gy);
      ctx.lineTo(gx + 14, gy);
      ctx.moveTo(gx, gy - 14);
      ctx.lineTo(gx, gy + 14);
      ctx.stroke();
      // start + agent
      ctx.strokeStyle = c.n3;
      ctx.strokeRect(START.x * w - 4, START.y * h - 4, 8, 8);
      ctx.fillStyle = c.primary;
      ctx.beginPath();
      ctx.arc(pos.x * w, pos.y * h, 3.5, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}
