"use client";

import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { Icon, type IconName } from "./Icon";

const STAGES = t.showcase.stages as { icon: IconName; title: string; short: string; text: string }[];

export function JourneyShowcase({ minPrice }: { minPrice: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % STAGES.length), 3800);
    return () => clearInterval(timer);
  }, [paused]);

  const stage = STAGES[active];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)}>
      {/* The path */}
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute top-7 right-[12.5%] left-[12.5%] h-1 rounded-full bg-line" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-[#18a383] transition-all duration-700 ease-out"
            style={{ width: `${(active / (STAGES.length - 1)) * 100}%` }}
          />
        </div>
        <ol className="relative grid grid-cols-4" role="tablist" aria-label={t.showcase.label}>
          {STAGES.map((s, i) => {
            const state = i < active ? "done" : i === active ? "current" : "todo";
            return (
              <li key={s.short} className="flex justify-center">
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls="journey-panel"
                  onClick={() => setActive(i)}
                  className="group flex flex-col items-center gap-3 focus-visible:outline-none"
                >
                  <span
                    className={`relative grid size-14 place-items-center rounded-2xl border-2 transition-all duration-300 group-focus-visible:ring-4 group-focus-visible:ring-brand/25 ${
                      state === "current"
                        ? "scale-110 border-ink bg-ink text-white shadow-[0_14px_30px_-10px_rgba(20,23,31,0.6)]"
                        : state === "done"
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-white text-muted group-hover:border-ink/40 group-hover:text-ink"
                    }`}
                  >
                    {state === "done" ? <Icon name="check" className="size-6" strokeWidth={2.6} /> : <Icon name={s.icon} className="size-6" />}
                    {state === "current" && <span className="absolute -inset-1.5 animate-pulse rounded-[20px] border-2 border-honey" />}
                  </span>
                  <span className={`text-sm font-semibold transition ${state === "todo" ? "text-muted" : "text-ink"}`}>
                    <span className="mr-1 text-muted tabular-nums">{i + 1}.</span>
                    {s.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The detail panel */}
      <div id="journey-panel" role="tabpanel" className="mx-auto mt-12 grid max-w-4xl items-center gap-8 rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-30px_rgba(20,23,31,0.35)] sm:p-10 md:grid-cols-2">
        <div key={active} className="animate-step-fwd">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">{t.showcase.stepOf(active + 1)}</p>
          <h3 className="mt-2 font-serif text-3xl font-medium tracking-tight">{stage.title}</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">{stage.text}</p>
          <div className="mt-6 flex gap-1.5" aria-hidden="true">
            {STAGES.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-ink" : "w-3 bg-line"}`} />
            ))}
          </div>
        </div>
        <div key={`v${active}`} className="animate-rise grid min-h-[220px] place-items-center rounded-2xl bg-[#f3f0e8] p-6">
          <Visual stage={active} minPrice={minPrice} />
        </div>
      </div>
    </div>
  );
}

function Visual({ stage, minPrice }: { stage: number; minPrice: string }) {
  if (stage === 0)
    return (
      <div className="grid w-full max-w-xs gap-2.5">
        {t.showcase.docs.map(([icon, name, p], i) => (
          <div key={name} className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 text-sm ${i === 0 ? "border-ink shadow-md" : "border-line"}`}>
            <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
              <Icon name={icon as IconName} className="size-4" />
            </span>
            <span className="flex-1 font-medium">{name}</span>
            <span className="font-semibold">{p}</span>
          </div>
        ))}
      </div>
    );
  if (stage === 1)
    return (
      <div className="w-full max-w-xs rounded-2xl border border-line bg-white p-5 shadow-md">
        <p className="font-serif text-xl font-medium">{t.showcase.question}</p>
        <p className="mt-3 text-xs font-medium">{t.showcase.fieldLabel}</p>
        <div className="mt-1.5 rounded-lg border-2 border-brand px-3 py-2 text-sm">
          {t.showcase.answer}<span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-ink" />
        </div>
        <div className="mt-4 flex justify-end">
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
            {t.home.continue} <Icon name="arrowRight" className="size-3.5" />
          </span>
        </div>
      </div>
    );
  if (stage === 2)
    return (
      <div className="w-full max-w-xs rounded-md bg-white px-6 py-6 font-serif text-[12.5px] leading-relaxed shadow-md">
        <p className="mb-2 text-center text-[15px] font-semibold">{t.showcase.docTitle}</p>
        <p>
          {t.showcase.docText(
            <span className="rounded bg-honey-soft px-0.5 font-semibold ring-2 ring-honey">{t.showcase.answer}</span>,
            <span className="rounded bg-[#f1efe9] px-0.5 text-[#8a867c] italic">{t.showcase.purpose}</span>,
          )}
        </p>
        <div className="mt-3 space-y-1.5" aria-hidden="true">
          <div className="h-1.5 w-full rounded bg-[#ece9e2]" />
          <div className="h-1.5 w-11/12 rounded bg-[#ece9e2]" />
          <div className="h-1.5 w-4/5 rounded bg-[#ece9e2]" />
        </div>
      </div>
    );
  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-md">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">{t.showcase.oneTime}</span>
          <span className="font-serif text-2xl font-medium">{t.showcase.from(minPrice)}</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-semibold text-white">
          <Icon name="lock" className="size-4" /> {t.showcase.payDownload}
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm shadow-sm">
        <span className="grid size-9 place-items-center rounded-lg bg-[#fde8e7] text-[11px] font-bold text-[#b42318]">PDF</span>
        <span className="flex-1">
          <span className="block font-medium">{t.showcase.file}</span>
          <span className="text-xs text-muted">{t.showcase.fileReady}</span>
        </span>
        <Icon name="check" className="size-5 text-brand" strokeWidth={2.6} />
      </div>
    </div>
  );
}
