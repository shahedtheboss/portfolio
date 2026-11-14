/** Tabular Q-learning in a grid world. Pure logic: no DOM, no rendering. */

export type Rng = () => number;

const at = (a: ArrayLike<number>, i: number): number => a[i] ?? 0;

/** up, right, down, left */
export const ACTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

/** dx, dy of an action (0,0 if out of range). */
export const dir = (a: number): readonly [number, number] => ACTIONS[a] ?? [0, 0];

export const ALPHA = 0.5;
export const GAMMA = 0.95;
export const EPS_MIN = 0.05;
export const EPS_EPISODES = 120;
export const R_GOAL = 1;
export const R_STEP = -0.01;
export const R_BUMP = -0.05;
const WINDOW = 20;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type World = {
  cols: number;
  rows: number;
  obstacles: Uint8Array;
  start: number;
  goal: number;
};

/** BFS over free cells (4-neighbourhood). */
export function isReachable(w: World, from: number, to: number): boolean {
  if (w.obstacles[from] || w.obstacles[to]) return false;
  if (from === to) return true;
  const seen = new Uint8Array(w.cols * w.rows);
  const queue = new Int32Array(w.cols * w.rows);
  let head = 0;
  let tail = 0;
  queue[tail++] = from;
  seen[from] = 1;
  while (head < tail) {
    const c = at(queue, head++);
    const cx = c % w.cols;
    const cy = (c - cx) / w.cols;
    for (const [dx, dy] of ACTIONS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= w.cols || ny >= w.rows) continue;
      const n = ny * w.cols + nx;
      if (seen[n] || w.obstacles[n]) continue;
      if (n === to) return true;
      seen[n] = 1;
      queue[tail++] = n;
    }
  }
  return false;
}

const randInt = (rng: Rng, n: number) => Math.floor(rng() * n);

/** Random world: start in the left third, goal in the right third, ~16% obstacles, solvable. */
export function createWorld(cols: number, rows: number, rng: Rng, density = 0.16): World {
  const third = Math.max(1, Math.floor(cols / 3));
  let d = density;
  for (let attempt = 0; ; attempt++) {
    const start = randInt(rng, rows) * cols + randInt(rng, third);
    const goal = randInt(rng, rows) * cols + (cols - 1 - randInt(rng, third));
    const obstacles = new Uint8Array(cols * rows);
    for (let i = 0; i < obstacles.length; i++) {
      if (i !== start && i !== goal && rng() < d) obstacles[i] = 1;
    }
    const w: World = { cols, rows, obstacles, start, goal };
    if (isReachable(w, start, goal)) return w;
    if (attempt % 20 === 19) d *= 0.8;
  }
}

/** A new solvable goal cell on the right half, away from `avoid` cells. */
export function pickGoal(w: World, rng: Rng, avoid: number[]): number {
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(w.cols / 2) + randInt(rng, Math.ceil(w.cols / 2));
    const c = randInt(rng, w.rows) * w.cols + x;
    if (c === w.goal || avoid.includes(c) || w.obstacles[c]) continue;
    if (isReachable(w, w.start, c)) return c;
  }
  return w.goal;
}

export type Runner = { pos: number; steps: number; ret: number };

export type StepResult = {
  from: number;
  to: number;
  action: number;
  done: boolean;
  reachedGoal: boolean;
};

export type Stats = {
  episode: number;
  lastReturn: number;
  epsilon: number;
  successRate: number;
  steps: number;
};

export class QSim {
  readonly world: World;
  readonly q: Float32Array;
  readonly visited: Uint8Array;
  readonly hidden: Runner;
  readonly visible: Runner;
  readonly cap: number;
  epsilon = 1;
  episodes = 0;
  steps = 0;
  lastReturn = 0;
  private readonly rng: Rng;
  private readonly recent = new Uint8Array(WINDOW);
  private recentN = 0;

  constructor(world: World, rng: Rng) {
    this.world = world;
    this.rng = rng;
    this.q = new Float32Array(world.cols * world.rows * 4);
    this.visited = new Uint8Array(world.cols * world.rows);
    this.cap = 4 * (world.cols + world.rows);
    this.hidden = { pos: world.start, steps: 0, ret: 0 };
    this.visible = { pos: world.start, steps: 0, ret: 0 };
  }

  maxQ(s: number): number {
    const b = s * 4;
    return Math.max(at(this.q, b), at(this.q, b + 1), at(this.q, b + 2), at(this.q, b + 3));
  }

  bestAction(s: number): number {
    const b = s * 4;
    let best = -Infinity;
    let n = 0;
    let pick = 0;
    for (let a = 0; a < 4; a++) {
      const v = at(this.q, b + a);
      if (v > best + 1e-6) {
        best = v;
        n = 1;
        pick = a;
      } else if (Math.abs(v - best) <= 1e-6) {
        n++;
        if (this.rng() * n < 1) pick = a;
      }
    }
    return pick;
  }

  /** Greedy action without random tie-breaking (stable for drawing). Null if no preference. */
  policyAction(s: number): number | null {
    const b = s * 4;
    let best = 0;
    for (let a = 1; a < 4; a++) if (at(this.q, b + a) > at(this.q, b + best)) best = a;
    const spread =
      at(this.q, b + best) -
      Math.min(at(this.q, b), at(this.q, b + 1), at(this.q, b + 2), at(this.q, b + 3));
    return spread > 1e-4 ? best : null;
  }

