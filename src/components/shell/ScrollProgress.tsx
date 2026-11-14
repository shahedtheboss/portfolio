import { motion, useScroll, useSpring } from "motion/react";

type ScrollProgressProps = { axis?: "x" | "y"; className?: string };

/** Hairline that fills with page scroll progress. */
export function ScrollProgress({ axis = "x", className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={
        axis === "x"
          ? { scaleX: p, transformOrigin: "0% 50%" }
          : { scaleY: p, transformOrigin: "50% 0%" }
      }
    />
  );
}
