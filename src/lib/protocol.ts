import type { Block } from "./doc";

// Overtakelsesprotokoll for bolig: a free form filled in at move-in or move-out,
// rendered with the same PDF renderer as the paid documents.

export interface Room {
  name: string;
  notes: string;
}

export interface Protocol {
  kind: "inn" | "ut";
  /** ISO date. */
  date: string;
  address: string;
  landlord: string;
  tenant: string;
  meterNo: string;
  meterReading: string;
  keys: string;
  smokeAlarm: "" | "ja" | "nei";
  extinguisher: "" | "ja" | "nei";
  rooms: Room[];
  other: string;
}

export const DEFAULT_ROOMS = ["Gang", "Stue", "Kjøkken", "Bad", "Soverom"];

export const emptyProtocol = (date: string): Protocol => ({
  kind: "inn",
  date,
  address: "",
  landlord: "",
  tenant: "",
  meterNo: "",
  meterReading: "",
  keys: "",
  smokeAlarm: "",
  extinguisher: "",
  rooms: DEFAULT_ROOMS.map((name) => ({ name, notes: "" })),
  other: "",
});

const LINE = "______________________________________________";
const short = "______________";
const v = (s: string, blank = short) => (s.trim() ? s.trim() : blank);
const yesNo = (s: Protocol["smokeAlarm"]) => (s === "ja" ? "Ja" : s === "nei" ? "Nei" : "Ja / Nei");

function dateNb(iso: string) {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : short;
}

export function protocolBlocks(p: Protocol): Block[] {
  const rooms = p.rooms.filter((r) => r.name.trim());
  return [
    { type: "title", text: "Overtakelsesprotokoll" },
    { type: "subtitle", text: p.kind === "ut" ? "Ved utflytting" : "Ved innflytting" },
    {
      type: "clause",
      title: "Bolig og parter",
      paragraphs: [
        `Adresse: **${v(p.address, LINE)}**`,
        `Utleier: ${v(p.landlord, LINE)}`,
        `Leietaker: ${v(p.tenant, LINE)}`,
        `Dato for gjennomgang: ${dateNb(p.date)}`,
      ],
    },
    {
      type: "clause",
      title: "Strøm, nøkler og sikkerhet",
      paragraphs: [
        `Strømmåler nr.: ${v(p.meterNo)}`,
        `Målerstand: ${v(p.meterReading)} kWh`,
        `Antall nøkler overlevert: ${v(p.keys)}`,
        `Røykvarsler testet og virker: ${yesNo(p.smokeAlarm)}`,
        `Brannslukker eller brannteppe på plass: ${yesNo(p.extinguisher)}`,
      ],
    },
    {
      type: "clause",
      title: "Rom for rom",
      paragraphs: [
        "Tilstanden er beskrevet slik partene så den ved gjennomgangen. Vanlig slitasje er ikke en skade. Bilder tatt ved gjennomgangen hører til protokollen.",
        ...rooms.map((r) => `**${r.name.trim()}:** ${v(r.notes, LINE)}`),
      ],
    },
    {
      type: "clause",
      title: "Andre merknader",
      paragraphs: [v(p.other, LINE), ...(p.other.trim() ? [] : [LINE])],
    },
    {
      type: "signatures",
      intro: "Partene har gått gjennom boligen sammen og er enige om at protokollen beskriver tilstanden.",
      parties: [
        { heading: "Utleier", lines: [{ label: "Navn", value: p.landlord.trim() || undefined }, { label: "Underskrift" }] },
        { heading: "Leietaker", lines: [{ label: "Navn", value: p.tenant.trim() || undefined }, { label: "Underskrift" }] },
      ],
    },
  ];
}
