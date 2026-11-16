import { useRef } from "react";
import { useScroll } from "motion/react";

import { MaskLines } from "@/components/motion/MaskLines";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { useFinePointer } from "@/hooks/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { CameraMonitor } from "./about/CameraMonitor";
import { FeedStack } from "./about/FeedStack";
import { ThemeCards } from "./about/ThemeCards";
import { intro } from "./about/feeds";
import { useMediaQuery } from "./about/useMediaQuery";

function Lead() {
  return (
    <>
      <SectionHeader
        index="02"
        id="about-title"
        eyebrow="ABOUT ME"
        title="How I Think & What Drives Me"
        className="mb-8 md:mb-10"
      />
      <MaskLines
        text={intro}
        className="text-[length:var(--text-step-1)] leading-snug text-foreground"
      />
    </>
  );
}

/** Desktop: a tall track with a sticky stage; scroll progress drives the camera feeds. */
function PinnedScene() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  return (
    <div ref={track} className="relative h-[280vh]">
      <div className="sticky top-16 grid h-[calc(100svh-4rem)] grid-cols-12 items-center gap-12">
        <div className="col-span-5">
          <Lead />
        </div>
        <div className="col-span-7">
          <CameraMonitor progress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
}

function StackedScene() {
  return (
    <div className="mobile-about-scene grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Lead />
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <FeedStack />
      </div>
    </div>
  );
}

export function About() {
  const wide = useMediaQuery("(min-width: 1024px) and (min-height: 680px)");
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const pinned = wide && fine && !reduced;
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative scroll-mt-20 border-t border-border bg-surface py-24 md:py-32"
    >
      <div className="container-x">
        {pinned ? <PinnedScene /> : <StackedScene />}
        <ThemeCards />
      </div>
    </section>
  );
}
