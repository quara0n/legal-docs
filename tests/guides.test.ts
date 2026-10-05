import { describe, expect, it } from "vitest";
import { LOCALES } from "@/content";
import { NB_GUIDES } from "@/content/guides";

const templateSlugs = new Set(LOCALES["nb-NO"].templates.map((t) => t.slug));
const guideSlugs = new Set(NB_GUIDES.map((g) => g.slug));

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("guides", () => {
  it("have unique slugs", () => {
    expect(guideSlugs.size).toBe(NB_GUIDES.length);
  });

  it("have unique titles", () => {
    expect(new Set(NB_GUIDES.map((g) => g.title)).size).toBe(NB_GUIDES.length);
  });

  for (const g of NB_GUIDES) {
    describe(g.slug, () => {
      it("has a title of at most 65 characters that starts with the keyword", () => {
        expect(g.title.length).toBeLessThanOrEqual(65);
        expect(g.title.toLowerCase().startsWith(g.keyword.toLowerCase())).toBe(true);
      });

      it("has a meta description of at most 160 characters", () => {
        expect(g.description.length).toBeGreaterThan(50);
        expect(g.description.length).toBeLessThanOrEqual(160);
      });

      it("links to an existing template", () => {
        expect(templateSlugs.has(g.template)).toBe(true);
      });

      it("links to two other existing guides", () => {
        expect(g.related).toHaveLength(2);
        for (const r of g.related) {
          expect(r).not.toBe(g.slug);
          expect(guideSlugs.has(r)).toBe(true);
        }
      });

      it("has 4 to 6 FAQ entries and real sections", () => {
        expect(g.faq.length).toBeGreaterThanOrEqual(4);
        expect(g.faq.length).toBeLessThanOrEqual(6);
        expect(g.sections.length).toBeGreaterThanOrEqual(4);
      });

      it("avoids claims we cannot make", () => {
        const text = JSON.stringify(g).toLowerCase();
        for (const banned of ["advokatgodkjent", "garantert gyldig", "kvalitetssikret av advokat"]) {
          expect(text).not.toContain(banned);
        }
      });

      it("has roughly 700 to 1100 words of body text", () => {
        const body = [g.lead, ...g.sections.flatMap((s) => [s.h2, ...s.body.map((b) => (typeof b === "string" ? b : b.list.join(" ")))]), ...g.faq.flatMap((f) => [f.q, f.a])].join(" ");
        const n = words(body);
        expect(n).toBeGreaterThanOrEqual(650);
        expect(n).toBeLessThanOrEqual(1250);
      });
    });
  }
});
