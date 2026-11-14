import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";

import { SectionHeader } from "@/components/motion/SectionHeader";
import { certifications } from "@/data/portfolio";
import { useRichPointer } from "@/hooks/useFinePointer";
import { useIsClient } from "@/hooks/useIsClient";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { CertDeck } from "./certifications/CertDeck";
import { CertGrid } from "./certifications/CertGrid";
import { CertViewer } from "./certifications/CertViewer";
import { useMinWidth } from "./certifications/useMinWidth";

export function Certifications() {
  const client = useIsClient();
  const reduced = usePrefersReducedMotion();
  const rich = useRichPointer();
  const large = useMinWidth(1024);
  const deck = rich && large;
  const [selected, setSelected] = useState<number | null>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const n = certifications.length;
  const current = selected === null ? undefined : certifications[selected];

  const registerCard = useCallback((i: number, el: HTMLButtonElement | null) => {
    cards.current[i] = el;
  }, []);

  const close = useCallback(() => {
    setSelected((cur) => {
      if (cur !== null) requestAnimationFrame(() => cards.current[cur]?.focus());
      return null;
    });
  }, []);

  const step = useCallback(
    (d: number) => {
      setSelected((cur) => (cur === null ? cur : (cur + d + n) % n));
    },
    [n],
  );

  useEffect(() => {
    if (!deck) setSelected(null);
  }, [deck]);

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-title"
      className="relative scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="07"
          id="certifications-title"
          eyebrow="CERTIFICATIONS"
          title={
            <>
              Recognition, Training & <span className="text-primary">Competition</span>
            </>
          }
        />
        {deck && (
          <CertDeck
            items={certifications}
            selected={selected}
            onSelect={setSelected}
            registerCard={registerCard}
          />
        )}
        <CertGrid compact={deck} />
      </div>
      {client &&
        createPortal(
          <AnimatePresence>
            {deck && current && selected !== null && (
              <CertViewer
                key="viewer"
                item={current}
                index={selected}
                total={n}
                reduced={reduced}
                onClose={close}
                onStep={step}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
