import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { getCategoryStats, pluralCount } from "@/lib/projectStats";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const stats = getCategoryStats();

/** Projects nav item: link + chevron toggle; animated menu with per-category counts. */
export function ProjectsDropdown({ active, linkClass }: { active: boolean; linkClass: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const closeTimer = useRef<number>(0);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  const hoverOpen = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <li
      ref={rootRef}
      className="relative flex items-center"
      onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hoverClose()}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <a href="#projects" className={cn(linkClass, "pr-1")} data-active={active}>
        Projects
      </a>
      <button
        ref={toggleRef}
        type="button"
        aria-label="Projects categories"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="px-1 py-2 text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            initial={{ opacity: 0, y: -6, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, y: -6, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.28, ease: ease.outExpo }}
            className="absolute left-0 top-full z-50 mt-2 w-[22rem] border border-border bg-popover p-1.5"
          >
            {stats.map((c, i) => (
              <motion.li
                key={c.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3, ease: ease.outExpo }}
              >
                <a
                  href={`#projects-${c.key}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between gap-4 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-signal-dim hover:text-primary"
                >
                  <span>{c.label}</span>
                  <span className="telemetry shrink-0 text-[10px] text-n-3">
                    {pluralCount(c.projects, "project", "projects")}
                    {c.visits > 0 && ` · ${pluralCount(c.visits, "visit", "visits")}`}
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
