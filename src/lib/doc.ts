// Core types shared by templates, the live preview and the PDF renderer.

export type Answers = Record<string, string>;

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "choice" // big clickable cards, single answer
  | "select"
  | "multi" // checkboxes, stored as comma-separated values
  | "money"
  | "number"
  | "region" // state / county / fylke list from the locale
  | "email";

export interface Option {
  value: string;
  label: string;
  description?: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  defaultValue?: string;
  half?: boolean; // render at half width on wide screens
  showIf?: (a: Answers) => boolean;
}

export interface Step {
  id: string;
  label: string; // short name for the step navigation
  title: string | ((a: Answers) => string);
  description?: string | ((a: Answers) => string);
  fields: Field[];
  showIf?: (a: Answers) => boolean;
}

export interface SigLine {
  label: string;
  value?: string; // undefined renders a blank line to sign or fill by hand
}

export interface SigParty {
  heading: string;
  lines: SigLine[];
}

export type Block =
  | { type: "title"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "paragraph"; text: string; align?: "left" | "center" }
  | { type: "heading"; text: string }
  | { type: "clause"; title: string; paragraphs: string[]; list?: string[] }
  | { type: "list"; items: string[] }
  | { type: "signatures"; intro?: string; parties: SigParty[] }
  | { type: "notary"; state?: string }
  | { type: "spacer" };

export interface FaqItem {
  q: string;
  a: string;
}

export interface Template {
  slug: string;
  locale: string;
  name: string; // "Non-Disclosure Agreement"
  shortName: string; // "NDA"
  tagline: string; // one line for cards
  category: "Business" | "Real estate" | "Personal";
  price: number; // minor units (cents / øre)
  minutes: number; // typical time to complete
  icon: "shield" | "home" | "receipt" | "briefcase" | "key" | "cash" | "users";
  seo: {
    title: string;
    description: string;
    intro: string;
    whenToUse: string[];
    includes: string[];
    faq: FaqItem[];
  };
  steps: Step[];
  render: (a: Answers) => Block[];
}

// ---------------------------------------------------------------------------
// Inline tokens
//
// Templates wrap every answer in a token so the preview can highlight it (and
// the spot being edited) while the PDF prints plain text. Empty answers keep
// their label so the preview shows what is still missing.
//   filled: ⟦fieldId¦value⟧     empty: ⟦fieldId¦?label⟧
// **double asterisks** mark bold text.

const TOKEN_RE = /⟦([^¦⟧]+)¦(\??)([^⟧]*)⟧/g;

function clean(s: string) {
  return s.replace(/[⟦⟧¦*]/g, "").trim();
}

export interface Segment {
  text: string;
  bold: boolean;
  field?: string;
  empty?: boolean;
}

export function parseInline(text: string): Segment[] {
  const out: Segment[] = [];
  const boldParts = text.split("**");
  boldParts.forEach((part, i) => {
    const bold = i % 2 === 1;
    let last = 0;
    for (const m of part.matchAll(TOKEN_RE)) {
      if (m.index! > last) out.push({ text: part.slice(last, m.index), bold });
      out.push({ text: m[3], bold, field: m[1], empty: m[2] === "?" });
      last = m.index! + m[0].length;
    }
    if (last < part.length) out.push({ text: part.slice(last), bold });
  });
  return out.filter((s) => s.text.length > 0);
}

export function plainText(text: string, blank = "__________") {
  return parseInline(text)
    .map((s) => (s.empty ? blank : s.text))
    .join("");
}

// ---------------------------------------------------------------------------
// Helpers templates use to turn answers into text

export function makeCtx(a: Answers) {
  const raw = (id: string) => (a[id] ?? "").trim();
  const has = (id: string) => raw(id).length > 0;
  const tok = (id: string, value: string, label: string) =>
    value ? `⟦${id}¦${clean(value)}⟧` : `⟦${id}¦?${clean(label)}⟧`;

  const v = (id: string, label: string) => tok(id, raw(id), label);

  const date = (id: string, label: string) => tok(id, formatDate(raw(id)), label);

  const money = (id: string, label: string) => tok(id, formatMoney(raw(id)), label);

  // Multi-line answers ("one name per line") joined into prose.
  const names = (id: string, label: string) => {
    const list = raw(id)
      .split(/\n|;/)
      .map((s) => s.trim())
      .filter(Boolean);
    return tok(id, joinList(list), label);
  };

  const opt = (id: string, options: Record<string, string>, label: string) =>
    tok(id, options[raw(id)] ?? "", label);

  const multi = (id: string) =>
    raw(id)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  return { raw, has, v, date, money, names, opt, multi, is: (id: string, val: string) => raw(id) === val };
}

export type Ctx = ReturnType<typeof makeCtx>;

export function joinList(list: string[]) {
  if (list.length <= 1) return list.join("");
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
}

export function formatDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function formatMoney(value: string) {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  if (!value || Number.isNaN(n)) return "";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPrice(cents: number) {
  const whole = cents % 100 === 0;
  return "$" + (cents / 100).toFixed(whole ? 0 : 2);
}

export function visibleSteps(t: Template, a: Answers) {
  return t.steps.filter((s) => !s.showIf || s.showIf(a));
}

export function visibleFields(s: Step, a: Answers) {
  return s.fields.filter((f) => !f.showIf || f.showIf(a));
}

export function resolve<T>(x: T | ((a: Answers) => T), a: Answers): T {
  return typeof x === "function" ? (x as (a: Answers) => T)(a) : x;
}

export function withDefaults(t: Template, a: Answers): Answers {
  const out: Answers = { ...a };
  for (const s of t.steps)
    for (const f of s.fields) if (out[f.id] === undefined && f.defaultValue !== undefined) out[f.id] = f.defaultValue;
  return out;
}

export function missingRequired(t: Template, a: Answers) {
  const missing: { step: Step; field: Field }[] = [];
  for (const step of visibleSteps(t, a))
    for (const field of visibleFields(step, a))
      if (field.required && !(a[field.id] ?? "").trim()) missing.push({ step, field });
  return missing;
}

// How much of the document is filled in, counted per distinct answer slot.
export function completeness(blocks: Block[]) {
  const seen = new Map<string, boolean>();
  const scan = (text?: string) => {
    if (!text) return;
    for (const s of parseInline(text)) if (s.field) seen.set(s.field, (seen.get(s.field) ?? false) || !s.empty);
  };
  for (const b of blocks) {
    if (b.type === "title" || b.type === "subtitle" || b.type === "paragraph" || b.type === "heading") scan(b.text);
    else if (b.type === "list") b.items.forEach(scan);
    else if (b.type === "clause") {
      b.paragraphs.forEach(scan);
      b.list?.forEach(scan);
    } else if (b.type === "signatures") b.parties.forEach((p) => p.lines.forEach((l) => scan(l.value)));
    else if (b.type === "notary") scan(b.state);
  }
  const total = seen.size;
  const filled = [...seen.values()].filter(Boolean).length;
  return { filled, total, pct: total ? Math.round((filled / total) * 100) : 100 };
}
