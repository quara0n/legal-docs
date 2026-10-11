import { track } from "./analytics";
import type { Block } from "./doc";

/** Renders blocks to an A4 PDF in the browser and saves it. Used by the free tools. */
export async function downloadPdf(blocks: Block[], title: string, filename: string) {
  const { renderPdf } = await import("./pdf");
  const bytes = await renderPdf(blocks, {
    title,
    note: "Laget gratis på rettframavtaler.no",
    pageLabel: (i, n) => `Side ${i} av ${n}`,
    initials: "",
    size: "a4",
  });
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  track("Free tool PDF", { tool: filename.replace(/\.pdf$/, "") });
}
