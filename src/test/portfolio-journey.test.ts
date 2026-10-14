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
});
