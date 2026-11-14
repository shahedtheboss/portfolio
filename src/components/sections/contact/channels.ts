import { Github, Linkedin, Mail, Youtube, type LucideIcon } from "lucide-react";

import { identity } from "@/data/portfolio";

export const display = (url: string) =>
  url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
    .replace(/^linkedin\.com\//, "");

export type Channel = {
  label: string;
  value: string;
  href: string;
  Icon: LucideIcon;
  external: boolean;
};

export const channels: Channel[] = [
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
