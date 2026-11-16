import { Panel } from "@/components/motion/Panel";
import { useReveal } from "@/components/motion/useReveal";
import { cn } from "@/lib/utils";

import { FeedArt, ScanOverlay } from "./FeedArt";
import { camLabel, feeds } from "./feeds";
import { RecLight } from "./CameraMonitor";

function StaticFeed({ index, feed: f }: { index: number; feed: (typeof feeds)[number] }) {
  const { ref, hidden } = useReveal<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      className={cn(
        "about-feed-reveal transition-[clip-path,opacity] duration-[900ms] ease-[var(--ease-out-expo)]",
        hidden && "opacity-0 [clip-path:inset(0_100%_0_0)]",
      )}
    >
      <Panel
        scan={false}
        label={<span aria-hidden="true">{`${camLabel(index)} / 03`}</span>}
        meta={<RecLight />}
        bodyClassName="relative"
      >
        <FeedArt index={index} draw={1} className="absolute inset-0 h-full w-full opacity-50" />
        <ScanOverlay />
        <p className="relative p-6 text-[length:var(--text-step-1)] leading-snug text-foreground">
          <span className="telemetry mb-3 block text-[12px] text-primary">{f.label}</span>
          {f.body}
        </p>
      </Panel>
    </div>
  );
}

/** Non-pinned fallback: the feeds stack as panels that reveal on scroll. */
export function FeedStack() {
  return (
    <div className="space-y-4">
      {feeds.map((f, i) => (
        <StaticFeed key={f.label} index={i} feed={f} />
      ))}
    </div>
  );
}
