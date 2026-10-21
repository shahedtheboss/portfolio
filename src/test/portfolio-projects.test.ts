import { describe, expect, it } from "vitest";

import { identity, projects } from "@/data/portfolio";

// The projects grid shows only the first five cards until "see more" is clicked, so the
// order of this array is the rule for what a visitor sees first and last.
describe("Projects content", () => {
  it("has more projects than the five shown by default", () => {
    expect(projects.length).toBeGreaterThan(5);
  });

  it("opens with bottle inspection, then DQN robot navigation research", () => {
    expect(projects.slice(0, 2).map((p) => p.title)).toEqual([
      "AI-Assisted Industrial Bottle Inspection & Rejection",
      "DQN-Based Robot Navigation & Obstacle Avoidance Research",
    ]);
  });

  it("links the DQN robot navigation research to its own repository", () => {
    const research = projects.find((p) => p.title.endsWith("Obstacle Avoidance Research"));
    expect(research?.link).toBe("https://github.com/shahedtheboss/turtle-bot-research");
  });

  it("ends with the covid tracker and the whatsapp clone", () => {
    expect(projects.slice(-2).map((p) => p.title)).toEqual(["Covid Tracker", "WhatsApp Clone"]);
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
