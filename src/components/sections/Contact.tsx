import { CopyEmailButton } from "./contact/CopyEmailButton";
import { ChannelRow } from "./contact/ChannelRow";
import { channels } from "./contact/channels";
import { KineticHeadline } from "./contact/KineticHeadline";
import { TerminalStrip } from "./contact/TerminalStrip";
import { identity } from "@/data/portfolio";

const TITLE = "Interested in Web Development, Robotics, AI, or Engineering Research?";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative scroll-mt-20 overflow-hidden border-t border-border py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="blueprint-grid absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_top,black,transparent)]"
      />
      <div className="container-x">
        {/* Mirrors SectionHeader's markup, but without its max-width so the kinetic h2 can run wide. */}
        <header className="relative mb-12 md:mb-16">
          <span aria-hidden="true" className="numeral pointer-events-none block -translate-x-1">
            09
          </span>
          <div className="relative -mt-[0.2em] md:-mt-16">
            <p className="telemetry flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              CONTACT
            </p>
            <h2
              id="contact-title"
              className="display-type mt-4 text-[clamp(2rem,0.9rem+6.4vw,7.25rem)] [overflow-wrap:anywhere] text-foreground"
            >
              <KineticHeadline text={TITLE} />
            </h2>
          </div>
        </header>
        <p className="max-w-2xl text-[length:var(--text-step-0)] leading-relaxed text-muted-foreground">
          I bring a background in web development and an expanding interest in intelligent
          engineering systems. I'm interested in connecting with developers, researchers, engineers,
          and collaborators working on web technologies, reinforcement learning, robotics,
          industrial AI, and related problems. Feel free to reach out to discuss a project or
          exchange ideas.
        </p>

        <h3 className="telemetry mt-16 text-primary">Contact me</h3>
        <ul className="mt-4 border-t border-border">
          {channels.map((channel, i) => (
            <ChannelRow
              key={channel.label}
              channel={channel}
              index={i}
              extra={channel.label === "Email" ? <CopyEmailButton email={identity.email} /> : null}
            />
          ))}
        </ul>
        <TerminalStrip />
      </div>
    </section>
  );
}
