import { ArrowUpRight, Github, Linkedin, Mail, Youtube } from "lucide-react";

import { identity } from "@/data/portfolio";
import { Magnetic } from "@/components/motion/Magnetic";
import { SectionHeader } from "@/components/motion/SectionHeader";

const display = (url: string) =>
  url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
    .replace(/^linkedin\.com\//, "");

const channels = [
  {
    label: "Email",
    value: identity.email,
    href: `mailto:${identity.email}`,
    Icon: Mail,
    external: false,
  },
  {
    label: "GitHub",
    value: display(identity.github),
    href: identity.github,
    Icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    value: display(identity.linkedin),
    href: identity.linkedin,
    Icon: Linkedin,
    external: true,
  },
  {
    label: "YouTube",
    value: display(identity.youtube),
    href: identity.youtube,
    Icon: Youtube,
    external: true,
  },
];

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
        <SectionHeader
          index="09"
          id="contact-title"
          eyebrow="CONTACT"
          title="Interested in Web Development, Robotics, AI, or Engineering Research?"
          large
        />
        <p className="max-w-2xl text-[length:var(--text-step-0)] leading-relaxed text-muted-foreground">
          I bring a background in web development and an expanding interest in intelligent
          engineering systems. I'm interested in connecting with developers, researchers, engineers,
          and collaborators working on web technologies, reinforcement learning, robotics,
          industrial AI, and related problems. Feel free to reach out to discuss a project or
          exchange ideas.
        </p>

        <h3 className="telemetry mt-16 text-primary">Contact me</h3>
        <ul className="mt-4 border-t border-border">
          {channels.map(({ label, value, href, Icon, external }) => (
            <li key={label} className="border-b border-border">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex items-center gap-5 py-5 md:gap-8 md:py-7"
              >
                <Magnetic>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={20} />
                  </span>
                </Magnetic>
                <span className="min-w-0 flex-1">
                  <span className="display-type block text-[length:var(--text-step-2)] [font-stretch:100%] md:[font-stretch:125%]">
                    {label}
                  </span>
                  <span className="mt-1 block truncate font-mono text-xs text-muted-foreground bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size,color] duration-300 group-hover:bg-[length:100%_1px] group-hover:text-primary">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  size={22}
                  className="shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
