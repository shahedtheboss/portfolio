import { Brain, Cpu, Eye, Factory } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Variant } from "@/components/canvas/research/types";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { researchInterests } from "@/data/portfolio";
import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { ResearchRow } from "./research/ResearchRow";

const researchIcons = [Brain, Cpu, Eye, Factory];
const variants: Variant[] = ["agent", "control", "vision", "plc"];
const INTENT_MS = 80;

export function Research() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const intent = useCallback(
    (i: number) => {
      cancel();
      timer.current = setTimeout(() => setActive(i), INTENT_MS);
    },
    [cancel],
  );
  const activate = useCallback(
    (i: number) => {
      cancel();
      setActive(i);
    },
    [cancel],
  );
  useEffect(() => cancel, [cancel]);

  return (
    <section
      id="research"
      aria-labelledby="research-title"
      className="relative scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="05"
          id="research-title"
          eyebrow="RESEARCH INTERESTS"
          title={
            <>
              Where Engineering <span className="text-primary">Meets Intelligence</span>
            </>
          }
        />
        <div className="border-t border-border">
          {researchInterests.map((interest, i) => (
            <ResearchRow
              key={interest.key}
              interest={interest}
              Icon={researchIcons[i % researchIcons.length] ?? Brain}
              variant={variants[i % variants.length] ?? "agent"}
              active={active === i}
              reduced={reduced}
              fine={fine}
              onActivate={() => activate(i)}
              onIntent={() => intent(i)}
              onIntentCancel={cancel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
