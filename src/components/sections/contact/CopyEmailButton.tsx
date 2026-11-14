import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/motion/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Secondary button that copies the address and confirms for ~2 s. */
export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onClick = async () => {
    if (!(await copyText(email))) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const t = reduced ? { duration: 0 } : { duration: 0.2 };
  return (
    <>
      <Button
        variant="ghost"
        onClick={onClick}
        {...(className ? { className } : {})}
        data-cursor="link"
      >
        <span className="relative inline-flex min-w-[7.5rem] items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={t}
                className="inline-flex items-center gap-2 text-primary"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <motion.path
                    d="M3 8.5 6.5 12 13 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.35, delay: 0.1 }}
                  />
                </svg>
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={t}
              >
                Copy email
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </Button>
      <span className="sr-only" aria-live="polite" role="status">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  );
}
