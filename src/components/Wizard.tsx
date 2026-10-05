"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLocale, getTemplate } from "@/content";
import {
  completeness,
  formatDate,
  formatMoney,
  formatPrice,
  missingRequired,
  resolve,
  visibleFields,
  visibleSteps,
  withDefaults,
  type Answers,
  type Field as FieldDef,
  type Warning,
} from "@/lib/doc";
import { t } from "@/i18n";
import { track } from "@/lib/analytics";
import { LANG } from "@/lib/market";
import { clearDraft, loadDraft, loadPurchase, saveDraft, type Purchase } from "@/lib/storage";
import { DocPreview } from "./DocPreview";
import { Field } from "./Field";
import { Icon } from "./Icon";
import { JourneyRail, type JourneyNode } from "./JourneyRail";
import { Logo } from "./Logo";
import { Warnings } from "./Warnings";

export function Wizard({ slug }: { slug: string }) {
  const template = getTemplate(slug)!;
  const locale = getLocale(template.locale);
  const [answers, setAnswers] = useState<Answers>(() => withDefaults(template, {}));
  const [rawStep, setStepIndex] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const steps = useMemo(() => visibleSteps(template, answers), [template, answers]);
  const reviewIndex = steps.length;
  // Clamp, since conditional steps can appear or disappear as answers change.
  const stepIndex = Math.min(rawStep, reviewIndex);
  const isReview = stepIndex >= reviewIndex;
  const step = isReview ? null : steps[stepIndex];
  const blocks = useMemo(() => template.render(answers), [template, answers]);
  const totalSteps = steps.length + 1;
  const done = useMemo(() => completeness(blocks), [blocks]);

  // Restore a saved draft (and an earlier purchase) after hydration. The page is
  // prerendered, so browser storage can only be read once mounted.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const draft = loadDraft(slug);
    const params = new URLSearchParams(window.location.search);
    if (draft) {
      setAnswers(withDefaults(template, draft.answers));
      setStepIndex(params.get("step") === "review" ? 999 : draft.step);
    }
    setPurchase(loadPurchase(slug));
    setHydrated(true);
    if (!draft) track("Document started", { document: slug });
  }, [slug, template]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(slug, answers, stepIndex);
  }, [answers, stepIndex, hydrated, slug]);

  // Scroll the preview to whatever the visitor is editing.
  useEffect(() => {
    if (!active) return;
    for (const root of [previewRef.current, mobilePreviewRef.current]) {
      const el = root?.querySelector<HTMLElement>(`[data-field="${active}"]`);
      if (el && root) {
        const r = el.getBoundingClientRect();
        const pr = root.getBoundingClientRect();
        if (r.top < pr.top + 60 || r.bottom > pr.bottom - 60)
          root.scrollTo({ top: root.scrollTop + r.top - pr.top - pr.height / 3, behavior: "smooth" });
      }
    }
  }, [active, answers]);

  const set = useCallback((id: string, v: string) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    setErrors((e) => (e[id] ? { ...e, [id]: "" } : e));
  }, []);

  const goTo = (i: number) => {
    setDir(i < stepIndex ? "back" : "fwd");
    setStepIndex(i);
    setErrors({});
    setActive(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    if (!step) return;
    const errs: Record<string, string> = {};
    for (const f of visibleFields(step, answers)) if (f.required && !(answers[f.id] ?? "").trim()) errs[f.id] = t.wizard.required;
    if (Object.keys(errs).length) {
      setErrors(errs);
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    track("Step completed", { document: slug, step: step.label });
    goTo(stepIndex + 1);
  };

  const missing = missingRequired(template, answers);
  const warnings = template.warnings?.(answers) ?? [];
  const stepFieldIds = new Set(step ? visibleFields(step, answers).map((f) => f.id) : []);
  const legacyStepWarnings = ["state", "deposit", "rate", "effective", "builtBefore1978"].some((id) => stepFieldIds.has(id));
  const stepWarnings = warnings.filter((w) => (w.fields ? w.fields.some((id) => stepFieldIds.has(id)) : legacyStepWarnings));

  const pay = async () => {
    setPaying(true);
    setPayError("");
    track("Checkout started", { document: slug });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error ?? t.wizard.checkoutUnavailable);
      window.location.href = data.url;
    } catch (e) {
      setPayError(e instanceof Error ? e.message : t.wizard.wrong);
      setPaying(false);
    }
  };

  const startOver = () => {
    if (!window.confirm(t.wizard.confirmReset)) return;
    clearDraft(slug);
    setAnswers(withDefaults(template, {}));
    goTo(0);
  };

  const price = formatPrice(template.price, LANG);
  const stepTitle = step ? resolve(step.title, answers) : t.wizard.reviewTitle;
  const currentLabel = step ? step.label : t.wizard.review;

  const primaryLabel = stepIndex === reviewIndex - 1 ? t.wizard.reviewDoc : t.wizard.continue;

  const summaryFor = (i: number) => {
    const vals = visibleFields(steps[i], answers)
      .map((f) => ({ f, v: displayValue(f, answers[f.id] ?? "") }))
      .filter((x) => x.v);
    const pick = vals.find((x) => x.f.type !== "choice") ?? vals[0];
    return pick?.v.split("\n").join(", ");
  };
  const stateOf = (i: number): JourneyNode["state"] => (i < stepIndex ? "done" : i === stepIndex ? "current" : "todo");
  const journey: JourneyNode[] = [
    ...steps.map((s, i) => ({
      label: s.label,
      state: stateOf(i),
      summary: i < stepIndex ? summaryFor(i) : undefined,
      onClick: () => goTo(i),
    })),
    { label: t.wizard.review, state: stateOf(reviewIndex), icon: "eye", onClick: () => goTo(reviewIndex) },
    { label: t.wizard.payOnce(price), state: purchase ? "done" : "todo", icon: "lock" },
    { label: t.wizard.downloadSign, state: purchase ? "done" : "todo", icon: "download", summary: t.wizard.pdfReady },
  ];

  return (
    <div data-clarity-mask="True" className="flex min-h-screen flex-col bg-[#f7f5f0] lg:h-screen lg:overflow-hidden">
      {/* Top bar */}
      <header className="z-20 shrink-0 border-b border-line bg-paper/90 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <Logo />
          <span className="hidden h-5 w-px bg-line sm:block" />
          <span className="hidden truncate text-sm font-medium text-ink-soft sm:block">{template.name}</span>
          <span className="hidden items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] text-muted md:inline-flex">
            <span className="size-1.5 rounded-full bg-brand" /> {t.wizard.autosaved}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark sm:inline-flex">
              <span className="font-semibold">{price}</span> {t.wizard.oneTimeBadge}
            </span>
            <Link href={`/documents/${slug}`} className="rounded-lg p-2 text-muted transition hover:bg-cream hover:text-ink" aria-label={t.wizard.close}>
              <Icon name="x" />
            </Link>
          </div>
        </div>
      </header>

      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[minmax(440px,1fr)_minmax(0,1.15fr)] xl:grid-cols-[264px_minmax(440px,1fr)_minmax(0,1.1fr)]">
        <JourneyRail title={template.shortName} pct={done.pct} nodes={journey} price={price} />

        {/* Form */}
        <main className="lg:overflow-y-auto" aria-label={t.wizard.questions}>
          <div ref={formTopRef} className="mx-auto w-full max-w-xl scroll-mt-20 px-5 pt-7 pb-36 sm:px-8 lg:pt-12 lg:pb-16">
            {/* Stepper */}
            <nav aria-label={t.wizard.progress} className="mb-9 xl:mb-8">
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <p className="text-muted">
                  <span className="font-semibold text-ink">
                    {t.wizard.step(stepIndex + 1)}
                  </span>{" "}
                  {t.wizard.of(totalSteps)} <span className="mx-1 text-line">/</span>
                  <span className="text-ink-soft">{currentLabel}</span>
                </p>
                <p className="flex shrink-0 items-center gap-1 text-muted">
                  <Icon name="clock" className="size-3.5" /> ~{template.minutes} min
                </p>
              </div>
              <ol className="mt-3 flex gap-1.5 xl:hidden">
                {[...steps.map((s) => s.label), t.wizard.review].map((label, i) => {
                  const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "todo";
                  return (
                    <li key={label + i} className="flex-1">
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={state === "current" ? "step" : undefined}
                        aria-label={t.wizard.stepAria(i + 1, label, state === "done")}
                        title={label}
                        className="group block w-full py-1.5"
                      >
                        <span className="block h-1.5 overflow-hidden rounded-full bg-[#e4dfd3] transition group-hover:bg-[#d8d2c4]">
                          <span
                            className={`block h-full rounded-full transition-all duration-500 ease-out ${
                              state === "done" ? "w-full bg-brand" : state === "current" ? "w-1/2 bg-ink" : "w-0"
                            }`}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {!hydrated ? (
              <div aria-hidden="true" className="space-y-4">
                <div className="h-9 w-3/4 animate-pulse rounded-lg bg-[#e9e5dc]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#eeebe3]" />
                <div className="mt-8 h-12 animate-pulse rounded-xl bg-[#eeebe3]" />
                <div className="h-12 animate-pulse rounded-xl bg-[#eeebe3]" />
              </div>
            ) : step ? (
              <div key={step.id} className={dir === "fwd" ? "animate-step-fwd" : "animate-step-back"}>
                <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-balance sm:text-[38px]">{stepTitle}</h1>
                {step.description && <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{resolve(step.description, answers)}</p>}
                <form
                  className="mt-8 grid gap-x-4 gap-y-6 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    next();
                  }}
                  noValidate
                >
                  {visibleFields(step, answers).map((f, i) => (
                    <Field
                      key={f.id}
                      field={f}
                      value={answers[f.id] ?? ""}
                      error={errors[f.id]}
                      regions={locale.regions}
                      onChange={(v) => {
                        set(f.id, v);
                        setActive(f.id);
                      }}
                      onFocus={() => setActive(f.id)}
                      onEnter={next}
                      autoFocus={i === 0 && stepIndex > 0}
                    />
                  ))}
                </form>
                {stepWarnings.length > 0 && (
                  <div className="mt-6">
                    <Warnings items={stepWarnings} />
                  </div>
                )}
                <div className="mt-10 hidden items-center gap-3 lg:flex">
                  {stepIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => goTo(stepIndex - 1)}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-white hover:text-ink"
                    >
                      <Icon name="arrowLeft" className="size-4" /> {t.wizard.back}
                    </button>
                  )}
                  <span className="ml-auto hidden text-xs text-muted xl:inline">
                    {t.wizard.orPress} <kbd className="rounded-md border border-line bg-white px-1.5 py-0.5 font-sans shadow-[0_1px_0_#e6e2d9]">Enter ↵</kbd>
                  </span>
                  <button
                    type="button"
                    onClick={next}
                    className="group ml-auto inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(20,23,31,0.6)] transition hover:-translate-y-px hover:bg-black active:translate-y-0 xl:ml-0"
                  >
                    {primaryLabel} <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className={dir === "fwd" ? "animate-step-fwd" : "animate-step-back"}>
                <Review
                  answers={answers}
                  steps={steps}
                  missing={missing.map((m) => ({ stepId: m.step.id, label: m.field.label }))}
                  warnings={warnings}
                  onEdit={(i) => goTo(i)}
                  price={price}
                  paying={paying}
                  payError={payError}
                  purchase={purchase}
                  slug={slug}
                  onPay={pay}
                  regions={locale.regions}
                />
              </div>
            )}

            {hydrated && (
              <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-5 text-[12.5px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="lock" className="size-3.5" /> {t.wizard.staysOnDevice}
                </span>
                <button type="button" onClick={startOver} className="inline-flex shrink-0 items-center gap-1 transition hover:text-ink">
                  <Icon name="refresh" className="size-3.5" /> {t.wizard.startOver}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Live preview (desktop) */}
        <aside className="hidden border-l border-line bg-[#e9e5dc] lg:block lg:min-h-0" aria-label={t.wizard.preview}>
          <div ref={previewRef} className="relative h-full overflow-y-auto">
            <div className="sticky top-0 z-20 border-b border-[#ddd8cc] bg-[#e9e5dc]/90 px-8 py-3 backdrop-blur xl:px-14">
              <div className="mx-auto flex max-w-[680px] items-center gap-4 text-xs text-ink-soft">
                <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-50" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand" />
                  </span>
                  {t.wizard.livePreview}
                </span>
                <span className="ml-auto inline-flex items-center gap-2">
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-[#d6d0c2]">
                    <span className="block h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${done.pct}%` }} />
                  </span>
                  <span className="tabular-nums">{t.wizard.filled(done.filled, done.total)}</span>
                </span>
              </div>
            </div>
            <div className="px-8 pt-8 pb-16 xl:px-14">
              <div className="relative mx-auto max-w-[680px]">
                <div className="absolute inset-x-3 -bottom-2 h-full rounded-sm bg-white/60 shadow-sm" aria-hidden="true" />
                <div className="relative rounded-sm bg-white px-10 py-12 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_18px_50px_-18px_rgba(20,23,31,0.3)] xl:px-14 xl:py-16">
                  <DocPreview blocks={blocks} active={active} />
                </div>
              </div>
              <p className="mx-auto mt-6 max-w-[680px] text-center text-xs text-muted">
                {t.wizard.watermarkNote}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile action bar */}
      {hydrated && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-2">
            <button
              type="button"
              onClick={() => setMobilePreview(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-ink"
            >
              <Icon name="eye" className="size-4" /> {t.wizard.previewBtn}
              <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[11px] font-semibold text-brand-dark tabular-nums">{done.pct}%</span>
            </button>
            {stepIndex > 0 && (
              <button type="button" onClick={() => goTo(stepIndex - 1)} className="grid size-12 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-white" aria-label={t.wizard.back}>
                <Icon name="arrowLeft" className="size-5" />
              </button>
            )}
            {step && (
              <button type="button" onClick={next} className="ml-auto inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
                {primaryLabel} <Icon name="arrowRight" className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile preview sheet */}
      {mobilePreview && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label={t.wizard.preview}>
          <button type="button" className="animate-fade absolute inset-0 bg-ink/40" aria-label={t.wizard.closePreview} onClick={() => setMobilePreview(false)} />
          <div className="animate-sheet absolute inset-x-0 top-6 bottom-0 flex flex-col overflow-hidden rounded-t-3xl bg-[#e9e5dc] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[#ddd8cc] bg-paper px-5 py-3">
              <div>
                <p className="text-sm font-semibold">{template.name}</p>
                <p className="text-xs text-muted tabular-nums">{t.wizard.filled(done.filled, done.total)}</p>
              </div>
              <button type="button" onClick={() => setMobilePreview(false)} className="rounded-full bg-cream p-2" aria-label={t.wizard.closePreview}>
                <Icon name="x" className="size-4" />
              </button>
            </div>
            <div ref={mobilePreviewRef} className="flex-1 overflow-y-auto p-4">
              <div className="rounded-sm bg-white px-5 py-7 shadow">
                <DocPreview blocks={blocks} active={active} />
              </div>
            </div>
            <div className="border-t border-line bg-paper p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => setMobilePreview(false)} className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white">
                {t.wizard.backToQuestions}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function displayValue(f: FieldDef, v: string) {
  if (!v) return "";
  switch (f.type) {
    case "choice":
    case "select":
      return f.options?.find((o) => o.value === v)?.label ?? v;
    case "multi": {
      const n = v.split(",").filter(Boolean).length;
      return t.wizard.selected(n);
    }
    case "money":
      return formatMoney(v, LANG);
    case "date":
      return formatDate(v, LANG);
    default:
      return v;
  }
}

function Review(props: {
  answers: Answers;
  steps: ReturnType<typeof visibleSteps>;
  missing: { stepId: string; label: string }[];
  warnings: Warning[];
  onEdit: (i: number) => void;
  price: string;
  paying: boolean;
  payError: string;
  purchase: Purchase | null;
  slug: string;
  onPay: () => void;
  regions: string[];
}) {
  const { answers, steps, missing, warnings, onEdit, price, paying, payError, purchase, slug, onPay } = props;
  const blocked = warnings.some((w) => w.level === "block");
  const [agreed, setAgreed] = useState(false);
  const ready = missing.length === 0 && !blocked;
  return (
    <div className="animate-rise">
      <h1 className="font-serif text-[30px] leading-tight font-medium tracking-tight sm:text-[34px]">{t.wizard.reviewTitle}</h1>
      <p className="mt-2 text-[15px] text-ink-soft">{t.wizard.reviewLead}</p>

      {warnings.length > 0 && (
        <div className="mt-6">
          <Warnings items={warnings} />
        </div>
      )}

      {missing.length > 0 && (
        <div className="mt-6 rounded-xl border border-[#f3d9a4] bg-honey-soft p-4 text-sm">
          <p className="font-medium">{t.wizard.missing}</p>
          <ul className="mt-2 space-y-1">
            {missing.map((m) => (
              <li key={m.stepId + m.label}>
                <button type="button" className="text-left underline decoration-[#d9b45a] underline-offset-2 hover:text-brand" onClick={() => onEdit(steps.findIndex((s) => s.id === m.stepId))}>
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(20,23,31,0.25)]">
        {purchase ? (
          <>
            <p className="text-sm font-medium text-brand">{t.wizard.owned}</p>
            <p className="mt-1 text-sm text-ink-soft">{t.wizard.ownedText}</p>
            <Link
              href={`/create/${slug}/download?session_id=${encodeURIComponent(purchase.sessionId)}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition hover:bg-brand-dark"
            >
              <Icon name="download" className="size-4" /> {t.wizard.downloadUpdated}
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <p className="font-medium">{t.wizard.yourDoc}</p>
              <p>
                <span className="font-serif text-3xl font-medium">{price}</span>
                <span className="ml-1 text-sm text-muted">{t.doc.oneTime}</span>
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {t.wizard.perks.map((x) => (
                <li key={x} className="flex gap-2">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.4} />
                  {x}
                </li>
              ))}
            </ul>
            <label className="mt-5 flex cursor-pointer gap-3 rounded-xl border border-line bg-paper p-3.5 text-[13px] leading-relaxed text-ink-soft">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]"
              />
              <span>{t.wizard.agree}</span>
            </label>
            <button
              type="button"
              disabled={!ready || !agreed || paying}
              onClick={onPay}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying ? (
                t.wizard.opening
              ) : (
                <>
                  <Icon name="lock" className="size-4" /> {t.wizard.pay(price)}
                </>
              )}
            </button>
            {payError && <p className="mt-3 text-center text-sm text-[#b42318]">{payError}</p>}
            <p className="mt-3 text-center text-xs text-muted">{t.wizard.secure}</p>
          </>
        )}
      </div>
      <h2 className="mt-10 text-sm font-semibold">{t.wizard.yourAnswers}</h2>
      <div className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {steps.map((s, i) => {
          const rows = visibleFields(s, answers)
            .map((f) => ({ label: f.type === "choice" ? "" : f.label, value: displayValue(f, answers[f.id] ?? "") }))
            .filter((r) => r.value);
          return (
            <div key={s.id} className="flex gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{s.label}</p>
                <dl className="mt-1 space-y-0.5 text-[13px] text-ink-soft">
                  {rows.length ? (
                    rows.slice(0, 4).map((r) => (
                      <div key={r.label + r.value} className="flex gap-1.5">
                        {r.label && <dt className="shrink-0 text-muted">{r.label}:</dt>}
                        <dd className="truncate">{r.value.split("\n").join(", ")}</dd>
                      </div>
                    ))
                  ) : (
                    <dd className="text-muted italic">{t.wizard.notAnswered}</dd>
                  )}
                </dl>
              </div>
              <button type="button" onClick={() => onEdit(i)} className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg px-2 py-1 text-sm font-medium text-brand hover:bg-brand-soft">
                <Icon name="edit" className="size-3.5" /> {t.wizard.edit}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        {t.wizard.disclaimer}
      </p>
    </div>
  );
}
