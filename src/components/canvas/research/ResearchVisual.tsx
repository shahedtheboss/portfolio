import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

import { createAgentScene } from "./sceneAgent";
import { createControlScene } from "./sceneControl";
import { createPlcScene } from "./scenePlc";
import { createVisionScene } from "./sceneVision";
import type { Palette, Scene, Variant } from "./types";

const DPR_CAP = 1.75;
const STATIC_FRAMES = 260;

const factories: Record<Variant, () => Scene> = {
  agent: createAgentScene,
  control: createControlScene,
  vision: createVisionScene,
  plc: createPlcScene,
};

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fb: string) => s.getPropertyValue(name).trim() || fb;
  return {
    primary: v("--primary", "#B6FF3C"),
    secondary: v("--secondary", "#FFA62B"),
    n1: v("--n-1", "#1B2431"),
    n2: v("--n-2", "#2A3546"),
    n3: v("--n-3", "#5B6779"),
    n4: v("--n-4", "#8C98AA"),
    n5: v("--n-5", "#E7ECF2"),
  };
}

type Props = {
  variant: Variant;
  /** Only animates while true (and on screen, and the tab is visible). */
  active: boolean;
  className?: string;
};

/** Small generative canvas themed to a research channel. Decorative. */
export function ResearchVisual({ variant, active, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const scene = factories[variant]();
    let palette = readPalette();
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let onScreen = false;
    let tabVisible = document.visibilityState !== "hidden";

    const paint = (dt: number) => {
      ctx.setTransform(canvas.width / Math.max(w, 1), 0, 0, canvas.height / Math.max(h, 1), 0, 0);
      scene.draw(ctx, w, h, dt, palette);
    };
    const paintStatic = () => {
      for (let i = 0; i < STATIC_FRAMES; i++) paint(1 / 30);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      paint(dt);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      const run = active && onScreen && tabVisible && !reduced;
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const repaint = () => {
      if (!w || !h) return;
      if (reduced) paintStatic();
      else paint(0);
    };

    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      w = entry.contentRect.width;
      h = entry.contentRect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      repaint();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      sync();
    });
    io.observe(canvas);

    const onVis = () => {
      tabVisible = document.visibilityState !== "hidden";
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    const mo = new MutationObserver(() => {
      palette = readPalette();
      repaint();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    sync();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant, active, reduced]);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className={cn("block h-full w-full", className)} />
  );
}
