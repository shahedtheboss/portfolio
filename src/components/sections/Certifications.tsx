import { Award, BadgeCheck, FileText } from "lucide-react";

import { certifications } from "@/data/portfolio";
import { certificationMedia } from "@/lib/media";
import { DrawLink } from "@/components/motion/DrawLink";
import { Panel } from "@/components/motion/Panel";
import { SectionHeader } from "@/components/motion/SectionHeader";

export function Certifications() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-title"
      className="relative scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeader
          index="07"
          id="certifications-title"
          eyebrow="CERTIFICATIONS"
          title={
            <>
              Recognition, Training & <span className="text-primary">Competition</span>
            </>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item) => {
            const media = certificationMedia[item.key];
            return (
              <Panel
                key={item.key}
                as="article"
                className="group h-full"
                bodyClassName="flex h-full flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-background">
                  <img
                    src={media.thumb}
                    alt={`${item.award} — ${item.title}`}
                    width={media.width}
                    height={media.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                  <span className="telemetry absolute left-3 top-3 inline-flex items-center gap-1.5 border border-primary/60 bg-background/90 px-2.5 py-1 text-primary">
                    <BadgeCheck size={12} aria-hidden="true" />
                    {item.award}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-primary">{item.issuer}</p>
                  {item.period && (
                    <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                      {item.period}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  <DrawLink
                    href={media.full}
                    external
                    className="mt-auto inline-flex items-center gap-2 self-start pt-5 font-mono text-xs text-primary"
                  >
                    {media.isPdf ? <FileText size={14} /> : <Award size={14} />}
                    View certificate
                  </DrawLink>
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
