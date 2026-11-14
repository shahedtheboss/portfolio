import { ArrowRight, Github, Linkedin, Youtube } from "lucide-react";

import { identity, identityCard } from "@/data/portfolio";
import { portraitAsset } from "@/lib/media";
import { Button } from "@/components/motion/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { Panel } from "@/components/motion/Panel";
import { StatusLight } from "@/components/motion/StatusLight";

const socials = [
  { href: identity.github, label: "GitHub profile", Icon: Github },
  { href: identity.linkedin, label: "LinkedIn profile", Icon: Linkedin },
  { href: identity.youtube, label: "YouTube channel", Icon: Youtube },
];

export function Hero() {
  return (
    <section id="home" className="relative isolate min-h-[100svh] scroll-mt-20 overflow-hidden">
      {/* PHASE 2: the AgentSim canvas mounts in this container (full-bleed, behind content).
          Until then it shows a static blueprint grid. */}
      <div
        data-sim-mount
        aria-hidden="true"
        className="blueprint-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
      />

      <div className="container-x relative pb-20 pt-28 md:pt-36">
        <p className="telemetry flex items-center gap-3 text-primary">
          <StatusLight tone="active" />
          {identity.eyebrow}
        </p>

        <h1 className="display-type animate-stretch-in mt-6 text-[clamp(2rem,1rem+5.2vw,6rem)] [font-stretch:100%] [overflow-wrap:anywhere] xl:[font-stretch:125%]">
          {identity.headlineA} <span className="text-primary">{identity.headlineB}</span>
        </h1>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-[length:var(--text-step-0)] leading-relaxed text-muted-foreground">
              {identity.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button href="#projects">
                  Explore My Projects <ArrowRight size={16} />
                </Button>
              </Magnetic>
              <Button href="#about" variant="ghost">
                About Me
              </Button>
              <Button href="#contact" variant="ghost">
                Connect With Me
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              {socials.map(({ href, label, Icon }) => (
                <Magnetic key={label}>
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
              ))}
            </div>

            <p className="mt-10 flex max-w-full items-start gap-3 border-l-2 border-primary py-1 pl-4 font-mono text-xs leading-relaxed text-muted-foreground">
              <StatusLight tone="active" className="mt-1.5" />
              {identity.status}
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Panel label="OPERATOR ID" meta="REC 001" className="max-w-md">
              <img
                src={portraitAsset.url}
                alt="Md. Shahdath Hussain photographed on a hilltop above a sea of clouds"
                width={450}
                height={610}
                className="h-auto max-h-[420px] w-full object-cover object-top sm:max-h-[520px]"
              />
              <div className="border-t border-border p-4">
                <p className="telemetry text-primary">IDENTITY</p>
                <dl className="mt-3 space-y-2">
                  {identityCard.map((row) => (
                    <div key={row.label} className="flex gap-3 text-xs">
                      <dt className="w-20 shrink-0 font-mono text-muted-foreground">{row.label}</dt>
                      <dd className="min-w-0 text-foreground">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}
