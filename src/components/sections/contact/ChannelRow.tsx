import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Magnetic } from "@/components/motion/Magnetic";

import type { Channel } from "./channels";

type Props = { channel: Channel; index: number; extra?: ReactNode };

const inv =
  "transition-colors duration-300 group-hover:text-primary-foreground group-focus-visible:text-primary-foreground";

/** Full-width channel row: signal wipes across on hover/focus and the text inverts. */
export function ChannelRow({ channel, index, extra }: Props) {
  const { label, value, href, Icon, external } = channel;
  return (
    <li className="border-b border-border md:flex md:items-center">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        data-cursor="link"
        className="group relative flex min-w-0 flex-1 items-center gap-4 overflow-hidden px-1 py-5 md:gap-8 md:px-4 md:py-8"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        <span
          aria-hidden="true"
          className={`relative hidden w-8 font-mono text-xs text-n-3 sm:block ${inv}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <Magnetic className="relative">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border text-primary transition-colors duration-300 group-hover:border-primary-foreground group-hover:text-primary-foreground group-focus-visible:border-primary-foreground group-focus-visible:text-primary-foreground md:h-14 md:w-14">
            <Icon size={22} aria-hidden="true" />
          </span>
        </Magnetic>
        <span className="relative min-w-0 flex-1">
          <span
            className={`display-type block text-[length:var(--text-step-3)] [font-stretch:100%] md:[font-stretch:125%] ${inv}`}
          >
            {label}
          </span>
          <span
            className={`mt-2 block truncate font-mono text-xs text-muted-foreground bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size,color] duration-300 group-hover:bg-[length:100%_1px] group-hover:text-primary-foreground group-focus-visible:bg-[length:100%_1px] group-focus-visible:text-primary-foreground md:text-sm`}
          >
            {value}
          </span>
        </span>
        <ArrowUpRight
          size={26}
          aria-hidden="true"
          className="relative shrink-0 text-muted-foreground transition-[transform,color] duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5 group-hover:translate-x-1.5 group-hover:text-primary-foreground group-focus-visible:-translate-y-1.5 group-focus-visible:translate-x-1.5 group-focus-visible:text-primary-foreground"
        />
      </a>
      {extra ? <div className="px-1 pb-5 md:px-4 md:pb-0">{extra}</div> : null}
    </li>
  );
}