  /** One epsilon-greedy step with a Q update. Resets the runner when the episode ends. */
  step(r: Runner): StepResult {
    const w = this.world;
    const from = r.pos;
    const action = this.rng() < this.epsilon ? randInt(this.rng, 4) : this.bestAction(from);
    const fx = from % w.cols;
    const fy = (from - fx) / w.cols;
    const nx = fx + dir(action)[0];
    const ny = fy + dir(action)[1];
    const blocked =
      nx < 0 || ny < 0 || nx >= w.cols || ny >= w.rows || !!w.obstacles[ny * w.cols + nx];
    const to = blocked ? from : ny * w.cols + nx;
    const reachedGoal = to === w.goal;
    const reward = reachedGoal ? R_GOAL : blocked ? R_BUMP : R_STEP;
    const target = reachedGoal ? reward : reward + GAMMA * this.maxQ(to);
    const i = from * 4 + action;
    this.q[i] = at(this.q, i) + ALPHA * (target - at(this.q, i));
    this.visited[from] = 1;
    this.visited[to] = 1;
    r.pos = to;
    r.steps++;
    r.ret += reward;
    this.steps++;
    const done = reachedGoal || r.steps >= this.cap;
    if (done) this.endEpisode(r, reachedGoal);
    return { from, to, action, done, reachedGoal };
  }

  private endEpisode(r: Runner, success: boolean) {
    this.episodes++;
    this.recent[this.episodes % WINDOW] = success ? 1 : 0;
    this.recentN = Math.min(WINDOW, this.recentN + 1);
    if (r === this.visible) this.lastReturn = r.ret;
    this.epsilon = Math.max(EPS_MIN, this.epsilon - (1 - EPS_MIN) / EPS_EPISODES);
    r.pos = this.world.start;
    r.steps = 0;
    r.ret = 0;
  }

  successRate(): number {
    if (this.recentN === 0) return 0;
    let n = 0;
    for (let i = 0; i < WINDOW; i++) n += at(this.recent, i);
    return n / this.recentN;
  }

  /** True when the last 20 episodes were (almost) all successes. */
  converged(): boolean {
    return this.recentN >= WINDOW && this.successRate() >= 0.95 && this.epsilon <= 0.1;
  }

  stats(): Stats {
    return {
      episode: this.episodes,
      lastReturn: this.lastReturn,
      epsilon: this.epsilon,
      successRate: this.successRate(),
      steps: this.steps,
    };
  }

  /** Train the hidden runner for n steps. */
  train(n: number) {
    for (let i = 0; i < n; i++) this.step(this.hidden);
  }

  /** Train until `episodes` more episodes finish, then settle epsilon. */
  trainSync(episodes: number) {
    const target = this.episodes + episodes;
    let guard = episodes * this.cap + 1000;
    while (this.episodes < target && guard-- > 0) this.step(this.hidden);
    this.epsilon = EPS_MIN;
  }

  /** Move the goal and partially forget, so learning continues forever. */
  relocateGoal(goal: number, keep = 0.35) {
    this.world.goal = goal;
    for (let i = 0; i < this.q.length; i++) this.q[i] = at(this.q, i) * keep;
    this.epsilon = Math.max(this.epsilon, 0.45);
    this.recentN = 0;
    this.recent.fill(0);
    this.resetRunners();
  }

  resetRunners() {
    for (const r of [this.hidden, this.visible]) {
      r.pos = this.world.start;
      r.steps = 0;
      r.ret = 0;
    }
  }

  /**
   * Toggle an obstacle. Rejected when it is the start/goal/protected cell or would make the
   * goal unreachable from the start or any protected cell.
   */
  toggleObstacle(cell: number, protectedCells: number[]): boolean {
    const w = this.world;
    if (cell === w.start || cell === w.goal || protectedCells.includes(cell)) return false;
    if (w.obstacles[cell]) {
      w.obstacles[cell] = 0;
    } else {
      w.obstacles[cell] = 1;
      const ok = [w.start, ...protectedCells].every((c) => isReachable(w, c, w.goal));
      if (!ok) {
        w.obstacles[cell] = 0;
        return false;
      }
      if (this.hidden.pos === cell) this.hidden.pos = w.start;
    }
    this.epsilon = Math.max(this.epsilon, 0.3);
    return true;
  }

  /** Greedy rollout from the start (for the static frame). */
  greedyPath(): number[] {
    const w = this.world;
    const path = [w.start];
    const seen = new Set<number>(path);
    let s = w.start;
    for (let i = 0; i < this.cap && s !== w.goal; i++) {
      const a = this.policyAction(s);
      if (a === null) break;
      const x = (s % w.cols) + dir(a)[0];
      const y = Math.floor(s / w.cols) + dir(a)[1];
      if (x < 0 || y < 0 || x >= w.cols || y >= w.rows || w.obstacles[y * w.cols + x]) break;
      s = y * w.cols + x;
      if (seen.has(s)) break;
      seen.add(s);
      path.push(s);
    }
    return path;
  }
}

/** Pick a grid that fits the box: ~52px cells (40 on touch), clamped to 40x22. */
export function gridFor(width: number, height: number, coarse: boolean) {
  const target = coarse ? 40 : 52;
  const size = Math.max(target, width / 40, height / 22);
  const cols = Math.max(8, Math.floor(width / size));
  const rows = Math.max(6, Math.floor(height / size));
  const cell = Math.min(width / cols, height / rows);
  return { cols, rows, cell, ox: (width - cols * cell) / 2, oy: (height - rows * cell) / 2 };
}
