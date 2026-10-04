"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLocale, getTemplate } from "@/content";
import {
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
} from "@/lib/doc";
import { SITE } from "@/lib/site";
import { clearDraft, loadDraft, loadPurchase, saveDraft, type Purchase } from "@/lib/storage";
import { DocPreview } from "./DocPreview";
import { Field } from "./Field";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Wizard({ slug }: { slug: string }) {
  const template = getTemplate(slug)!;
  const locale = getLocale(template.locale);
  const [answers, setAnswers] = useState<Answers>(() => withDefaults(template, {}));
  const [rawStep, setStepIndex] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
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
  const progress = Math.round(((Math.min(stepIndex, reviewIndex) + (isReview ? 1 : 0)) / totalSteps) * 100);

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
    setStepIndex(i);
    setErrors({});
    setActive(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    if (!step) return;
    const errs: Record<string, string> = {};
    for (const f of visibleFields(step, answers)) if (f.required && !(answers[f.id] ?? "").trim()) errs[f.id] = "This one is needed for your document.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    goTo(stepIndex + 1);
  };

  const missing = missingRequired(template, answers);

  const pay = async () => {
    setPaying(true);
    setPayError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout is unavailable right now.");
      window.location.href = data.url;
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Something went wrong.");
      setPaying(false);
    }
  };

  const startOver = () => {
    if (!window.confirm("Clear all answers and start over?")) return;
    clearDraft(slug);
    setAnswers(withDefaults(template, {}));
    goTo(0);
  };

  const price = formatPrice(template.price);

  return (
    <div className="flex min-h-screen flex-col bg-cream/50 lg:h-screen lg:overflow-hidden">
      {/* Top bar */}
      <header className="z-20 shrink-0 border-b border-line bg-paper">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <Logo />
          <span className="hidden h-5 w-px bg-line sm:block" />
          <span className="hidden truncate text-sm font-medium text-ink-soft sm:block">{template.name}</span>
          <span
            className="hidden items-center gap-1 text-xs text-muted md:flex">
            <Icon name="check" className="size-3.5" /> Saved in this browser
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark sm:inline">
              {price} one-time · pay only to download
            </span>
            <Link href={`/documents/${slug}`} className="rounded-lg p-2 text-muted hover:bg-cream hover:text-ink" aria-label="Close editor">
              <Icon name="x" />
            </Link>
          </div>
        </div>
        <div className="h-1 bg-line/60">
          <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[minmax(420px,1fr)_minmax(0,1.15fr)]">
        {/* Form */}
        <main className="lg:overflow-y-auto" aria-label="Questions">
          <div ref={formTopRef} className="mx-auto w-full max-w-xl px-5 pt-8 pb-32 sm:px-8 lg:pt-12">
            <div className="mb-6 flex items-center justify-between text-[13px] text-muted">
              <span>
                {isReview ? "Last step" : `Step ${stepIndex + 1} of ${totalSteps}`}
                <span className="text-brand-dark sm:hidden"> · {price} once, pay only to download</span>
              </span>
              <span className="flex items-center gap-1">
                <Icon name="clock" className="size-3.5" /> About {template.minutes} min
              </span>
            </div>

            {!hydrated ? (
              <div className="h-64 animate-pulse rounded-2xl bg-line/40" />
            ) : step ? (
              <div key={step.id} className="animate-rise">
                <h1 className="font-serif text-[30px] leading-tight font-medium tracking-tight sm:text-[34px]">{resolve(step.title, answers)}</h1>
                {step.description && <p className="mt-2 text-[15px] text-ink-soft">{resolve(step.description, answers)}</p>}
                <form
                  className="mt-7 grid gap-5 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    next();
                  }}
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
                <div className="mt-9 flex items-center gap-3">
                  {stepIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => goTo(stepIndex - 1)}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-medium text-ink-soft hover:bg-white hover:text-ink"
                    >
                      <Icon name="arrowLeft" className="size-4" /> Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={next}
                    className="ml-auto inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black focus-visible:ring-4 focus-visible:ring-ink/20 focus-visible:outline-none"
                  >
                    {stepIndex === reviewIndex - 1 ? "Review document" : "Continue"} <Icon name="arrowRight" className="size-4" />
                  </button>
                </div>
                <p className="mt-4 text-right text-xs text-muted">
                  Press <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-sans">Enter ↵</kbd> to continue
                </p>
              </div>
            ) : (
              <Review
                answers={answers}
                steps={steps}
                missing={missing.map((m) => ({ stepId: m.step.id, label: m.field.label }))}
                onEdit={(i) => goTo(i)}
                price={price}
                paying={paying}
                payError={payError}
                purchase={purchase}
                slug={slug}
                onPay={pay}
                regions={locale.regions}
              />
            )}

            {hydrated && (
              <div className="mt-14 flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-line pt-5 text-[13px]">
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`rounded-full px-2.5 py-1 transition ${i === stepIndex ? "bg-ink text-white" : i < stepIndex ? "text-ink-soft hover:bg-white" : "text-muted hover:bg-white"}`}
                  >
                    {i + 1}. {s.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goTo(reviewIndex)}
                  className={`rounded-full px-2.5 py-1 transition ${isReview ? "bg-ink text-white" : "text-muted hover:bg-white"}`}
                >
                  {reviewIndex + 1}. Review
                </button>
                <button type="button" onClick={startOver} className="ml-auto inline-flex items-center gap-1 text-muted hover:text-ink">
                  <Icon name="refresh" className="size-3.5" /> Start over
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Live preview (desktop) */}
        <aside className="hidden border-l border-line bg-[#ece8df] lg:block lg:min-h-0" aria-label="Document preview">
          <div ref={previewRef} className="h-full overflow-y-auto px-8 py-10 xl:px-14">
            <div className="mx-auto mb-3 flex max-w-[680px] items-center justify-between text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand" />
                </span>
                Live preview
              </span>
              <span>Your PDF has no watermark</span>
            </div>
            <div className="mx-auto max-w-[680px] rounded-sm bg-white px-10 py-12 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_40px_-12px_rgba(20,23,31,0.25)] xl:px-14 xl:py-16">
              <DocPreview blocks={blocks} active={active} />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile preview */}
      <button
        type="button"
        onClick={() => setMobilePreview(true)}
        className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg lg:hidden"
      >
        <Icon name="eye" className="size-4" /> Preview
      </button>
      {mobilePreview && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#ece8df] lg:hidden" role="dialog" aria-modal="true" aria-label="Document preview">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-paper px-4">
            <span className="font-medium">{template.name}</span>
            <button type="button" onClick={() => setMobilePreview(false)} className="rounded-lg p-2 hover:bg-cream" aria-label="Close preview">
              <Icon name="x" />
            </button>
          </div>
          <div ref={mobilePreviewRef} className="flex-1 overflow-y-auto p-4">
            <div className="rounded-sm bg-white px-5 py-7 shadow">
              <DocPreview blocks={blocks} active={active} />
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
      return `${n} selected`;
    }
    case "money":
      return formatMoney(v);
    case "date":
      return formatDate(v);
    default:
      return v;
  }
}

