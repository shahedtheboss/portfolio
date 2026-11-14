export type Palette = {
  primary: string;
  secondary: string;
  n1: string;
  n2: string;
  n3: string;
  n4: string;
  n5: string;
};

export type Variant = "agent" | "control" | "vision" | "plc";

/** A self-contained animation. `draw` advances by `dt` seconds and paints a full frame. */
export type Scene = {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, c: Palette) => void;
};

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
