import { describe, expect, it } from "vitest";

import { identity, projects } from "@/data/portfolio";

// The projects grid shows only the first five cards until "see more" is clicked, so the
// order of this array is the rule for what a visitor sees first.
describe("Projects content", () => {
  it("has more projects than the five shown by default", () => {
    expect(projects.length).toBeGreaterThan(5);
  });

  it("opens with five real repositories, each linking to its source", () => {
    for (const project of projects.slice(0, 5)) {
      expect(project.link, `${project.title} needs a repository link`).toBeTruthy();
      expect(project.link?.startsWith(`${identity.github}/`)).toBe(true);
    }
  });

  it("never links outside the owner's own GitHub account", () => {
    for (const project of projects) {
      if (project.link) {
        expect(project.link.startsWith(`${identity.github}/`)).toBe(true);
      }
    }
  });

  it("no longer lists the placeholder web-projects entry", () => {
    expect(projects.some((p) => p.title === "Selected Web Development Projects")).toBe(false);
  });
});
