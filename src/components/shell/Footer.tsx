import { useEffect, useState } from "react";
import { Github, Linkedin, Youtube } from "lucide-react";

import { identity } from "@/data/portfolio";
import { useIsClient } from "@/hooks/useIsClient";
import { navItems } from "@/lib/media";

function LiveClock() {
  const client = useIsClient();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    if (!client) return;
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [client]);
  return (
    <span className="tabular-nums">
      LOCAL {now ? now.toLocaleTimeString([], { hour12: false }) : "--:--:--"}
    </span>
  );
}

const socials = [
  { href: identity.github, label: "GitHub profile", Icon: Github },
  { href: identity.linkedin, label: "LinkedIn profile", Icon: Linkedin },
  { href: identity.youtube, label: "YouTube channel", Icon: Youtube },
];

/** System status strip + footer content. */
export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-border">
      <div
        aria-hidden="true"
        className="telemetry border-b border-border px-[var(--gutter)] py-2 text-muted-foreground"
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> ALL SYSTEMS NOMINAL
          </span>
          <LiveClock />
        </div>
      </div>
      <span
        aria-hidden="true"
        className="numeral pointer-events-none absolute inset-x-0 bottom-0 select-none whitespace-nowrap text-center opacity-40"
        style={{ fontSize: "clamp(1.5rem, 5.4vw, 5.5rem)" }}
      >
        {identity.name}
      </span>
      <div className="container-x relative flex flex-col items-center gap-6 pb-24 pt-12 sm:pb-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-9 items-center justify-center border border-primary font-mono text-[10px] text-primary">
            {identity.monogram}
          </span>
          <span className="display-type text-sm [font-stretch:110%]">{identity.name}</span>
        </div>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          Built with curiosity, software, engineering, and a passion for intelligent systems.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} {identity.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
