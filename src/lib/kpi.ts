import type { Block } from "./doc";

// Konsumprisindeksen (KPI) for husleieregulering etter husleieloven § 4-2.
// Kilde: SSB tabell 14700, «I alt», 2025=100. Snapshot below is the fallback;
// the page refreshes it from SSB's API once a day.

export const KPI_TABLE = "14700";
const API = `https://data.ssb.no/api/pxwebapi/v2/tables/${KPI_TABLE}/data?lang=no&valueCodes[VareTjenesteGrp]=00&valueCodes[ContentsCode]=KpiIndMnd&valueCodes[Tid]=from(2015M01)&outputFormat=json-stat2`;

/** Month key "YYYY-MM" → index value. */
export type KpiSeries = Record<string, number>;

// One row per year, January to December (2015–2026). Fetched from SSB 11 Oct 2026.
const SNAPSHOT_ROWS: [number, number[]][] = [
  [2015, [71.6, 71.8, 72.0, 72.3, 72.5, 72.7, 72.7, 72.5, 73.0, 73.3, 73.6, 73.3]],
  [2016, [73.7, 74.1, 74.4, 74.7, 74.9, 75.4, 75.9, 75.4, 75.7, 76.0, 76.2, 75.8]],
  [2017, [75.7, 76.0, 76.3, 76.4, 76.6, 76.9, 77.1, 76.5, 76.9, 76.9, 77.0, 77.1]],
  [2018, [77.0, 77.7, 77.9, 78.2, 78.2, 78.8, 79.4, 79.1, 79.5, 79.4, 79.7, 79.7]],
  [2019, [79.4, 80.0, 80.1, 80.5, 80.3, 80.3, 80.9, 80.3, 80.7, 80.8, 81.0, 80.8]],
  [2020, [80.8, 80.8, 80.8, 81.1, 81.2, 81.4, 82.0, 81.7, 82.0, 82.2, 81.6, 82.0]],
  [2021, [82.8, 83.4, 83.2, 83.5, 83.4, 83.7, 84.5, 84.4, 85.4, 85.1, 85.8, 86.3]],
  [2022, [85.5, 86.5, 87.0, 88.0, 88.3, 89.0, 90.2, 89.9, 91.2, 91.5, 91.4, 91.4]],
  [2023, [91.5, 91.9, 92.7, 93.6, 94.1, 94.7, 95.0, 94.3, 94.3, 95.2, 95.7, 95.7]],
  [2024, [95.9, 96.1, 96.3, 97.0, 96.9, 97.2, 97.7, 96.8, 97.1, 97.7, 98.0, 97.9]],
  [2025, [98.1, 99.5, 98.8, 99.4, 99.9, 100.1, 100.8, 100.2, 100.6, 100.7, 100.9, 101.0]],
  [2026, [101.6, 102.2, 102.4, 102.8, 103.0, 102.8, 103.8, 103.5, 104.0]],
];

export const KPI_SNAPSHOT: KpiSeries = Object.fromEntries(
  SNAPSHOT_ROWS.flatMap(([year, values]) => values.map((v, i) => [`${year}-${String(i + 1).padStart(2, "0")}`, v])),
);

/** Parses SSB's json-stat2 response into a series. Returns null if the shape is unexpected. */
export function parseSsb(json: unknown): KpiSeries | null {
  try {
    const j = json as { dimension: { Tid: { category: { index: Record<string, number> } } }; value: (number | null)[] };
    const index = j.dimension.Tid.category.index;
    const out: KpiSeries = {};
    for (const [code, pos] of Object.entries(index)) {
      const m = /^(\d{4})M(\d{2})$/.exec(code);
      const v = j.value[pos];
      if (m && typeof v === "number") out[`${m[1]}-${m[2]}`] = v;
    }
    return Object.keys(out).length > 12 ? out : null;
  } catch {
    return null;
  }
}

/** The snapshot, updated with SSB's latest figures when the API answers. */
export async function getKpi(): Promise<KpiSeries> {
  try {
    const res = await fetch(API, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return KPI_SNAPSHOT;
    const live = parseSsb(await res.json());
    return live ? { ...KPI_SNAPSHOT, ...live } : KPI_SNAPSHOT;
  } catch {
    return KPI_SNAPSHOT;
  }
}

export const months = (s: KpiSeries) => Object.keys(s).sort();
export const latestMonth = (s: KpiSeries) => months(s).at(-1)!;

const MONTHS_NB = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];

