import { useEffect, useState, type RefObject } from "react";

export type Point = { x: number; y: number };
export type Waypoints = { w: number; h: number; pts: Point[] };

function center(el: Element, box: DOMRect): Point {
  const r = el.getBoundingClientRect();
  return {
    x: Math.round((r.left + r.width / 2 - box.left) * 10) / 10,
    y: Math.round((r.top + r.height / 2 - box.top) * 10) / 10,
  };
}

/**
 * Measures the centre of every waypoint element relative to the container.
 * Null on the server and until the first client measurement.
 */
export function useWaypoints(
  container: RefObject<HTMLElement | null>,
  nodes: RefObject<(HTMLElement | null)[]>,
  end: RefObject<HTMLElement | null>,
  count: number,
): Waypoints | null {
  const [geom, setGeom] = useState<Waypoints | null>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const els = nodes.current.slice(0, count);
      if (els.length < count || els.some((n) => !n) || !end.current) return;
      const pts = [...els.map((n) => center(n as HTMLElement, box)), center(end.current, box)];
      const next: Waypoints = { w: Math.round(box.width), h: Math.round(box.height), pts };
      setGeom((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [container, nodes, end, count]);

  return geom;
}

export function useMinWidth(px: number) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [px]);
  return match;
}

/** Smooth vertical S-curve between two waypoints. */
export function segmentPath(a: Point, b: Point): string {
  const ym = (a.y + b.y) / 2;
  return `M${a.x} ${a.y}C${a.x} ${ym} ${b.x} ${ym} ${b.x} ${b.y}`;
}
