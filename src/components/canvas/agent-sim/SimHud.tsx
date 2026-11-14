import type { Ref } from "react";

import { Panel } from "@/components/motion/Panel";

const FIELDS = [
  ["episode", "EPISODE", "0000"],
  ["return", "RETURN", "+0.00"],
  ["epsilon", "EPSILON", "1.00"],
  ["success", "SUCCESS", "0%"],
] as const;

/** Decorative live readout for the hero simulation. Values are written by the sim via refs. */
export function SimHud({
  hudRef,
  interactive,
}: {
  hudRef: Ref<HTMLDivElement>;
  interactive: boolean;
}) {
  return (
    <div
      ref={hudRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-6 left-[var(--gutter)] z-10 hidden w-56 sm:block"
    >
      <Panel label="Q-LEARNING" meta="LIVE" scan={false} bodyClassName="p-3">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {FIELDS.map(([key, label, init]) => (
            <div key={key}>
              <dt className="telemetry text-[9px] text-muted-foreground">{label}</dt>
              <dd data-hud={key} className="font-mono text-sm tabular-nums text-foreground">
                {init}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
      {interactive && (
        <p className="telemetry mt-2 text-[9px] text-muted-foreground">
          CLICK GRID TO PLACE OBSTACLE
        </p>
      )}
    </div>
  );
}
