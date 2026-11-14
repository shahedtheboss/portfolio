import { aboutThemes } from "@/data/portfolio";
import { MaskLines } from "@/components/motion/MaskLines";
import { Panel } from "@/components/motion/Panel";
import { SectionHeader } from "@/components/motion/SectionHeader";
import { Tilt } from "@/components/motion/Tilt";

const intro =
  "I'm naturally curious, enjoy solving challenging problems, and believe in learning through experimentation. I like understanding the logic behind things, testing ideas, and continuously improving through practice.";

const feeds = [
  {
    label: "My mindset —",
    body: "Analytical, hands-on, and always learning. I value creative problem-solving, strategic thinking, and sharing knowledge with others.",
  },
  {
    label: "Beyond technology —",
    body: "I'm passionate about competitive gaming, where strategy and quick decisions matter, and adventure, which gives me opportunities to explore, embrace challenges, and step outside my comfort zone.",
  },
  {
    label: "What drives me —",
    body: "The satisfaction of overcoming difficult challenges, discovering something new, and turning ideas into something meaningful.",
  },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative scroll-mt-20 border-t border-border bg-surface py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="02"
          id="about-title"
          eyebrow="ABOUT ME"
          title="How I Think & What Drives Me"
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <MaskLines
                text={intro}
                className="text-[length:var(--text-step-1)] leading-snug text-foreground"
              />
            </div>
          </div>
          <div className="space-y-4 lg:col-span-6 lg:col-start-7">
            {feeds.map((f, i) => (
              <Panel
                key={f.label}
                label={<span aria-hidden="true">{`CAM ${String(i + 1).padStart(2, "0")}`}</span>}
                meta={<span aria-hidden="true">REC</span>}
                bodyClassName="p-5"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="telemetry text-primary">{f.label}</span> {f.body}
                </p>
              </Panel>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <h3 className="display-type text-[length:var(--text-step-2)] text-foreground">
            My Passion and Goals
          </h3>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutThemes.map((theme, i) => (
              <Tilt key={theme.title} className="h-full">
                <Panel className="h-full" bodyClassName="p-5">
                  <span className="numeral block text-[3.5rem]" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {theme.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{theme.body}</p>
                </Panel>
              </Tilt>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
