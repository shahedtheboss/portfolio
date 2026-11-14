import { useRef, type PointerEvent, type ReactNode } from "react";

import { useRichPointer } from "@/hooks/useFinePointer";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of pointer offset the child follows. */
  strength?: number;
};

/** Child drifts toward the pointer. Fine pointer, no reduced motion only. */
export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const active = useRichPointer();

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={active ? move : undefined}
      onPointerLeave={active ? reset : undefined}
      className={cn(
        "inline-block transition-transform duration-300 ease-[var(--ease-out-expo)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