function Review(props: {
  answers: Answers;
  steps: ReturnType<typeof visibleSteps>;
  missing: { stepId: string; label: string }[];
  onEdit: (i: number) => void;
  price: string;
  paying: boolean;
  payError: string;
  purchase: Purchase | null;
  slug: string;
  onPay: () => void;
  regions: string[];
}) {
  const { answers, steps, missing, onEdit, price, paying, payError, purchase, slug, onPay } = props;
  const ready = missing.length === 0;
  return (
    <div className="animate-rise">
      <h1 className="font-serif text-[30px] leading-tight font-medium tracking-tight sm:text-[34px]">Review and download</h1>
      <p className="mt-2 text-[15px] text-ink-soft">Check your answers against the preview. You can still change anything.</p>

      {!ready && (
        <div className="mt-6 rounded-xl border border-[#f3d9a4] bg-honey-soft p-4 text-sm">
          <p className="font-medium">A few answers are still missing:</p>
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
            <p className="text-sm font-medium text-brand">You already own this document</p>
            <p className="mt-1 text-sm text-ink-soft">Edits and re-downloads are free for {SITE.editDays} days after purchase.</p>
            <Link
              href={`/create/${slug}/download?session_id=${encodeURIComponent(purchase.sessionId)}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition hover:bg-brand-dark"
            >
              <Icon name="download" className="size-4" /> Download updated PDF
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <p className="font-medium">Your document</p>
              <p>
                <span className="font-serif text-3xl font-medium">{price}</span>
                <span className="ml-1 text-sm text-muted">one-time</span>
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {[
                "Print-ready PDF, no watermark, no branding",
                `Free edits and re-downloads for ${SITE.editDays} days`,
                "No subscription, nothing renews, no account needed",
                "Not happy? Full refund within 14 days, just email us",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.4} />
                  {t}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={!ready || paying}
              onClick={onPay}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying ? (
                "Opening secure checkout…"
              ) : (
                <>
                  <Icon name="lock" className="size-4" /> Pay {price} and download
                </>
              )}
            </button>
            {payError && <p className="mt-3 text-center text-sm text-[#b42318]">{payError}</p>}
            <p className="mt-3 text-center text-xs text-muted">Secure payment by Stripe. Card, Apple Pay and Google Pay.</p>
          </>
        )}
      </div>
      <h2 className="mt-10 text-sm font-semibold">Your answers</h2>
      <div className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {steps.map((s, i) => {
          const rows = visibleFields(s, answers)
            .map((f) => ({ label: f.label, value: displayValue(f, answers[f.id] ?? "") }))
            .filter((r) => r.value);
          return (
            <div key={s.id} className="flex gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{s.label}</p>
                <dl className="mt-1 space-y-0.5 text-[13px] text-ink-soft">
                  {rows.length ? (
                    rows.slice(0, 4).map((r) => (
                      <div key={r.label} className="flex gap-1.5">
                        <dt className="shrink-0 text-muted">{r.label}:</dt>
                        <dd className="truncate">{r.value.split("\n").join(", ")}</dd>
                      </div>
                    ))
                  ) : (
                    <dd className="text-muted italic">Not answered yet</dd>
                  )}
                </dl>
              </div>
              <button type="button" onClick={() => onEdit(i)} className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg px-2 py-1 text-sm font-medium text-brand hover:bg-brand-soft">
                <Icon name="edit" className="size-3.5" /> Edit
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        {SITE.name} provides self-help templates, not legal advice. Laws differ by state. For complex situations, consider
        having an attorney review your document.
      </p>
    </div>
  );
}
