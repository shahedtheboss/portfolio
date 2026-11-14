import { useEffect, useState } from "react";

import { lockScroll, unlockScroll } from "@/hooks/useLenis";

const LINES = [
  "mounting perception stack",
  "loading policy weights",
  "calibrating sensor array",
  "syncing environment model",
  "arming reward signal",
  "handshake complete",
];

/** Whole sequence length in ms (lines, bar, wipe). Keep in sync with `.boot-*` CSS. */
const TOTAL = 1750;

/**
 * Runs before first paint (inline, right after the overlay markup). Hides the overlay for
 * repeat visits and reduced-motion users and flags `data-boot` for the hero entrance.
 */
const PRE_PAINT = `(function(){try{var d=document.documentElement,r=matchMedia("(prefers-reduced-motion: reduce)").matches,b=false;try{b=sessionStorage.getItem("booted")==="1"}catch(e){}if(r||b){var o=document.getElementById("boot-overlay");if(o)o.style.display="none";d.dataset.booted="1";d.dataset.boot="done"}else{d.dataset.boot="pending"}}catch(e){}})()`;

function markDone() {
  const root = document.documentElement;
  root.setAttribute("data-booted", "1");
  root.setAttribute("data-boot", "done");
  window.dispatchEvent(new Event("boot:done"));
}

/** True once the boot sequence has finished or was skipped. False on SSR / first render. */
export function useBootDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (document.documentElement.getAttribute("data-booted") === "1") {
      setDone(true);
      return;
    }
    const on = () => setDone(true);
    window.addEventListener("boot:done", on);
    return () => window.removeEventListener("boot:done", on);
  }, []);
  return done;
}

/**
 * Boot overlay rendered in the SSR HTML so it covers the page from first paint. The visuals
 * are pure CSS (see `.boot-*` in styles.css), so the overlay also clears itself without JS.
 */
export function BootLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-booted") === "1") {
      setGone(true);
      return;
    }
    let skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      skip = skip || sessionStorage.getItem("booted") === "1";
    } catch {
      /* storage unavailable */
    }
    if (skip) {
      markDone();
      setGone(true);
      return;
    }
    lockScroll();
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem("booted", "1");
      } catch {
        /* storage unavailable */
      }
      unlockScroll();
      markDone();
      setGone(true);
    }, TOTAL);
    return () => {
      window.clearTimeout(t);
      unlockScroll();
    };
  }, []);

  if (gone) return null;

  return (
    <>
      <div id="boot-overlay" aria-hidden="true" className="boot-overlay" suppressHydrationWarning>
        <div className="blueprint-grid absolute inset-0 opacity-60" />
        <div className="container-x relative pb-[10vh]">
          <ul className="telemetry space-y-2 text-muted-foreground">
            {LINES.map((l, i) => (
              <li
                key={l}
                className="boot-line flex gap-3"
                style={{ animationDelay: `${(i + 1) * 200}ms` }}
              >
                <span className="text-primary">[ OK ]</span>
                {l}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border">
              <div className="boot-bar h-px bg-primary" />
            </div>
            <span className="boot-pct telemetry w-10 text-right text-primary" />
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
    </>
  );
}
