import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowRight, Github, Linkedin, Youtube } from "lucide-react";

import { identity, identityCard } from "@/data/portfolio";
import { portraitAsset } from "@/lib/media";
import { Button } from "@/components/motion/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { Panel } from "@/components/motion/Panel";
import { StatusLight } from "@/components/motion/StatusLight";
import { SimHud } from "@/components/canvas/agent-sim/SimHud";
import { RobotNet } from "@/components/canvas/agent-sim/RobotNet";
import type { AgentSimProps } from "@/components/canvas/agent-sim/AgentSim";
import { useBootDone } from "@/components/shell/BootLoader";
import { useFinePointer, useRichPointer } from "@/hooks/useFinePointer";

const socials = [
  { href: identity.github, label: "GitHub profile", Icon: Github },
  { href: identity.linkedin, label: "LinkedIn profile", Icon: Linkedin },
  { href: identity.youtube, label: "YouTube channel", Icon: Youtube },
];

/** Delay (ms, after boot) as a CSS custom property for `.hero-rise`. */
const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

/** Words in clip masks so each can rise (and widen) on its own. Spaces stay between wrappers. */
function Words({ text, from }: { text: string; from: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="hero-mask">
            <span className="hero-word" style={{ "--i": from + i } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const bootDone = useBootDone();
  const fine = useFinePointer();
  const rich = useRichPointer();
  const [Sim, setSim] = useState<ComponentType<AgentSimProps> | null>(null);

  // Out of the SSR path and the main chunk.
  useEffect(() => {
    let alive = true;
    void import("@/components/canvas/agent-sim/AgentSim").then((m) => {
      if (alive) setSim(() => m.AgentSim);
    });
    return () => {
      alive = false;
    };
  }, []);

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const el = tiltRef.current;
    if (!rich || !el) return;
    el.style.setProperty("--px", String((e.clientX / window.innerWidth - 0.5) * 2));
    el.style.setProperty("--py", String((e.clientY / window.innerHeight - 0.5) * 2));
  };
  const onLeave = () => {
    tiltRef.current?.style.removeProperty("--px");
    tiltRef.current?.style.removeProperty("--py");
  };

  const nA = identity.headlineA.split(" ").length;

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative isolate min-h-[100svh] scroll-mt-20 overflow-hidden"
    >
      <div data-sim-mount aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="blueprint-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
        <div className="sim-fade absolute inset-0">
          {Sim ? <Sim sectionRef={sectionRef} hudRef={hudRef} active={bootDone} /> : null}
        </div>
      </div>

      <SimHud hudRef={hudRef} interactive={fine} />

      <div className="container-x relative pb-24 pt-28 sm:pb-44 md:pt-36">
        <p className="telemetry hero-rise flex items-center gap-3 text-primary" style={d(0)}>
          <StatusLight tone="active" />
          {identity.eyebrow}
        </p>

        <h1 className="display-type mt-6 text-[clamp(2rem,1rem+5.2vw,6rem)] [font-stretch:100%] [overflow-wrap:anywhere] xl:[font-stretch:125%]">
          <Words text={identity.headlineA} from={0} />{" "}
          <span className="text-primary">
            <Words text={identity.headlineB} from={nA} />
          </span>
        </h1>

        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-12 xl:mt-12">
          <div className="md:col-span-12 lg:col-span-7 lg:row-start-1 xl:col-span-5 min-[1360px]:col-span-4">
            <p
              className="hero-rise max-w-2xl text-[length:var(--text-step-0)] leading-relaxed text-muted-foreground"
              style={d(550)}
            >
              {identity.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="hero-rise inline-flex" style={d(700)}>
                <Magnetic>
                  <Button href="#projects">
                    Explore My Projects <ArrowRight size={16} />
                  </Button>
                </Magnetic>
              </span>
              <span className="hero-rise inline-flex" style={d(780)}>
                <Button href="#about" variant="ghost">
                  About Me
                </Button>
              </span>
              <span className="hero-rise inline-flex" style={d(860)}>
                <Button href="#contact" variant="ghost">
                  Connect With Me
                </Button>
              </span>
            </div>

            <div className="mt-8 flex items-center gap-4">
              {socials.map(({ href, label, Icon }, i) => (
                <span key={label} className="hero-rise inline-flex" style={d(950 + i * 80)}>
                  <Magnetic>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon size={18} />
                    </a>
                  </Magnetic>
                </span>
              ))}
            </div>

            <p
              className="hero-rise mt-10 flex max-w-full items-start gap-3 border-l-2 border-primary py-1 pl-4 font-mono text-xs leading-relaxed text-muted-foreground"
              style={d(1200)}
            >
              <StatusLight tone="active" className="mt-1.5" />
              {identity.status}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none mx-auto aspect-[510/285] w-full max-w-sm md:col-span-6 md:mx-0 md:max-w-none lg:col-span-7 lg:col-start-1 lg:row-start-2 xl:col-span-4 xl:col-start-6 xl:row-start-1 xl:self-center min-[1360px]:col-span-5 min-[1360px]:col-start-5 min-[1360px]:ml-0"
          >
            <RobotNet />
          </div>

          <div
            className="md:col-span-6 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 xl:col-span-3 xl:col-start-10 xl:row-span-1"
            data-sim-ignore
          >
            <div ref={tiltRef} className="portrait-tilt max-w-md">
              <Panel
                label="OPERATOR ID"
                meta={
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-destructive"
                    />
                    REC 001
                  </span>
                }
              >
                <div className="relative aspect-[9/10] overflow-hidden">
                  <div className="portrait-shift h-full w-full">
                    <img
                      src={portraitAsset.url}
                      alt="Md. Shahdath Hussain photographed on a hilltop above a sea of clouds"
                      width={450}
                      height={610}
                      className="portrait-img h-full w-full object-cover object-top"
                    />
                  </div>
                  <span aria-hidden="true" className="portrait-scan" />
                </div>
                <div className="border-t border-border p-4">
                  <p className="telemetry text-primary">IDENTITY</p>
                  <dl className="mt-3 space-y-2">
                    {identityCard.map((row, i) => (
                      <div
                        key={row.label}
                        className="flex gap-3 text-xs"
                        style={{ "--r": i } as CSSProperties}
                      >
                        <dt
                          className="type-wipe w-28 shrink-0 whitespace-nowrap font-mono text-muted-foreground"
                          style={{ "--wd": "260ms", "--steps": row.label.length } as CSSProperties}
                        >
                          {row.label}
                        </dt>
                        <dd
                          className="type-wipe min-w-0 text-foreground"
                          style={
                            {
                              "--o": 260,
                              "--wd": "650ms",
                              "--steps": Math.min(28, row.value.length),
                            } as CSSProperties
                          }
                        >
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hero-cue pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-2"
      >
        <span className="telemetry text-[9px] text-muted-foreground">SCROLL</span>
        <span className="relative block h-8 w-px overflow-hidden bg-n-1">
          <span className="cue-dot absolute inset-x-0 top-0 block h-2.5 bg-primary" />
        </span>
      </div>
    </section>
  );
}
