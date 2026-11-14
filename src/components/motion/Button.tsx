import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Common = { variant?: "primary" | "ghost"; children: ReactNode; className?: string };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/** HUD button: primary (signal fill) or ghost (hairline), press state and hover sheen. */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", children, className, ...rest } = props;
  const cls = cn(
    "group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden border px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-[transform,border-color,color,background-color] duration-200 ease-[var(--ease-snap)] active:scale-[0.97]",
    variant === "primary"
      ? "border-primary bg-primary text-primary-foreground"
      : "border-n-2 bg-transparent text-foreground hover:border-primary hover:text-primary",
    className,
  );
  const sheen = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/30 opacity-0 group-hover/btn:opacity-100 group-hover/btn:[animation:sheen_700ms_var(--ease-out-expo)]"
    />
  );
  if ("href" in props && props.href !== undefined) {
    const { href, ...a } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} {...a} className={cls}>
        {children}
        {sheen}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>
      {children}
      {sheen}
    </button>
  );
}
