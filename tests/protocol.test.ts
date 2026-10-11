import { describe, expect, it } from "vitest";
import { emptyProtocol, protocolBlocks } from "@/lib/protocol";
import { renderPdf } from "@/lib/pdf";

describe("overtakelsesprotokoll", () => {
  it("prints blank lines for empty fields and renders to PDF", async () => {
    const blocks = protocolBlocks(emptyProtocol("2026-10-11"));
    const text = JSON.stringify(blocks);
    expect(text).toContain("Ved innflytting");
    expect(text).toContain("**Bad:**");
    expect(text).toContain("Ja / Nei");
    const bytes = await renderPdf(blocks, { title: "Overtakelsesprotokoll", size: "a4" });
    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("uses what was filled in and skips unnamed rooms", () => {
    const p = { ...emptyProtocol("2026-10-11"), kind: "ut" as const, landlord: "Kari", smokeAlarm: "ja" as const, rooms: [{ name: "Stue", notes: "Ripe i gulvet" }, { name: " ", notes: "x" }] };
    const text = JSON.stringify(protocolBlocks(p));
    expect(text).toContain("Ved utflytting");
    expect(text).toContain("**Stue:** Ripe i gulvet");
    expect(text).toContain("Røykvarsler testet og virker: Ja\"");
    expect(text).not.toContain("** :**");
  });
});
