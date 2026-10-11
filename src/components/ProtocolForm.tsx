"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { downloadPdf } from "@/lib/downloadPdf";
import { emptyProtocol, protocolBlocks, type Protocol } from "@/lib/protocol";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink sm:text-[15px] outline-none transition placeholder:text-[#a8a59d] hover:border-[#d6d0c2] focus:border-brand focus:ring-4 focus:ring-brand/12";
const labelCls = "mb-2 block text-sm font-semibold text-ink";

export function ProtocolForm() {
  const [p, setP] = useState<Protocol>(() => emptyProtocol(new Date().toISOString().slice(0, 10)));
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Protocol>(k: K, value: Protocol[K]) => setP((x) => ({ ...x, [k]: value }));
  const setRoom = (i: number, key: "name" | "notes", value: string) =>
    setP((x) => ({ ...x, rooms: x.rooms.map((r, j) => (j === i ? { ...r, [key]: value } : r)) }));

  const text = (id: keyof Protocol, label: string, placeholder = "", half = true) => (
    <div className={half ? "" : "sm:col-span-2"}>
      <label htmlFor={`p-${id}`} className={labelCls}>{label}</label>
      <input id={`p-${id}`} className={inputCls} placeholder={placeholder} value={p[id] as string} onChange={(e) => set(id, e.target.value as never)} />
    </div>
  );
  const yesNo = (id: "smokeAlarm" | "extinguisher", label: string) => (
    <div>
      <label htmlFor={`p-${id}`} className={labelCls}>{label}</label>
      <select id={`p-${id}`} className={inputCls} value={p[id]} onChange={(e) => set(id, e.target.value as Protocol[typeof id])}>
        <option value="">Fyll inn for hånd</option>
        <option value="ja">Ja</option>
        <option value="nei">Nei</option>
      </select>
    </div>
  );

  async function download() {
    setBusy(true);
    try {
      await downloadPdf(protocolBlocks(p), "Overtakelsesprotokoll", "overtakelsesprotokoll.pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(20,23,31,0.35)] sm:p-8">
      <div role="radiogroup" aria-label="Når gjelder protokollen?" className="grid grid-cols-2 gap-3">
        {(["inn", "ut"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={p.kind === k}
            onClick={() => set("kind", k)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${p.kind === k ? "border-brand bg-brand-soft text-ink" : "border-line text-ink-soft hover:border-[#d6d0c2]"}`}
          >
            {k === "inn" ? "Innflytting" : "Utflytting"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {text("address", "Adresse til boligen", "Storgata 1 H0201, 0155 Oslo", false)}
        {text("landlord", "Utleier", "Kari Nordmann")}
        {text("tenant", "Leietaker", "Ola Nordmann")}
        <div>
          <label htmlFor="p-date" className={labelCls}>Dato</label>
          <input id="p-date" type="date" className={inputCls} value={p.date} onChange={(e) => set("date", e.target.value)} />
        </div>
        {text("keys", "Antall nøkler", "f.eks. 3")}
        {text("meterNo", "Strømmåler nr.", "valgfritt")}
        {text("meterReading", "Målerstand (kWh)", "valgfritt")}
        {yesNo("smokeAlarm", "Røykvarsler virker")}
        {yesNo("extinguisher", "Brannslukker på plass")}
      </div>

      <h3 className="mt-8 font-serif text-2xl font-medium tracking-tight text-ink">Rom for rom</h3>
      <p className="mt-1 text-sm text-ink-soft">Skriv det du ser: riper, flekker, hull i vegger, hvitevarer som ikke virker. Tomme felt blir linjer du kan fylle ut for hånd.</p>
      <div className="mt-4 space-y-4">
        {p.rooms.map((r, i) => (
          <div key={i} className="rounded-xl border border-line p-4">
            <div className="flex items-center gap-3">
              <input aria-label="Navn på rommet" className={`${inputCls} font-semibold`} value={r.name} onChange={(e) => setRoom(i, "name", e.target.value)} />
              <button
                type="button"
                aria-label={`Fjern ${r.name || "rommet"}`}
                onClick={() => setP((x) => ({ ...x, rooms: x.rooms.filter((_, j) => j !== i) }))}
                className="grid size-11 shrink-0 place-items-center rounded-xl border border-line text-muted hover:text-ink"
              >
                <Icon name="x" className="size-4" />
              </button>
            </div>
            <textarea
              aria-label={`Tilstand: ${r.name}`}
              rows={2}
              className={`${inputCls} mt-3 resize-y`}
              placeholder="f.eks. Liten ripe i parketten ved vinduet. Ellers fint."
              value={r.notes}
              onChange={(e) => setRoom(i, "notes", e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setP((x) => ({ ...x, rooms: [...x.rooms, { name: "Nytt rom", notes: "" }] }))}
        className="mt-4 text-sm font-semibold text-brand underline"
      >
        + Legg til rom
      </button>

      <div className="mt-6">
        <label htmlFor="p-other" className={labelCls}>Andre merknader</label>
        <textarea id="p-other" rows={3} className={`${inputCls} resize-y`} placeholder="f.eks. Hvitevarer som følger med, bod, parkering" value={p.other} onChange={(e) => set("other", e.target.value)} />
      </div>

      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-sm hover:bg-brand-dark disabled:opacity-60"
      >
        <Icon name="download" className="size-4" /> {busy ? "Lager PDF …" : "Last ned protokoll (PDF)"}
      </button>
      <p className="mt-3 text-sm text-muted">
        Det du skriver, blir i nettleseren din. Mangler du kontrakt?{" "}
        <Link href="/documents/husleiekontrakt" className="font-medium text-brand underline">Lag husleiekontrakt</Link>
      </p>
    </div>
  );
}
