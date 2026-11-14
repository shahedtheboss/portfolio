import { motion } from "motion/react";

import { Panel } from "@/components/motion/Panel";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ease, stagger } from "@/lib/motion";

const exploring = ["Reinforcement Learning", "Autonomous Robotics", "AI-Assisted Engineering"];

/** Final "next targets" panel where the route terminates. */
export function ExploringPanel() {
  const reduced = usePrefersReducedMotion();
  return (
    <Panel className="mx-auto max-w-2xl border-dashed" label="NEXT TARGETS" bodyClassName="p-5">
      <p className="telemetry text-primary">CURRENTLY EXPLORING</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {exploring.map((t, i) => (
          <motion.li
            key={t}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5, delay: i * stagger * 2, ease: ease.outExpo }}
            className="inline-flex items-center border border-primary/50 bg-signal-dim px-2 py-0.5 font-mono text-[11px] leading-5 text-primary"
          >
            {t}
          </motion.li>
        ))}
      </ul>
    </Panel>
  );
}
