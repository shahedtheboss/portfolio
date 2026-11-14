import { useRef, useState } from "react";
import { useScroll, useSpring } from "motion/react";

import { journey } from "@/data/portfolio";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { ExploringPanel } from "./journey/ExploringPanel";
import { JourneyItem } from "./journey/JourneyItem";
import { MapDecor } from "./journey/MapDecor";
import { RoutePath, type RouteStatus } from "./journey/RoutePath";
import { useMinWidth, useWaypoints } from "./journey/useWaypoints";

/** The terminal segment leads to the "next targets" panel, which is by definition ahead. */
const toStatus = (s: string): RouteStatus =>
  s === "in-progress" || s === "ahead" ? s : "completed";
const statuses: RouteStatus[] = [...journey.slice(1).map((j) => toStatus(j.status)), "ahead"];

export function Journey() {
  const reduced = usePrefersReducedMotion();
  const wide = useMinWidth(768);
  const box = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLElement | null)[]>([]);
  const end = useRef<HTMLSpanElement>(null);
  const geom = useWaypoints(box, nodes, end, journey.length);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({ target: box, offset: ["start 65%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  const armed = geom !== null && !reduced;

  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="relative scroll-mt-20 border-t border-border bg-surface py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="08"
          id="journey-title"
          eyebrow="LEARNING JOURNEY"
          title="From Engineering Fundamentals to Intelligent Systems"
        />
        <div ref={box} className="relative">
          <MapDecor />
          {/* SSR / pre-measure fallback: a plain line */}
          {!geom && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-[11px] border-l border-n-2 md:left-1/2"
            />
          )}
          {geom && (
            <RoutePath
              geom={geom}
              statuses={statuses}
              progress={progress}
              still={reduced}
              onReach={setReached}
            />
          )}
          <ol className="relative z-10">
            {journey.map((item, i) => (
              <JourneyItem
                key={item.step}
                step={item.step}
                title={item.title}
                body={item.body}
                status={toStatus(item.status)}
                left={i % 2 === 0}
                armed={armed}
                revealed={i < reached}
                wide={wide}
                nodeRef={(el) => {
                  nodes.current[i] = el;
                }}
              />
            ))}
          </ol>
          <div aria-hidden="true" className="relative h-10">
            <span ref={end} className="absolute bottom-0 left-3 h-0 w-0 md:left-1/2" />
          </div>
        </div>
        <ExploringPanel />
      </div>
    </section>
  );
}
