import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { Certification } from "@/data/portfolio";
import { certificationMedia } from "@/lib/media";
import { lockScroll, unlockScroll } from "@/hooks/useLenis";
import { ease } from "@/lib/motion";

import { AwardBadge, CertLink, CertText } from "./CertParts";

type CertViewerProps = {
  item: Certification;
  index: number;
  total: number;
  reduced: boolean;
  onClose: () => void;
  onStep: (delta: number) => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const pad = (n: number) => String(n).padStart(2, "0");

export function CertViewer({ item, index, total, reduced, onClose, onStep }: CertViewerProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const handlers = useRef({ onClose, onStep });
  handlers.current = { onClose, onStep };

  const media = certificationMedia[item.key];

  useEffect(() => {
    lockScroll();
    closeBtn.current?.focus();
    return unlockScroll;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handlers.current.onClose();
      } else if (e.key === "ArrowLeft") {
        handlers.current.onStep(-1);
      } else if (e.key === "ArrowRight") {
        handlers.current.onStep(1);
      } else if (e.key === "Tab" && dialog.current) {
        const els = Array.from(dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (els.length === 0) return;
        const first = els[0];
        const last = els.at(-1);
        if (!first || !last) return;
        const active = document.activeElement;
        if (!dialog.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const nav =
    "inline-flex h-10 w-10 items-center justify-center border border-border bg-background/80 text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.35 }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
      />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Certificate ${index + 1} of ${total}: ${item.award} — ${item.title}`}
        className="relative grid max-h-[94vh] w-full max-w-6xl overflow-y-auto border border-border bg-card lg:grid-cols-[1.5fr_1fr]"
      >
        <div className="flex items-center justify-center bg-background p-3 sm:p-6">
          <motion.img
            key={item.key}
            {...(reduced ? {} : { layoutId: `cert-${item.key}` })}
            transition={{ duration: 0.6, ease: ease.outExpo }}
            src={media.thumb}
            alt={`${item.award} — ${item.title}`}
            width={media.width}
            height={media.height}
            style={{ aspectRatio: `${media.width} / ${media.height}` }}
            className="max-h-[70vh] w-full object-contain"
          />
        </div>
        <div className="flex flex-col p-5 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span aria-hidden="true" className="telemetry text-muted-foreground">
              {pad(index + 1)} / {pad(total)}
            </span>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close certificate viewer"
              className={nav}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <AwardBadge award={item.award} className="self-start" />
          <div className="mt-4">
            <CertText item={item} titleClassName="text-xl" />
          </div>
          <CertLink item={item} className="mt-6 self-start" />
          <div className="mt-auto flex gap-2 pt-8">
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label="Previous certificate"
              className={nav}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label="Next certificate"
              className={nav}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
