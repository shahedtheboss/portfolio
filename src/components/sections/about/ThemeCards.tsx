import { aboutThemes } from "@/data/portfolio";
import { Panel } from "@/components/motion/Panel";
import { Tilt } from "@/components/motion/Tilt";
import { useReveal } from "@/components/motion/useReveal";
import { cn } from "@/lib/utils";

function ThemeCard({ theme, index }: { theme: (typeof aboutThemes)[number]; index: number }) {
  const { ref, hidden } = useReveal<HTMLLIElement>(0.15);
  return (
    <li
      ref={ref}
      style={{ transitionDelay: hidden ? "0ms" : `${index * 90}ms` }}
      className={cn(
        "group/card h-full transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
        hidden && "translate-y-8 opacity-0",
      )}
    >
      <Tilt className="h-full" max={4}>
        <Panel className="h-full" bodyClassName="relative p-5">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary shadow-[0_0_10px_var(--primary)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/card:scale-x-100 group-focus-within/card:scale-x-100"
          />
          <span className="numeral block text-[3.5rem]" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h4 className="mt-4 font-display text-lg font-semibold text-foreground">{theme.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{theme.body}</p>
        </Panel>
      </Tilt>
    </li>
  );
}

export function ThemeCards() {
  return (
    <div className="mt-16 md:mt-24">
      <h3 className="display-type text-[length:var(--text-step-2)] text-foreground">
        My Passion and Goals
      </h3>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aboutThemes.map((theme, i) => (
          <ThemeCard key={theme.title} theme={theme} index={i} />
        ))}
      </ul>
    </div>
  );
}
