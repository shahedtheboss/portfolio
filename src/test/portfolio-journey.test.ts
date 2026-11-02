import { describe, expect, it } from "vitest";

import { journey } from "@/data/portfolio";

// The Learning Journey is a chronological timeline: the step numbers a visitor reads
// must run 01, 02, 03 ... in order with no gaps or repeats.
describe("Learning Journey timeline", () => {
  it("numbers every step sequentially from 01", () => {
    expect(journey.map((item) => item.step)).toEqual(
      journey.map((_, i) => String(i + 1).padStart(2, "0")),
    );
  });

  it("opens with C programming in 2017, then web development, then Python & ML", () => {
    expect(journey.slice(0, 3).map((item) => item.title)).toEqual([
      "Start of Programming",
      "Web Development",
      "Python & ML",
    ]);
  });

  it("marks only the future step as ahead", () => {
    expect(
      journey.filter((item) => item.status === "ahead").map((item) => item.title),
    ).toEqual(["Advanced RL & Control"]);
  });

  it("marks Paper Reproduction and MLOps & Production Engineering as in progress", () => {
    expect(
      journey.filter((item) => item.status === "in-progress").map((item) => item.title),
    ).toEqual(["Paper Reproduction", "MLOps & Production Engineering"]);
  });

  it("completes Building & Implementing RL Projects", () => {
    expect(
      journey.find((item) => item.title === "Building & Implementing RL Projects")?.status,
    ).toBe("completed");
  });
});
