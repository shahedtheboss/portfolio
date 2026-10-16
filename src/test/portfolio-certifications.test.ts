import { describe, expect, it } from "vitest";

import { certifications } from "@/data/portfolio";

describe("certifications", () => {
  it("opens with the 1st Prize CUET ML Contest 2.0 award", () => {
    expect(certifications[0]).toMatchObject({
      award: "1st Prize",
      title: "CUET ML Contest 2.0 — Beginner Track",
      issuer: "IEEE Computer Society CUET Student Branch Chapter",
    });
  });

  it("lists all five certificates with issuer and description", () => {
    expect(certifications).toHaveLength(5);
    for (const item of certifications) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.issuer.length).toBeGreaterThan(0);
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("keeps one unique media key per certificate", () => {
    const keys = certifications.map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
