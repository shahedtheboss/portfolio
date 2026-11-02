import { describe, expect, it } from "vitest";

import { identity, projectCategories, projects } from "@/data/portfolio";

describe("Projects content", () => {
  it("has the six project sections in the requested order", () => {
    expect(projectCategories.map((c) => c.label)).toEqual([
      "Robotics and Reinforcement Learning",
      "MLOps and GenAI",
      "Machine Learning",
      "Embedded Systems and Electronics",
      "Web Development",
      "Industrial Automation",
    ]);
  });

  it("puts the DQN research first in robotics, followed by FrozenLake DQN", () => {
    const robotics = projects.filter((p) => p.category === "robotics");
    expect(robotics.map((p) => p.title)).toEqual([
      "DQN-Based Robot Navigation & Obstacle Avoidance Research",
      "Deep Q-Learning on FrozenLake",
    ]);
    expect(robotics[0]?.status).toBe("Completed · Ongoing Research");
  });

  it("lists the self-healing ML platform as planned under MLOps", () => {
    const mlops = projects.filter((p) => p.category === "mlops");
    expect(mlops).toHaveLength(1);
    expect(mlops[0]?.status).toBe("Planned");
  });

  it("files bottle inspection under machine learning", () => {
    const bottle = projects.find((p) => p.title.startsWith("AI-Assisted Industrial Bottle"));
    expect(bottle?.category).toBe("ml");
  });

  it("links the DQN robot navigation research to its own repository", () => {
    const research = projects.find((p) => p.title.endsWith("Obstacle Avoidance Research"));
    expect(research?.link).toBe("https://github.com/shahedtheboss/turtle-bot-research");
  });

  it("never links outside the owner's own GitHub account", () => {
    for (const project of projects) {
      if (project.link && project.kind !== "industrialVisit") {
        expect(project.link.startsWith(`${identity.github}/`)).toBe(true);
      }
    }
  });

  it("keeps one automation project and two industrial visits", () => {
    const automation = projects.filter((p) => p.category === "automation");
    expect(automation.filter((p) => p.kind !== "industrialVisit")).toHaveLength(1);
    expect(automation.filter((p) => p.kind === "industrialVisit")).toHaveLength(2);
  });

  it("pairs each visit with its post and photo collection", () => {
    const visits = projects.filter((p) => p.kind === "industrialVisit");
    expect(visits.map((p) => [p.title, p.link, p.image])).toEqual([
      ["Chittagong Power Station — Industrial Visit", "https://lnkd.in/p/gtieb4-y", "powerStationVisit"],
      ["Transcom Beverages — Industrial Visit", "https://lnkd.in/p/gi-ctSwu", "transcomVisit"],
    ]);
  });
});
