import { projectCategories, projects, type Project } from "@/data/portfolio";

export type CategoryStats = {
  key: Project["category"];
  label: string;
  projects: number;
  visits: number;
};

/** Per-category counts, separating source-code projects from industrial visits. */
export function getCategoryStats(): CategoryStats[] {
  return projectCategories.map((c) => {
    const items = projects.filter((p) => p.category === c.key);
    const visits = items.filter((p) => p.kind === "industrialVisit").length;
    return { key: c.key, label: c.label, projects: items.length - visits, visits };
  });
}

export function pluralCount(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
