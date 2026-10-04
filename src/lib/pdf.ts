import { PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { isSignatureLine, parseInline, type Block, type SigParty } from "./doc";

// Renders template blocks to a clean, print-ready PDF (US Letter or A4).

const SIZES = { letter: [612, 792], a4: [595.28, 841.89] } as const;
const MARGIN_X = 72;
const MARGIN_TOP = 72;
const MARGIN_BOTTOM = 72;
const BODY = 11;
const LEADING = 15.5;
const INK = rgb(0.08, 0.09, 0.12);
const MUTED = rgb(0.42, 0.44, 0.48);
const BLANK = "______________";

interface Piece {
  text: string;
  bold: boolean;
}

export async function renderPdf(
  blocks: Block[],
  meta: {
    title: string;
    author?: string;
    note?: string;
    pageLabel?: (i: number, n: number) => string;
    initials?: string;
    size?: keyof typeof SIZES;
  },
) {
  const [PAGE_W, PAGE_H] = SIZES[meta.size ?? "letter"];
  const CONTENT_W = PAGE_W - MARGIN_X * 2;
  const doc = await PDFDocument.create();
  doc.setTitle(meta.title);
  doc.setCreator(meta.author ?? "");
  doc.setProducer("");
  const regular = await doc.embedFont(StandardFonts.TimesRoman);
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const charset = new Set(regular.getCharacterSet());

  const sanitize = (s: string) =>
    s
      .replace(/[  ]/g, " ")
      .replace(/[‐‑]/g, "-")
      .split("")
      .filter((ch) => ch === "\n" || charset.has(ch.codePointAt(0)!))
      .join("");

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN_TOP;

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN_TOP;
  };
  const ensure = (h: number) => {
    if (y - h < MARGIN_BOTTOM) newPage();
  };
  const font = (b: boolean) => (b ? bold : regular);

  const toPieces = (text: string, forceBold = false): Piece[] =>
    parseInline(text).map((s) => ({ text: sanitize(s.empty ? BLANK : s.text), bold: forceBold || s.bold }));

  // Wrap styled pieces into lines that fit `width`.
  const wrap = (pieces: Piece[], width: number, size: number): Piece[][] => {
    const lines: Piece[][] = [];
    let line: Piece[] = [];
    let w = 0;
    const flush = () => {
      while (line.length && /^\s+$/.test(line[line.length - 1].text)) line.pop();
      lines.push(line);
      line = [];
      w = 0;
    };
    for (const p of pieces) {
      for (const part of p.text.split(/(\n|\s+)/)) {
        if (!part) continue;
        if (part === "\n") {
          flush();
          continue;
        }
        const isSpace = /^\s+$/.test(part);
        if (isSpace && line.length === 0) continue;
        const word = isSpace ? " " : part;
        let pw = font(p.bold).widthOfTextAtSize(word, size);
        if (!isSpace && w + pw > width && line.length) flush();
        if (!isSpace && pw > width) {
          // Very long unbroken text (e.g. a URL): split by character.
          let chunk = "";
          for (const ch of word) {
            const cw = font(p.bold).widthOfTextAtSize(chunk + ch, size);
            if (cw > width - w && chunk) {
              line.push({ text: chunk, bold: p.bold });
              flush();
              chunk = "";
            }
            chunk += ch;
          }
          pw = font(p.bold).widthOfTextAtSize(chunk, size);
          line.push({ text: chunk, bold: p.bold });
          w += pw;
          continue;
        }
        line.push({ text: word, bold: p.bold });
        w += pw;
      }
    }
    if (line.length) flush();
    return lines;
  };

  const lineWidth = (line: Piece[], size: number) =>
    line.reduce((s, p) => s + font(p.bold).widthOfTextAtSize(p.text, size), 0);

  const drawLine = (line: Piece[], x: number, size: number, color = INK) => {
    let cx = x;
    for (const p of line) {
      if (!p.text) continue;
      page.drawText(p.text, { x: cx, y, size, font: font(p.bold), color });
      cx += font(p.bold).widthOfTextAtSize(p.text, size);
    }
  };

  const paragraph = (pieces: Piece[], opts: { x?: number; width?: number; size?: number; align?: "left" | "center"; after?: number; color?: ReturnType<typeof rgb> } = {}) => {
    const size = opts.size ?? BODY;
    const x = opts.x ?? MARGIN_X;
    const width = opts.width ?? CONTENT_W;
    const leading = size * 1.42;
    const lines = wrap(pieces, width, size);
    lines.forEach((line, i) => {
      ensure(leading);
      // Keep at least two lines of a paragraph together at a page break.
      if (i === 0 && lines.length > 1) ensure(leading * 2);
      y -= leading;
      const lx = opts.align === "center" ? x + (width - lineWidth(line, size)) / 2 : x;
      drawLine(line, lx, size, opts.color);
    });
    y -= opts.after ?? 8;
  };

  const listItem = (marker: string, text: string, indent: number) => {
    const markerW = 22;
    const lines = wrap(toPieces(text), CONTENT_W - indent - markerW, BODY);
    lines.forEach((line, i) => {
      ensure(LEADING);
      y -= LEADING;
      if (i === 0) page.drawText(marker, { x: MARGIN_X + indent, y, size: BODY, font: regular, color: INK });
      drawLine(line, MARGIN_X + indent + markerW, BODY);
    });
    y -= 3;
  };

  const signatureParty = (p: SigParty, x: number, width: number, startY: number) => {
    let cy = startY;
    cy -= 14;
    page.drawText(sanitize(p.heading), { x, y: cy, size: 9.5, font: bold, color: INK });
    cy -= 6;
    for (const l of p.lines) {
      const blank = l.value === undefined;
      const lineGap = blank && isSignatureLine(l.label) ? 34 : 24;
      cy -= lineGap;
      const label = sanitize(l.label + ":");
      page.drawText(label, { x, y: cy, size: 10, font: regular, color: MUTED });
      const lx = x + regular.widthOfTextAtSize(label, 10) + 6;
      page.drawLine({ start: { x: lx, y: cy - 3 }, end: { x: x + width, y: cy - 3 }, thickness: 0.6, color: MUTED });
      if (!blank) {
        const pieces = toPieces(l.value!);
        const text = pieces.map((pc) => pc.text).join("");
        let size = 10.5;
        while (size > 7 && regular.widthOfTextAtSize(text, size) > x + width - lx) size -= 0.5;
        page.drawText(text, { x: lx + 2, y: cy, size, font: regular, color: INK });
      }
    }
    return cy;
  };

  const partyHeight = (p: SigParty) =>
    20 + p.lines.reduce((s, l) => s + (l.value === undefined && isSignatureLine(l.label) ? 34 : 24), 0) + 12;

  let clauseNo = 0;
  for (const b of blocks) {
    switch (b.type) {
      case "title":
        ensure(40);
        paragraph(toPieces(b.text, true), { size: 17, align: "center", after: 6 });
        y -= 6;
        break;
      case "subtitle":
        paragraph(toPieces(b.text), { size: 11, align: "center", after: 10, color: MUTED });
        break;
      case "heading":
        ensure(LEADING * 3);
        y -= 4;
        paragraph(toPieces(b.text.toUpperCase(), true), { size: 10.5, after: 4 });
        break;
      case "paragraph":
        paragraph(toPieces(b.text), { align: b.align });
        break;
      case "list":
        b.items.forEach((it) => listItem("•", it, 8));
        y -= 6;
        break;
      case "clause": {
        clauseNo++;
        ensure(LEADING * 3);
        y -= 2;
        b.paragraphs.forEach((text, i) => {
          const pieces = i === 0 ? [{ text: `${clauseNo}. ${sanitize(b.title)}. `, bold: true }, ...toPieces(text)] : toPieces(text);
          paragraph(pieces, { after: b.list && i === b.paragraphs.length - 1 ? 4 : 7 });
        });
        if (b.list) {
          b.list.forEach((it, i) => listItem(`(${String.fromCharCode(97 + i)})`, it, 14));
          y -= 6;
        }
        break;
      }
      case "signatures": {
        y -= 8;
        if (b.intro) {
          ensure(LEADING * 2 + partyHeight(b.parties[0]));
          paragraph(toPieces(b.intro));
        }
        const colW = (CONTENT_W - 36) / 2;
        for (let i = 0; i < b.parties.length; i += 2) {
          const row = b.parties.slice(i, i + 2);
          const h = Math.max(...row.map(partyHeight));
          ensure(h);
          const startY = y;
          let lowest = y;
          row.forEach((p, j) => {
            lowest = Math.min(lowest, signatureParty(p, MARGIN_X + j * (colW + 36), colW, startY));
          });
          y = lowest - 14;
        }
        break;
      }
      case "notary": {
        ensure(250);
        y -= 12;
        page.drawLine({ start: { x: MARGIN_X, y }, end: { x: PAGE_W - MARGIN_X, y }, thickness: 0.6, color: MUTED });
        y -= 6;
        paragraph(toPieces("NOTARY ACKNOWLEDGMENT", true), { size: 10.5, after: 4 });
        paragraph(toPieces(`State of ${b.state ?? BLANK}, County of ${BLANK}`));
        paragraph(
          toPieces(
            `On ${BLANK} (date), before me, ${BLANK}, a Notary Public, personally appeared ${BLANK}, known to me or proved on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument, and acknowledged that he/she/they executed the same in his/her/their authorized capacity, and that by his/her/their signature(s) on the instrument the person(s), or the entity on behalf of which the person(s) acted, executed the instrument.`,
          ),
        );
        paragraph(toPieces("WITNESS my hand and official seal."));
        const startY = y;
        const colW = (CONTENT_W - 36) / 2;
        const end = signatureParty(
          { heading: "NOTARY PUBLIC", lines: [{ label: "Signature" }, { label: "Printed name" }, { label: "Commission expires" }] },
          MARGIN_X,
          colW,
          startY,
        );
        page.drawRectangle({
          x: MARGIN_X + colW + 36 + 40,
          y: end,
          width: colW - 40,
          height: startY - end - 20,
          borderColor: MUTED,
          borderWidth: 0.6,
          borderDashArray: [3, 3],
        });
        page.drawText("(Seal)", { x: MARGIN_X + colW + 36 + 40 + (colW - 40) / 2 - 12, y: end + (startY - end) / 2 - 10, size: 9, font: regular, color: MUTED });
        y = end - 16;
        break;
      }
      case "spacer":
        y -= 12;
        break;
    }
  }

  // Closing note on the last page. Unbranded, so the document stays the customer's.
  if (meta.note) {
    y -= 18;
    ensure(40);
    page.drawLine({ start: { x: MARGIN_X, y }, end: { x: MARGIN_X + 120, y }, thickness: 0.5, color: MUTED });
    y -= 4;
    paragraph([{ text: sanitize(meta.note), bold: false }], { size: 8, color: MUTED, after: 0 });
  }

  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const label = meta.pageLabel ? meta.pageLabel(i + 1, pages.length) : `Page ${i + 1} of ${pages.length}`;
    const w = regular.widthOfTextAtSize(label, 8.5);
    p.drawText(label, { x: (PAGE_W - w) / 2, y: 40, size: 8.5, font: regular, color: MUTED });
    const t = sanitize(meta.title);
    p.drawText(t, { x: MARGIN_X, y: 40, size: 8.5, font: regular, color: MUTED });
    const initials = meta.initials ?? "Initials: ______";
    p.drawText(initials, { x: PAGE_W - MARGIN_X - regular.widthOfTextAtSize(initials, 8.5), y: 40, size: 8.5, font: regular, color: MUTED });
  });

  return doc.save();
}
