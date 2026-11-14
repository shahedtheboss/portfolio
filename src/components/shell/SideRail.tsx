import { navItems } from "@/lib/media";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

import { ScrollProgress } from "./ScrollProgress";

/** Fixed left rail (lg+): subsystem counter, rotated section name, jump ticks, progress. */
export function SideRail() {
  const active = useActiveSection();
  const idx = Math.max(
    0,
    navItems.findIndex((n) => n.id === active),
  );
  const current = navItems[idx];
  return (
    <div className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="flex items-stretch gap-3">
        <nav aria-label="Section rail" className="pointer-events-auto relative flex flex-col gap-3">
          <span aria-hidden="true" className="absolute inset-y-0 left-[3px] w-px bg-border">
            <ScrollProgress axis="y" className="block h-full w-px bg-primary" />
          </span>
          {navItems.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-label={`Go to ${item.label}`}
              aria-current={i === idx ? "true" : undefined}
              className="relative flex h-3 w-3 items-center"
            >
              <span
                className={cn(
                  "h-px transition-all duration-300 ease-[var(--ease-out-expo)]",
                  i === idx ? "w-3 bg-primary" : "w-2 bg-n-3 hover:bg-foreground",
                )}
              />
            </a>
          ))}
        </nav>
        <div
          aria-hidden="true"
          className="telemetry flex flex-col items-center gap-3 text-muted-foreground"
        >
          <span className="[writing-mode:vertical-rl]">
            SUBSYSTEM {String(idx + 1).padStart(2, "0")}/{String(navItems.length).padStart(2, "0")}
          </span>
          <span className="text-primary [writing-mode:vertical-rl]">{current?.label}</span>
        </div>
      </div>
    </div>
  );
}
