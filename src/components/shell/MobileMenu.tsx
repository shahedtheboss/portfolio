import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { lockScroll, unlockScroll } from "@/hooks/useLenis";
import { navItems } from "@/lib/media";
import { ease } from "@/lib/motion";
import { getCategoryStats, pluralCount } from "@/lib/projectStats";

const stats = getCategoryStats();

type MobileMenuProps = { open: boolean; onClose: () => void };

/** Full-screen takeover menu: focus trapped, Esc closes, body scroll locked. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const root = ref.current;
    const focusable = () =>
      Array.from(root?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: ease.inOutQuart }}
          className="fixed inset-0 z-[55] overflow-y-auto bg-background"
        >
          <div
            className="blueprint-grid pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />
          <div className="container-x relative flex min-h-full flex-col py-5">
            <div className="flex items-center justify-between">
              <span aria-hidden="true" className="telemetry text-muted-foreground">
                NAVIGATION / 09 SUBSYSTEMS
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center border border-border text-foreground hover:border-primary hover:text-primary"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="my-auto py-8">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease: ease.outExpo }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={onClose}
                    className="group flex items-baseline gap-3 border-b border-border py-2 text-foreground transition-colors hover:text-primary"
                  >
                    <span aria-hidden="true" className="telemetry w-6 shrink-0 text-n-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display-type text-[clamp(1.5rem,6.5vw,3.4rem)] [font-stretch:80%] transition-[font-stretch] duration-500 ease-[var(--ease-out-expo)] group-hover:[font-stretch:125%] group-focus-visible:[font-stretch:125%]">
                      {item.label}
                    </span>
                  </a>
                  {item.id === "projects" && (
                    <ul className="mb-2 ml-9 mt-2 space-y-1 border-l border-border pl-3">
                      {stats.map((c) => (
                        <li key={c.key}>
                          <a
                            href={`#projects-${c.key}`}
                            onClick={onClose}
                            className="flex flex-wrap items-baseline justify-between gap-x-3 py-1.5 text-sm text-muted-foreground hover:text-primary"
                          >
                            <span>{c.label}</span>
                            <span className="telemetry text-[10px] text-n-3">
                              {pluralCount(c.projects, "project", "projects")}
                              {c.visits > 0 && ` · ${pluralCount(c.visits, "visit", "visits")}`}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
