import { useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

import { projects, type projectCategories } from "@/data/portfolio";
import { scrollToTarget } from "@/hooks/useLenis";
import { Button } from "@/components/motion/Button";

import { ProjectCard } from "../ProjectCard";

type Category = (typeof projectCategories)[number];

/** One category: sticky numeral column with a scroll-progress line, card grid, View more/less. */
export function CategoryBand({ category, index }: { category: Category; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const band = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: band, offset: ["start center", "end center"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const items = projects.filter((p) => p.category === category.key);
  const projectCount = items.filter((p) => p.kind !== "industrialVisit").length;
  const visitCount = items.length - projectCount;
  const shown = expanded ? items : items.slice(0, 2);
  const remaining = items.length - shown.length;
  const remainingVisits = items
    .slice(shown.length)
    .filter((p) => p.kind === "industrialVisit").length;
  const remainingLabel =
    remainingVisits === remaining
      ? remaining === 1
        ? "industrial visit"
        : "industrial visits"
      : remaining === 1
        ? "project"
        : "projects";

  return (
    <motion.div
      ref={band}
      layout="position"
      id={`projects-${category.key}`}
      className="grid scroll-mt-24 gap-8 lg:grid-cols-12"
    >
      <div className="relative lg:col-span-4">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-px bg-border lg:block"
        >
          <motion.span
            style={{ scaleY: fill }}
            className="absolute inset-0 origin-top bg-primary shadow-[0_0_8px_var(--primary)]"
          />
        </span>
        <div className="flex items-end gap-5 lg:sticky lg:top-28 lg:block lg:pl-8">
          <span
            aria-hidden="true"
            className="numeral block shrink-0 text-[clamp(3.5rem,14vw,5rem)] lg:text-[clamp(4rem,9vw,8rem)]"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 pb-1 lg:pb-0">
            <h3 className="display-type text-[length:var(--text-step-1)] [overflow-wrap:anywhere] text-foreground lg:mt-3">
              {category.label}
            </h3>
            <div className="mt-3 space-y-1">
              <p className="telemetry text-primary">
                {projectCount} {projectCount === 1 ? "PROJECT" : "PROJECTS"}
              </p>
              {visitCount > 0 && (
                <p className="telemetry text-primary">
                  {visitCount} {visitCount === 1 ? "INDUSTRIAL VISIT" : "INDUSTRIAL VISITS"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <motion.div layout className="relative lg:col-span-8">
        <ul className="relative grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((project, i) => (
              <motion.li
                key={project.title}
                layout
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.5, delay: Math.max(0, i - 2) * 0.08 }}
              >
                <ProjectCard project={project} late={i >= 2} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {(remaining > 0 || (expanded && items.length > 2)) && (
          <motion.div layout="position" className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                if (expanded) scrollToTarget(`#projects-${category.key}`);
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <>
                  View less <ArrowUp size={16} />
                </>
              ) : (
                <>
                  View more ({remaining} more {remainingLabel}) <ArrowRight size={16} />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
