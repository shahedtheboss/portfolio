import { useEffect } from "react";

type LenisLike = {
  raf: (t: number) => void;
  destroy: () => void;
  scrollTo: (t: Element | number, o?: object) => void;
  stop: () => void;
  start: () => void;
};

/** Offset that clears the floating nav when jumping to a section. */
export const NAV_OFFSET = -72;

let instance: LenisLike | null = null;
let locks = 0;

function lockBody(on: boolean) {
  document.documentElement.style.overflow = on ? "hidden" : "";
}

/** Scroll to an element (or selector) using Lenis when active, native otherwise. */
export function scrollToTarget(target: Element | string, opts: { immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, {
      offset: NAV_OFFSET,
      duration: 1.4,
      immediate: opts.immediate,
    });
  } else {
    el.scrollIntoView({ behavior: opts.immediate ? "auto" : "smooth", block: "start" });
  }
}

/** Lock page scroll (menus, dialogs). Calls nest; pair each with unlockScroll. */
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    instance?.stop();
    lockBody(true);
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    instance?.start();
    lockBody(false);
  }
}

/** Mount once at the page root: smooth scroll + in-page anchor handling. */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let cancelled = false;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      const id = a?.getAttribute("href");
      if (!id || id === "#") return;
      let target: Element | null = null;
      try {
        target = document.querySelector(id);
      } catch {
        return;
      }
      if (!target) return;
      e.preventDefault();
      history.pushState(null, "", id);
      scrollToTarget(target, { immediate: reduced });
    };
    document.addEventListener("click", onClick);

    if (!reduced) {
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
        instance = lenis;
        if (locks > 0) lenis.stop();
        const loop = (t: number) => {
          lenis.raf(t);
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      instance?.destroy();
      instance = null;
    };
  }, []);
}
