/** Static geometry for the policy net drawn beside the robot (viewBox units). */
export type Pt = { x: number; y: number };

export const LAYERS = [4, 6, 6, 4] as const;
const LX = [34, 94, 154, 214];

function layerY(n: number, i: number) {
  const span = n === 6 ? 220 : 160;
  return 200 - span / 2 + (span / (n - 1)) * i;
}

export const NODES: Pt[][] = LAYERS.map((n, l) =>
  Array.from({ length: n }, (_, i) => ({ x: LX[l] ?? 0, y: layerY(n, i) })),
);

export type Edge = { l: number; i: number; j: number; a: Pt; b: Pt };

export const EDGES: Edge[] = NODES.slice(0, -1).flatMap((layer, l) =>
  layer.flatMap((a, i) => (NODES[l + 1] ?? []).map((b, j) => ({ l, i, j, a, b }))),
);

export const ARROWS = ["↑", "→", "↓", "←"];

/** Chest port where the cable from the output bus enters the robot. */
export const PORT: Pt = { x: 330, y: 226 };
export const BUS_X = 252;

/** Robot shoulder and link lengths for the two-link arm. */
export const SHOULDER: Pt = { x: 432, y: 196 };
export const L1 = 62;
export const L2 = 52;

/** Hand targets (absolute viewBox coords) the arm eases between. */
export const POSES: Pt[] = [
  { x: 486, y: 118 },
  { x: 492, y: 206 },
  { x: 466, y: 268 },
  { x: 470, y: 150 },
];