/** "2026-09" → "september 2026". */
export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS_NB[m - 1]} ${y}`;
}

export interface Regulation {
  from: string;
  to: string;
  kpiFrom: number;
  kpiTo: number;
  /** Change in percent, one decimal. */
  pct: number;
  oldRent: number;
  /** Rounded to whole kroner. */
  newRent: number;
}

/** New rent when it follows KPI from the month the rent was last set to the latest published month. */
export function regulate(s: KpiSeries, oldRent: number, from: string, to = latestMonth(s)): Regulation | null {
  const kpiFrom = s[from];
  const kpiTo = s[to];
  if (!kpiFrom || !kpiTo || !(oldRent > 0) || from > to) return null;
  const factor = kpiTo / kpiFrom;
  return {
    from,
    to,
    kpiFrom,
    kpiTo,
    pct: Math.round((factor - 1) * 1000) / 10,
    oldRent,
    newRent: Math.round(oldRent * factor),
  };
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
function addMonths(isoDate: string, n: number) {
  const d = new Date(isoDate + "T00:00:00Z");
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return iso(d);
}

/**
 * Earliest date the new rent can apply: at least one month after the notice is sent,
 * and at least one year after the rent was last set (§ 4-2). Rounded up to the first
 * of a month, since rent is normally paid monthly.
 */
export function earliestStart(noticeDate: string, lastSetMonth: string) {
  const afterNotice = addMonths(noticeDate, 1);
  const afterYear = addMonths(`${lastSetMonth}-01`, 12);
  const min = afterNotice > afterYear ? afterNotice : afterYear;
  return min.endsWith("-01") ? min : addMonths(`${min.slice(0, 7)}-01`, 1);
}

const kr = (n: number) => `${n.toLocaleString("nb-NO").replace(/ /g, " ")} kr`;
const pct = (n: number) => n.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dateNb = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${d}. ${MONTHS_NB[m - 1]} ${y}`;
};

export interface Notice {
  landlord: string;
  tenant: string;
  address: string;
  /** ISO date the notice is sent. */
  noticeDate: string;
  /** ISO date the new rent applies from. */
  startDate: string;
}

/** The notice letter to the tenant, as PDF blocks. Blank fields print as lines to fill by hand. */
export function noticeBlocks(r: Regulation, n: Notice): Block[] {
  const blank = "______________________";
  return [
    { type: "title", text: "Varsel om regulering av husleie" },
    { type: "paragraph", text: `Til: **${n.tenant.trim() || blank}**` },
    { type: "paragraph", text: `Gjelder: leieforholdet i **${n.address.trim() || blank}**` },
    { type: "paragraph", text: `Dato: ${dateNb(n.noticeDate)}` },
    {
      type: "paragraph",
      text: `Etter husleieloven § 4-2 kan leien reguleres i samsvar med endringen i konsumprisindeksen (KPI), tidligst ett år etter at leien sist ble fastsatt, og med minst én måneds skriftlig varsel.`,
    },
    {
      type: "paragraph",
      text: `Husleien ble sist fastsatt i ${monthLabel(r.from)}, da KPI var ${pct(r.kpiFrom)}. Siste publiserte KPI er ${pct(r.kpiTo)} (${monthLabel(r.to)}). Det er en endring på ${pct(r.pct)} prosent.`,
    },
    {
      type: "paragraph",
      text: `Husleien endres derfor fra ${kr(r.oldRent)} til **${kr(r.newRent)} per måned**, med virkning fra **${dateNb(n.startDate)}**. Andre vilkår i leiekontrakten gjelder som før.`,
    },
    { type: "paragraph", text: `Kilde: Statistisk sentralbyrå, tabell ${KPI_TABLE}, konsumprisindeksen i alt (2025=100).` },
    { type: "signatures", parties: [{ heading: "Utleier", lines: [{ label: "Navn", value: n.landlord.trim() || undefined }, { label: "Underskrift" }] }] },
  ];
}
