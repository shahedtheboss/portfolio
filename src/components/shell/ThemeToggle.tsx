import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

import { ease } from "@/lib/motion";

/** Theme switch: circular view-transition sweep from the button, plain swap as fallback. */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const apply = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  };

  const toggle = () => {
    const next = !dark;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || reduced || !ref.current) {
      apply(next);
      return;
    }
    const r = ref.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(() => flushSync(() => apply(next)));
    t.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 750,
            easing: `cubic-bezier(${ease.outExpo.join(",")})`,
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => undefined);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="relative flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Sun
        size={16}
        className={`absolute transition-all duration-500 ease-[var(--ease-out-expo)] ${dark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}
      />
      <Moon
        size={16}
        className={`absolute transition-all duration-500 ease-[var(--ease-out-expo)] ${dark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
    </button>
  );
}
