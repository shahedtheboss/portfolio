import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { useRichPointer } from "@/hooks/useFinePointer";
import { cn } from "@/lib/utils";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
};

/** 3D tilt with a light-tracking highlight (CSS vars). Fine pointer only. */
export function Tilt({ children, className, max = 6 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRichPointer();

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty("--rx", `${-(py - 0.5) * 2 * max}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--lit", "1");
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lit", "0");
  };

  const style: CSSProperties = active
    ? { transform: "perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))" }
    : {};

  return (
    <div
      ref={ref}
      onPointerMove={active ? move : undefined}
      onPointerLeave={active ? reset : undefined}
      style={style}
      className={cn(
        "relative transition-transform duration-200 ease-[var(--ease-out-expo)] [transform-style:preserve-3d]",
        className,
      )}
    >
      {children}
      {active && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--lit,0)] transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), var(--signal-dim), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
