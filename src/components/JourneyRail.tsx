"use client";

import { t } from "@/i18n";
import { Icon, type IconName } from "./Icon";

export interface JourneyNode {
  label: string;
  summary?: string;
  state: "done" | "current" | "todo";
  icon?: IconName;
  onClick?: () => void;
}

// The visual "path to done": every question step, then review, pay and download,
// drawn as a connected vertical workflow.
export function JourneyRail({ title, pct, nodes, price }: { title: string; pct: number; nodes: JourneyNode[]; price: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <aside className="hidden min-h-0 flex-col overflow-y-auto bg-ink text-white xl:flex" aria-label={t.rail.label}>
      <div className="flex items-center gap-4 border-b border-white/10 px-6 py-6">
        <svg viewBox="0 0 56 56" className="size-14 shrink-0 -rotate-90" aria-hidden="true">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="var(--color-mint)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct / 100)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">{t.rail.yourPath}</p>
          <p className="truncate font-serif text-lg leading-tight">{title}</p>
          <p className="mt-0.5 text-xs text-mint tabular-nums">{t.rail.filledIn(pct)}</p>
        </div>
      </div>

      <ol className="flex-1 px-6 py-7">
        {nodes.map((n, i) => {
          const last = i === nodes.length - 1;
          const clickable = !!n.onClick;
          const Tag = clickable ? "button" : "div";
          return (
            <li key={n.label + i} className="relative pb-6 last:pb-0">
              {!last && (
                <span className="absolute top-9 bottom-1 left-[15px] w-0.5 overflow-hidden rounded-full bg-white/12" aria-hidden="true">
                  <span className={`block w-full rounded-full bg-mint transition-all duration-700 ease-out ${n.state === "done" ? "h-full" : "h-0"}`} />
                </span>
              )}
              <Tag
                {...(clickable ? { type: "button" as const, onClick: n.onClick } : {})}
                aria-current={n.state === "current" ? "step" : undefined}
                className={`group flex w-full items-start gap-3.5 text-left ${clickable ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  key={n.state}
                  className={`relative grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold transition ${
                    n.state === "done"
                      ? "animate-pop bg-mint text-ink"
                      : n.state === "current"
                        ? "bg-honey text-ink ring-4 ring-honey/25"
                        : "border border-white/25 text-white/60 group-hover:border-white/50"
                  }`}
                >
                  {n.state === "current" && <span className="absolute inset-0 animate-ping rounded-full bg-honey/40" />}
                  <span className="relative">
                    {n.state === "done" ? <Icon name="check" className="size-4" strokeWidth={3} /> : n.icon ? <Icon name={n.icon} className="size-4" /> : i + 1}
                  </span>
                </span>
                <span className="min-w-0 flex-1 pt-1">
                  <span
                    className={`block text-sm font-medium transition ${
                      n.state === "todo" ? "text-white/60 group-hover:text-white/85" : "text-white"
                    }`}
                  >
                    {n.label}
                  </span>
                  {n.summary ? (
                    <span className="mt-0.5 block truncate text-xs text-white/50">{n.summary}</span>
                  ) : n.state === "current" ? (
                    <span className="mt-0.5 block text-xs text-honey">{t.rail.here}</span>
                  ) : null}
                </span>
              </Tag>
            </li>
          );
        })}
      </ol>

      <div className="m-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-relaxed text-white/65">
        <p className="font-semibold text-white">
          {t.rail.once(price)}
        </p>
        <p className="mt-1">{t.rail.noAccount}</p>
      </div>
    </aside>
  );
}
