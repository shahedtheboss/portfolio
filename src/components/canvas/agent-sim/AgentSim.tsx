import { useEffect, useRef, type RefObject } from "react";

import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { createSimController, type SimController } from "./controller";

export type AgentSimProps = {
  /** Hero section: receives pointer input, drives visibility pausing. */
  sectionRef: RefObject<HTMLElement | null>;
  /** HUD root containing `[data-hud="episode|return|epsilon|success"]` elements. */
  hudRef: RefObject<HTMLElement | null>;
  /** Start learning (false while the boot overlay is up). */
  active: boolean;
};

/** Full-bleed Q-learning grid world. Renders only an empty canvas until effects run. */
export function AgentSim({ sectionRef, hudRef, active }: AgentSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrlRef = useRef<SimController | null>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const q = (k: string) =>
      hudRef.current?.querySelector<HTMLElement>(`[data-hud="${k}"]`) ?? null;
    const ctrl = createSimController({
      canvas,
      section,
      hud: {
        episode: q("episode"),
        ret: q("return"),
        epsilon: q("epsilon"),
        success: q("success"),
      },
      coarse: !fine,
      reduced,
      interactive: fine,
    });
    ctrlRef.current = ctrl;
    return () => {
      ctrl.destroy();
      ctrlRef.current = null;
    };
  }, [sectionRef, hudRef, fine, reduced]);

  useEffect(() => {
    ctrlRef.current?.setRunning(active);
  }, [active, fine, reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />;
}

export default AgentSim;
