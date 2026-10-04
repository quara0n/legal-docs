import { describe, expect, it } from "vitest";
import { completeness, formatDate, formatMoney, formatPrice, joinList, makeCtx, parseInline, plainText } from "@/lib/doc";

describe("inline tokens", () => {
  it("parses filled, empty and bold segments", () => {
    const segs = parseInline("Hi **⟦name¦Jane⟧** and ⟦city¦?city⟧.");
    expect(segs).toEqual([
      { text: "Hi ", bold: false },
      { text: "Jane", bold: true, field: "name", empty: false },
      { text: " and ", bold: false },
      { text: "city", bold: false, field: "city", empty: true },
      { text: ".", bold: false },
    ]);
  });

  it("prints blanks for missing answers", () => {
    expect(plainText("Rent: ⟦rent¦?amount⟧")).toBe("Rent: __________");
  });

  it("strips token characters from answers so they cannot break the document", () => {
    const c = makeCtx({ name: "Evil ⟦x¦y⟧ **bold**" });
    expect(parseInline(c.v("name", "name"))).toEqual([{ text: "Evil xy bold", bold: false, field: "name", empty: false }]);
  });
});

describe("formatting", () => {
  it("formats money, dates and prices", () => {
    expect(formatMoney("1850")).toBe("$1,850.00");
    expect(formatMoney("1,234.5")).toBe("$1,234.50");
    expect(formatMoney("")).toBe("");
    expect(formatDate("2026-10-04")).toBe("October 4, 2026");
    expect(formatPrice(900)).toBe("$9");
    expect(formatPrice(1250)).toBe("$12.50");
  });

  it("joins lists in plain English", () => {
    expect(joinList(["A"])).toBe("A");
    expect(joinList(["A", "B"])).toBe("A and B");
    expect(joinList(["A", "B", "C"])).toBe("A, B, and C");
  });
});

describe("completeness", () => {
  it("counts each answer slot once", () => {
    const r = completeness([
      { type: "paragraph", text: "⟦a¦x⟧ ⟦b¦?b⟧ ⟦a¦x⟧" },
      { type: "signatures", parties: [{ heading: "A", lines: [{ label: "Name", value: "⟦c¦?c⟧" }] }] },
    ]);
    expect(r).toEqual({ filled: 1, total: 3, pct: 33 });
  });
});
