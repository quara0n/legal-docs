"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "./Icon";
import { earliestStart, latestMonth, monthLabel, months, noticeBlocks, regulate, type KpiSeries } from "@/lib/kpi";
import { parseAmount } from "@/lib/doc";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink sm:text-[15px] outline-none transition placeholder:text-[#a8a59d] hover:border-[#d6d0c2] focus:border-brand focus:ring-4 focus:ring-brand/12";
const labelCls = "mb-2 block text-sm font-semibold text-ink";

const kr = (n: number) => `${n.toLocaleString("nb-NO")} kr`;
const idx = (n: number) => n.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const today = () => new Date().toISOString().slice(0, 10);

export function KpiCalculator({ series }: { series: KpiSeries }) {
  const all = months(series);
  const latest = latestMonth(series);
  // Default: rent last set one year before the latest index.
  const [ly, lm] = latest.split("-");
  const defaultFrom = `${Number(ly) - 1}-${lm}`;
  const years = [...new Set(all.map((m) => m.slice(0, 4)))].reverse();

  const [rent, setRent] = useState("");
  const [year, setYear] = useState(defaultFrom.slice(0, 4));
  const [month, setMonth] = useState(defaultFrom.slice(5, 7));
  const from = `${year}-${month}`;
  const r = useMemo(() => regulate(series, parseAmount(rent, "nb-NO"), from), [series, rent, from]);

  const [landlord, setLandlord] = useState("");
  const [tenant, setTenant] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const noticeDate = today();
  const startDate = earliestStart(noticeDate, from);

  async function download() {
    if (!r) return;
    setBusy(true);
    try {
      const { renderPdf } = await import("@/lib/pdf");
      const bytes = await renderPdf(noticeBlocks(r, { landlord, tenant, address, noticeDate, startDate }), {
        title: "Varsel om regulering av husleie",
        note: "Laget gratis på rettframavtaler.no",
        pageLabel: (i, n) => `Side ${i} av ${n}`,
        initials: "",
        size: "a4",
      });
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "varsel-regulering-husleie.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } finally {
      setBusy(false);
    }
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).filter((m) => series[`${year}-${m}`] !== undefined);

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(20,23,31,0.35)] sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="kpi-rent" className={labelCls}>Husleie i dag (kr per måned)</label>
          <input id="kpi-rent" inputMode="numeric" autoComplete="off" className={inputCls} placeholder="f.eks. 12 000" value={rent} onChange={(e) => setRent(e.target.value)} />
        </div>
        <div>
          <label htmlFor="kpi-month" className={labelCls}>Leien ble sist fastsatt</label>
          <select id="kpi-month" className={inputCls} value={month} onChange={(e) => setMonth(e.target.value)}>
            {monthOptions.map((m) => (
              <option key={m} value={m}>{monthLabel(`2000-${m}`).split(" ")[0]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="kpi-year" className={labelCls}>År</label>
          <select
            id="kpi-year"
            className={inputCls}
            value={year}
            onChange={(e) => {
              const y = e.target.value;
              setYear(y);
              // Only the latest year is partial.
              if (series[`${y}-${month}`] === undefined) setMonth(latest.slice(5, 7));
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">Bruk måneden leiekontrakten startet, eller måneden leien sist ble endret.</p>

      <div className="mt-6 rounded-xl bg-brand-soft p-5" aria-live="polite">
        {r ? (
          <>
            <p className="text-sm text-ink-soft">Ny husleie fra tidligst {startDate.split("-").reverse().join(".")}</p>
            <p className="mt-1 font-serif text-4xl font-medium text-ink">{kr(r.newRent)}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {r.newRent >= r.oldRent ? "+" : "−"}
              {kr(Math.abs(r.newRent - r.oldRent))} per måned ({r.pct.toLocaleString("nb-NO")} %). KPI {monthLabel(r.from)}: {idx(r.kpiFrom)}, KPI {monthLabel(r.to)}: {idx(r.kpiTo)}.
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-soft">Skriv inn husleien for å se ny leie. Siste KPI er fra {monthLabel(latest)}.</p>
        )}
      </div>

      {r && (
        <div className="mt-8 border-t border-line pt-6">
          <h3 className="font-serif text-2xl font-medium tracking-tight text-ink">Gratis varselbrev til leietaker</h3>
          <p className="mt-1 text-sm text-ink-soft">Fyll inn navnene, så lager vi et ferdig brev som PDF. Det du skriver, blir i nettleseren din.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="kpi-landlord" className={labelCls}>Utleiers navn</label>
              <input id="kpi-landlord" className={inputCls} placeholder="Kari Nordmann" value={landlord} onChange={(e) => setLandlord(e.target.value)} />
            </div>
            <div>
              <label htmlFor="kpi-tenant" className={labelCls}>Leietakers navn</label>
              <input id="kpi-tenant" className={inputCls} placeholder="Ola Nordmann" value={tenant} onChange={(e) => setTenant(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="kpi-address" className={labelCls}>Adresse til boligen</label>
              <input id="kpi-address" className={inputCls} placeholder="Storgata 1, 0155 Oslo" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-sm hover:bg-brand-dark disabled:opacity-60"
          >
            <Icon name="download" className="size-4" /> {busy ? "Lager PDF …" : "Last ned varselbrev (PDF)"}
          </button>
          <p className="mt-3 text-sm text-muted">
            Har du ikke skriftlig kontrakt ennå?{" "}
            <Link href="/documents/husleiekontrakt" className="font-medium text-brand underline">Lag husleiekontrakt</Link>
          </p>
        </div>
      )}
    </div>
  );
}
