import type { SkillGroup } from "@/data/portfolio";

/** Node/glyph shape per level label. Shapes differ; none implies rank. */
export const levelShape = (level: SkillGroup["level"]) =>
  level === "Currently Practicing"
    ? "circle"
    : level === "Working Knowledge"
      ? "diamond"
      : "square";

export const VB_W = 1200;
export const VB_H = 360;
const COL_W = VB_W / 8;
const TOP = 48;
const BOTTOM = VB_H - 48;

export type GraphNode = { x: number; y: number };
export type GraphEdge = { from: number; to: number; d: string; key: string };

/** Column x position for layer i (matches an 8-column CSS grid of equal cells). */
export const colCenter = (i: number, layers: number) => (VB_W / layers) * (i + 0.5);

/** Evenly spaced node positions per layer, vertically centred. */
export function layoutNodes(groups: readonly SkillGroup[]): GraphNode[][] {
  return groups.map((g, i) => {
    const n = g.skills.length;
    const x = colCenter(i, groups.length);
    const mid = (TOP + BOTTOM) / 2;
    const gap = n > 1 ? Math.min(36, (BOTTOM - TOP) / (n - 1)) : 0;
    return g.skills.map((_, k) => ({ x, y: mid + (k - (n - 1) / 2) * gap }));
  });
}

/** Deterministic edges: each node links to 2-3 nodes in the next layer. */
export function layoutEdges(nodes: readonly GraphNode[][]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let l = 0; l < nodes.length - 1; l++) {
    const src = nodes[l];
    const dst = nodes[l + 1];
    if (!src || !dst) continue;
    src.forEach((a, k) => {
      const base = src.length > 1 ? Math.round((k * (dst.length - 1)) / (src.length - 1)) : 0;
      const targets = new Set([base, (base + 1) % dst.length]);
      if (k % 3 === 0) targets.add((base + 2 + k) % dst.length);
      targets.forEach((j) => {
        const b = dst[j];
        if (!b) return;
        const mx = (a.x + b.x) / 2;
        edges.push({
          from: l,
          to: l + 1,
          key: `${l}-${k}-${j}`,
          d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} C${mx.toFixed(1)} ${a.y.toFixed(1)} ${mx.toFixed(1)} ${b.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
        });
      });
    });
  }
  return edges;
}

export { COL_W };
