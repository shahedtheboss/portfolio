import { Panel } from "@/components/motion/Panel";
import { useReveal } from "@/components/motion/useReveal";
import { certifications, type Certification } from "@/data/portfolio";
import { certificationMedia } from "@/lib/media";

import { AwardBadge, CertLink, CertText } from "./CertParts";

function RevealImage({ item }: { item: Certification }) {
  const media = certificationMedia[item.key];
  const { ref, hidden } = useReveal<HTMLDivElement>(0.2);
  return (
    <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-background">
      <div
        ref={ref}
        className="h-full w-full transition-[clip-path] duration-[900ms] ease-[var(--ease-out-expo)]"
        style={{ clipPath: hidden ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" }}
      >
        <img
          src={media.thumb}
          alt={`${item.award} — ${item.title}`}
          width={media.width}
          height={media.height}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </div>
      <AwardBadge award={item.award} className="absolute left-3 top-3" />
    </div>
  );
}

/**
 * Every certificate with its full text and link. Full cards with images by default;
 * a compact image-less index when the 3D deck is showing the thumbnails.
 */
export function CertGrid({ compact }: { compact: boolean }) {
  return (
    <ul
      className={
        compact ? "mt-16 grid gap-4 lg:grid-cols-2" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {certifications.map((item) => (
        <li key={item.key} className="contents">
          <Panel
            as="article"
            className="group h-full"
            bodyClassName="flex h-full flex-col"
            label={compact ? item.award : undefined}
          >
            {!compact && <RevealImage item={item} />}
            <div className="flex flex-1 flex-col p-5">
              <CertText item={item} />
              <CertLink item={item} className="mt-auto self-start pt-5" />
            </div>
          </Panel>
        </li>
      ))}
    </ul>
  );
}
