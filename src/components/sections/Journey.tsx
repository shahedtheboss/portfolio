import { journey } from "@/data/portfolio";
import { Chip } from "@/components/motion/Chip";
import { Panel } from "@/components/motion/Panel";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { StatusLight } from "@/components/motion/StatusLight";
import { cn } from "@/lib/utils";

const exploring = ["Reinforcement Learning", "Autonomous Robotics", "AI-Assisted Engineering"];

type Status = (typeof journey)[number]["status"];

function Marker({ status }: { status: Status }) {
  if (status === "in-progress") {
    return <StatusLight tone="warn" className="h-3 w-3 [&>span]:h-3 [&>span]:w-3" />;
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-3 w-3 rounded-full border",
        status === "completed" ? "border-primary bg-primary" : "border-n-3 bg-background",
      )}
    />
  );
}

export function Journey() {
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
        <ol className="relative">
          {journey.map((item, i) => (
            <li
              key={item.step}
              className="relative grid grid-cols-[1.5rem_1fr] gap-x-4 md:grid-cols-[1fr_2rem_1fr] md:gap-x-8"
            >
              {/* spine segment: dashed when the step is ahead */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bottom-0 left-[11px] top-0 border-l md:left-1/2",
                  item.status === "ahead" ? "border-dashed border-n-3" : "border-n-2",
                )}
              />
              <span className="relative z-10 flex h-6 items-center justify-center pt-1 md:col-start-2 md:row-start-1">
                <Marker status={item.status} />
              </span>
              <div
                className={cn(
                  "pb-10 md:row-start-1",
                  i % 2 === 0 ? "md:col-start-1 md:text-right" : "md:col-start-3",
                )}
              >
                <div
                  className={cn(
                    "flex flex-wrap items-baseline gap-x-3 gap-y-1",
                    i % 2 === 0 && "md:justify-end",
                  )}
                >
                  <span className="font-mono text-xs text-primary">{item.step}</span>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.status === "in-progress" && (
                    <span className="bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-secondary-foreground">
                      IN PROGRESS
                    </span>
                  )}
                  {item.status === "ahead" && (
                    <span className="border border-n-3 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      AHEAD
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <Panel className="mt-12 max-w-2xl" label="NEXT TARGETS" bodyClassName="p-5">
          <p className="telemetry text-primary">CURRENTLY EXPLORING</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {exploring.map((t) => (
              <Chip as="li" key={t} tone="signal">
                {t}
              </Chip>
            ))}
          </ul>
        </Panel>
      </div>
    </section>
  );
}
