import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { useRichPointer } from "@/hooks/useFinePointer";
import { spring } from "@/lib/motion";

type Variant = "default" | "link" | "card" | "drag" | "image";

const LABELS: Partial<Record<Variant, string>> = {
  link: "OPEN",
  drag: "DRAG",
  image: "VIEW",
};

const TARGETS = "[data-cursor], a, button, [role='button'], summary, input, textarea";

/** Reticle + trailing spotlight in one pointer-events:none layer. Fine pointers only. */
export function Cursor() {
  const active = useRichPointer();
  const [variant, setVariant] = useState<Variant>("default");
  const [shown, setShown] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, spring);
  const ry = useSpring(y, spring);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 1 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 1 });

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
      const t = e.target instanceof Element ? e.target.closest(TARGETS) : null;
      if (!t) return setVariant("default");
      const d = t.getAttribute("data-cursor") as Variant | null;
      setVariant(d ?? "link");
    };
    const hide = () => setShown(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    root.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [active, x, y]);

  if (!active) return null;
  const expanded = variant !== "default";
  const label = LABELS[variant];

  return (
    <div aria-hidden="true" className="cursor-layer" style={{ opacity: shown ? 1 : 0 }}>
      <motion.div className="cursor-spotlight" style={{ x: sx, y: sy }} />
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <div
          className="relative -ml-4 -mt-4 h-8 w-8 transition-transform duration-300 ease-[var(--ease-out-expo)]"
          style={{ transform: `scale(${pressed ? 0.8 : expanded ? 1.9 : 1})` }}
        >
          <span className="absolute inset-0 rounded-full border border-primary" />
          <span className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-primary" />
          <span
            className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-expo)]"
            style={{ transform: `rotate(${expanded ? 45 : 0}deg)` }}
          >
            <span className="absolute left-1/2 -top-1 h-2 w-px bg-primary" />
            <span className="absolute -bottom-1 left-1/2 h-2 w-px bg-primary" />
            <span className="absolute -left-1 top-1/2 h-px w-2 bg-primary" />
            <span className="absolute -right-1 top-1/2 h-px w-2 bg-primary" />
          </span>
        </div>
        {label && (
          <span className="telemetry absolute left-6 top-6 whitespace-nowrap text-primary">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
