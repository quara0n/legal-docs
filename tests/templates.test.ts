import { describe, expect, it } from "vitest";
import { getTemplates, LOCALES } from "@/content";
import { completeness, missingRequired, parseInline, withDefaults, type Answers, type Block, type Field, type Template } from "@/lib/doc";
import { renderPdf } from "@/lib/pdf";

const sampleFor = (f: Field, regions: string[]): string => {
  switch (f.type) {
    case "date":
      return "2026-01-15";
    case "money":
      return "1500";
    case "number":
      return "12";
    case "email":
      return "jane@example.com";
    case "textarea":
      return f.placeholder ?? "First line\nSecond line";
    case "region":
      return regions[0];
    case "choice":
    case "select":
      return f.options![0].value;
    case "multi":
      return f.options!.map((o) => o.value).join(",");
    default:
      return "Sample " + f.id;
  }
};

const allFields = (t: Template) => t.steps.flatMap((s) => s.fields);

function texts(blocks: Block[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if ("text" in b) out.push(b.text);
    if (b.type === "list") out.push(...b.items);
    if (b.type === "clause") out.push(...b.paragraphs, ...(b.list ?? []));
    if (b.type === "signatures") b.parties.forEach((p) => p.lines.forEach((l) => l.value && out.push(l.value)));
    if (b.type === "notary" && b.state) out.push(b.state);
  }
  return out;
}

// Every combination of one choice changed from its first option.
function variants(t: Template, base: Answers): Answers[] {
  const out = [base];
  for (const f of allFields(t))
    if (f.type === "choice" || f.type === "select") for (const o of f.options!.slice(1)) out.push({ ...base, [f.id]: o.value });
  return out;
}

// Every locale, including the ones this market does not publish.
const templates = Object.values(LOCALES).flatMap((l) => l.templates);

describe("template registry", () => {
  it("has unique slugs", () => {
    const slugs = templates.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe.each(templates.map((t) => [t.slug, t] as const))("%s", (_slug, t) => {
  const regions = LOCALES[t.locale].regions;
  const full: Answers = Object.fromEntries(allFields(t).map((f) => [f.id, sampleFor(f, regions)]));

  it("has unique step and field ids, and labels for every step", () => {
    const steps = t.steps.map((s) => s.id);
    expect(new Set(steps).size).toBe(steps.length);
    const fields = allFields(t).map((f) => f.id);
    expect(new Set(fields).size).toBe(fields.length);
    for (const s of t.steps) expect(s.label.length).toBeGreaterThan(0);
  });

  it("has complete SEO content", () => {
    expect(t.seo.title.length).toBeLessThanOrEqual(75);
    expect(t.seo.description.length).toBeLessThanOrEqual(170);
    expect(t.seo.faq.length).toBeGreaterThanOrEqual(3);
    expect(t.price).toBeGreaterThan(0);
  });

  it("renders with no answers", () => {
    expect(t.render(withDefaults(t, {})).length).toBeGreaterThan(3);
  });

  it("only references fields that exist", () => {
    const ids = new Set(allFields(t).map((f) => f.id));
    for (const a of variants(t, full))
      for (const text of texts(t.render(a)))
        for (const seg of parseInline(text)) if (seg.field) expect(ids, `unknown field ${seg.field}`).toContain(seg.field);
  });

  it("has no blanks left once every question is answered", () => {
    for (const a of variants(t, full)) {
      expect(missingRequired(t, a)).toEqual([]);
      const c = completeness(t.render(a));
      expect(c.filled, JSON.stringify(a)).toBe(c.total);
    }
  });

  it("produces a valid PDF", async () => {
    const bytes = await renderPdf(t.render(full), { title: t.name });
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(5000);
  });
});

describe("state warnings", () => {
  const poa = getTemplates("en-US").find((t) => t.slug === "general-power-of-attorney")!;

  it("blocks the power of attorney in New York, which requires its own statutory form", () => {
    expect(poa.warnings!({ state: "New York" }).some((w) => w.level === "block")).toBe(true);
    expect(poa.warnings!({ state: "Ohio" }).some((w) => w.level === "block")).toBe(false);
  });

  it("never makes a Florida power of attorney springing", () => {
    const text = JSON.stringify(poa.render(withDefaults(poa, { state: "Florida", durable: "yes", effective: "incapacity" })));
    expect(text).toContain("effective immediately upon signing");
  });

  it("adds the lead-paint disclosure for older rentals", () => {
    const lease = getTemplates("en-US").find((t) => t.slug === "residential-lease-agreement")!;
    expect(JSON.stringify(lease.render(withDefaults(lease, { builtBefore1978: "yes" })))).toContain("Lead-Based Paint Disclosure");
    expect(JSON.stringify(lease.render(withDefaults(lease, { builtBefore1978: "no" })))).not.toContain("Lead-Based Paint Disclosure");
  });
});

describe("Norwegian rules", () => {
  const nb = (slug: string) => getTemplates("nb-NO").find((t) => t.slug === slug)!;
  const blocks = (t: Template, a: Answers) => (t.warnings?.(withDefaults(t, a)) ?? []).some((w) => w.level === "block");

  it("is the market this build sells to by default", () => {
    expect(getTemplates().map((t) => t.locale)).toEqual(getTemplates("nb-NO").map(() => "nb-NO"));
  });

  it("caps the deposit at six months' rent (husleieloven § 3-5)", () => {
    expect(blocks(nb("husleiekontrakt"), { rent: "10000", security: "depositum", deposit: "60000" })).toBe(false);
    expect(blocks(nb("husleiekontrakt"), { rent: "10000", security: "depositum", deposit: "60001" })).toBe(true);
    expect(blocks(nb("fremleiekontrakt"), { rent: "5000", deposit: "40 000" })).toBe(true);
  });

  it("refuses to act as a fremtidsfullmakt", () => {
    expect(blocks(nb("fullmakt"), { purpose: "future" })).toBe(true);
    expect(blocks(nb("fullmakt"), { purpose: "specific" })).toBe(false);
  });

  it("refuses business-to-consumer sales, where forbrukerkjøpsloven applies", () => {
    expect(blocks(nb("kjopekontrakt"), { sellerPrivate: "no", buyerConsumer: "yes" })).toBe(true);
    expect(blocks(nb("kjopekontrakt"), { sellerPrivate: "yes" })).toBe(false);
  });

  it("formats Norwegian money and dates in the document", () => {
    const text = JSON.stringify(nb("husleiekontrakt").render(withDefaults(nb("husleiekontrakt"), { rent: "12000", start: "2026-11-01" })));
    expect(text).toContain("kr 12 000,-");
    expect(text).toContain("1. november 2026");
  });
});
