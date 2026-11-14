import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import type { Certification } from "@/data/portfolio";
import { certificationMedia } from "@/lib/media";
import { ease } from "@/lib/motion";

type CertDeckProps = {
  items: readonly Certification[];
  selected: number | null;
  onSelect: (index: number) => void;
  registerCard: (index: number, el: HTMLButtonElement | null) => void;
};

/** Deterministic fan layout from the index. */
function pose(i: number, n: number, hovered: number | null) {
  const t = i - (n - 1) / 2;
  const lifted = hovered === i;
  const part = hovered === null || lifted ? 0 : Math.sign(i - hovered) * 46;
  return {
    x: t * 110 + part,
    y: lifted ? -36 : t * t * 9,
    z: lifted ? 90 : 0,
    rotateZ: lifted ? 0 : t * 6,
    rotateY: lifted ? 0 : -t * 5,
    scale: lifted ? 1.1 : 1,
    opacity: 1,
  };
}

const stacked = { x: 0, y: 0, z: 0, rotateZ: 0, rotateY: 0, scale: 0.9, opacity: 0 };

export function CertDeck({ items, selected, onSelect, registerCard }: CertDeckProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered !== null ? items[hovered] : null;

  return (
    <div ref={ref}>
      <div className="relative mx-auto h-[25rem] max-w-5xl [perspective:1400px]">
        {items.map((item, i) => {
          const media = certificationMedia[item.key];
          const label = `${item.award} — ${item.title}`;
          return (
            <motion.div
              key={item.key}
              initial={stacked}
              animate={inView ? pose(i, items.length, hovered) : stacked}
              transition={
                hovered === null && inView
                  ? { type: "spring", stiffness: 120, damping: 18, delay: i * 0.08 }
                  : { type: "spring", stiffness: 260, damping: 26 }
              }
              style={{ zIndex: hovered === i ? 20 : i }}
              className="absolute left-1/2 top-12 -ml-36 w-72"
            >
              <button
                type="button"
                ref={(el) => registerCard(i, el)}
                aria-label={label}
                aria-haspopup="dialog"
                data-cursor="card"
                onClick={() => onSelect(i)}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="block w-full border border-border bg-card p-1.5 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.7)] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {selected === i ? (
                  <span className="block aspect-[4/3]" />
                ) : (
                  <motion.img
                    layoutId={`cert-${item.key}`}
                    transition={{ duration: 0.6, ease: ease.outExpo }}
                    src={media.thumb}
                    alt=""
                    width={media.width}
                    height={media.height}
                    draggable={false}
                    className="aspect-[4/3] w-full object-cover"
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
      <div aria-hidden="true" className="mx-auto mt-2 min-h-[4.5rem] max-w-xl text-center">
        {shown ? (
          <>
            <p className="telemetry text-primary">{shown.award}</p>
            <p className="mt-1 font-display text-lg font-semibold text-foreground">{shown.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{shown.issuer}</p>
          </>
        ) : (
          <p className="telemetry text-n-3">SELECT A CERTIFICATE</p>
        )}
      </div>
    </div>
  );
}
