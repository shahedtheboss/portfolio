import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { useRichPointer } from "@/hooks/useFinePointer";

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
  const shownRef = useRef(false);
  const variantRef = useRef<Variant>("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Outer ring trails the pointer very slightly, as a small offset from the wrapper.
  const ringSpring = { stiffness: 1400, damping: 60, mass: 0.4 };
  const tx = useSpring(x, ringSpring);
  const ty = useSpring(y, ringSpring);
  const ringX = useTransform(() => tx.get() - x.get());
  const ringY = useTransform(() => ty.get() - y.get());
  const spotSpring = { stiffness: 420, damping: 38, mass: 0.6 };
  const sx = useSpring(x, spotSpring);
  const sy = useSpring(y, spotSpring);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shownRef.current) {
        shownRef.current = true;
        setShown(true);
      }
      const t = e.target instanceof Element ? e.target.closest(TARGETS) : null;
      const next: Variant = t
        ? ((t.getAttribute("data-cursor") as Variant | null) ?? "link")
        : "default";
      if (next !== variantRef.current) {
        variantRef.current = next;
        setVariant(next);
      }
    };
    const hide = () => {
      shownRef.current = false;
      setShown(false);
    };
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
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div
          className="relative -ml-4 -mt-4 h-8 w-8 transition-transform duration-[160ms] ease-[var(--ease-out-expo)]"
          style={{ transform: `scale(${pressed ? 0.8 : expanded ? 1.9 : 1})` }}
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-primary"
            style={{ x: ringX, y: ringY }}
          />
          <span className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-primary" />
          <span
            className="absolute inset-0 transition-transform duration-[220ms] ease-[var(--ease-out-expo)]"
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
