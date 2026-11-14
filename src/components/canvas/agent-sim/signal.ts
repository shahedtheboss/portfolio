import { dir, type World } from "./qlearn";

/** Live values from the visible agent, shared with the decorative policy net. Mutated, never rendered. */
export const simSignal = {
  /** Last action taken (0 up, 1 right, 2 down, 3 left), or -1. */
  action: -1,
  /** performance.now() of that action. */
  at: 0,
  /** Per-direction input activity 0..1 around the agent's current cell. */
  inputs: [0.15, 0.15, 0.15, 0.15] as number[],
  running: false,
};

/** Neighbourhood readout: 1 = wall/obstacle that way, 0.6 = goal lies that way, else 0.15. */
export function senseAt(w: World, cell: number): number[] {
  const x = cell % w.cols;
  const y = (cell - x) / w.cols;
  const gx = (w.goal % w.cols) - x;
  const gy = Math.floor(w.goal / w.cols) - y;
  return [0, 1, 2, 3].map((a) => {
    const [dx, dy] = dir(a);
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= w.cols || ny >= w.rows || w.obstacles[ny * w.cols + nx]) return 1;
    return dx * gx + dy * gy > 0 ? 0.6 : 0.15;
  });
}
