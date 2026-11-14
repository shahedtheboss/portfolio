import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type DrawLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  /** Opens in a new tab with safe rel. */
  external?: boolean;
};

/** Link whose underline draws in on hover/focus. */
export function DrawLink({ children, external, className, ...rest }: DrawLinkProps) {
  return (
    <a
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
      className={cn(
        "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size,color] duration-300 ease-[var(--ease-out-expo)] hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]",
        className,
      )}
    >
      {children}
    </a>
  );
}
