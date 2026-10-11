import { describe, expect, it } from "vitest";
import { earliestStart, KPI_SNAPSHOT, latestMonth, monthLabel, noticeBlocks, parseSsb, regulate } from "@/lib/kpi";
import { renderPdf } from "@/lib/pdf";

describe("KPI snapshot", () => {
  it("has every month from January 2015 without gaps", () => {
    const keys = Object.keys(KPI_SNAPSHOT).sort();
    expect(keys[0]).toBe("2015-01");
    for (let i = 1; i < keys.length; i++) {
      const [y, m] = keys[i - 1].split("-").map(Number);
      const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
      expect(keys[i]).toBe(next);
    }
  });

  it("averages about 100 in 2025, the base year", () => {
    const v = Object.entries(KPI_SNAPSHOT).filter(([k]) => k.startsWith("2025-")).map(([, v]) => v);
    expect(v).toHaveLength(12);
    const avg = v.reduce((a, b) => a + b, 0) / 12;
    expect(avg).toBeGreaterThan(99.5);
    expect(avg).toBeLessThan(100.5);
  });
});

describe("parseSsb", () => {
  it("reads json-stat2", () => {
    const codes = [...Array.from({ length: 12 }, (_, i) => `2025M${String(i + 1).padStart(2, "0")}`), "2026M01", "2026M02"];
    const json = {
      dimension: { Tid: { category: { index: Object.fromEntries(codes.map((c, i) => [c, i])) } } },
      value: codes.map((_, i) => 100 + i),
    };
    const s = parseSsb(json)!;
    expect(s["2025-01"]).toBe(100);
    expect(s["2026-02"]).toBe(113);
  });

  it("returns null for anything else", () => {
    expect(parseSsb({})).toBeNull();
    expect(parseSsb(null)).toBeNull();
  });
});

describe("regulate", () => {
  it("scales the rent by the index change and rounds to kroner", () => {
    const s = { "2025-09": 100.6, "2026-09": 104 };
    const r = regulate(s, 12000, "2025-09")!;
    expect(r.to).toBe("2026-09");
    expect(r.newRent).toBe(Math.round((12000 * 104) / 100.6));
    expect(r.pct).toBe(3.4);
  });

  it("rejects missing months and empty rent", () => {
    expect(regulate(KPI_SNAPSHOT, 12000, "1999-01")).toBeNull();
    expect(regulate(KPI_SNAPSHOT, 0, "2025-01")).toBeNull();
    expect(regulate(KPI_SNAPSHOT, NaN, "2025-01")).toBeNull();
  });
});

describe("earliestStart", () => {
  it("is one month after the notice, on the first of a month", () => {
    expect(earliestStart("2026-10-11", "2024-01")).toBe("2026-12-01");
    expect(earliestStart("2026-10-01", "2024-01")).toBe("2026-11-01");
  });

  it("waits a year after the rent was last set", () => {
    expect(earliestStart("2026-10-11", "2026-03")).toBe("2027-03-01");
  });

  it("handles month ends", () => {
    expect(earliestStart("2026-01-31", "2020-01")).toBe("2026-03-01");
  });
});

describe("notice letter", () => {
  it("renders to a PDF", async () => {
    const r = regulate(KPI_SNAPSHOT, 12000, "2025-09")!;
    const blocks = noticeBlocks(r, { landlord: "Kari Nordmann", tenant: "", address: "Storgata 1", noticeDate: "2026-10-11", startDate: "2026-12-01" });
    const text = JSON.stringify(blocks);
    expect(text).toContain("§ 4-2");
    expect(text).toContain(monthLabel(latestMonth(KPI_SNAPSHOT)));
    const bytes = await renderPdf(blocks, { title: "Varsel", size: "a4" });
    expect(bytes.length).toBeGreaterThan(1000);
  });
});
