import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";

import { Panel } from "@/components/motion/Panel";
import { cn } from "@/lib/utils";

import { FeedArt, ScanOverlay } from "./FeedArt";
import { DRAWS, WIPES, activeFeed, camLabel, feeds, formatTimecode } from "./feeds";

const OPEN = "inset(0% 0% 0% 0%)";

const textCls =
  "text-[length:clamp(1.15rem,0.95rem+0.85vw,1.85rem)] font-medium leading-snug text-foreground";

export function RecLight() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden="true">
      <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-destructive" />
      REC
    </span>
  );
}

/** One camera feed: a clip-path wipe plus a leading signal edge, driven by scroll progress. */
function Feed({
  index,
  feed,
  progress,
}: {
  index: number;
  feed: (typeof feeds)[number];
  progress: MotionValue<number>;
}) {
  const [a, b] = WIPES[index] ?? [0, 1];
  const clipPath = useTransform(
    progress,
    [a, b],
    [index === 0 ? OPEN : "inset(0% 100% 0% 0%)", OPEN],
  );
  const scale = useTransform(progress, [a, b], [index === 0 ? 1 : 1.05, 1]);
  const edgeLeft = useTransform(progress, [a, b], ["0%", "100%"]);
  const edgeOpacity = useTransform(progress, [a, (a + b) / 2, b], [0, 1, 0]);
  const draw = useTransform(progress, [...(DRAWS[index] ?? [0, 1])], [0, 1]);
  return (
    <>
      <motion.div
        style={{ clipPath }}
        className="relative col-start-1 row-start-1 overflow-hidden bg-card"
      >
        <motion.div style={{ scale }} className="relative flex h-full flex-col justify-center">
          <FeedArt
            index={index}
            draw={draw}
            className="absolute inset-0 h-full w-full opacity-60"
          />
          <p className={cn(textCls, "relative max-w-[34ch] p-8 xl:p-12")}>
            <span className="telemetry mb-4 block text-[12px] text-primary">{feed.label}</span>
            {feed.body}
          </p>
        </motion.div>
      </motion.div>
      {index > 0 && (
        <motion.span
          aria-hidden="true"
          style={{ left: edgeLeft, opacity: edgeOpacity }}
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-primary shadow-[0_0_14px_var(--primary)]"
        />
      )}
    </>
  );
}

function Segment({
  index,
  active,
  progress,
}: {
  index: number;
  active: boolean;
  progress: MotionValue<number>;
}) {
  const fill = useTransform(progress, [index / 3, (index + 1) / 3], [0, 1]);
  return (
    <div className="flex-1">
      <div className="relative h-1 overflow-hidden bg-n-1">
        <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-primary" />
      </div>
      <span
        className={cn(
          "telemetry mt-1.5 block transition-colors",
          active ? "text-primary" : "text-n-3",
        )}
      >
        {camLabel(index)}
      </span>
    </div>
  );
}

/** Pinned "monitor": the three labelled texts play as camera feeds as scroll progresses. */
export function CameraMonitor({ progress }: { progress: MotionValue<number> }): ReactNode {
  const [active, setActive] = useState(0);
  const timecode = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(progress, "change", (p) => {
    setActive(activeFeed(p));
    if (timecode.current) timecode.current.textContent = formatTimecode(p);
  });

  return (
    <Panel
      scan={false}
      label={<span aria-hidden="true">{`${camLabel(active)} / 03`}</span>}
      meta={
        <span className="flex items-center gap-4" aria-hidden="true">
          <span ref={timecode}>{formatTimecode(0)}</span>
          <RecLight />
        </span>
      }
    >
      <div className="relative grid min-h-[min(26rem,52svh)] overflow-hidden">
        {feeds.map((f, i) => (
          <Feed key={f.label} index={i} feed={f} progress={progress} />
        ))}
        <ScanOverlay />
      </div>
      <div aria-hidden="true" className="flex gap-2 border-t border-border px-4 py-3">
        {feeds.map((f, i) => (
          <Segment key={f.label} index={i} active={active === i} progress={progress} />
        ))}
      </div>
    </Panel>
  );
}
