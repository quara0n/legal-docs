"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getTemplate } from "@/content";
import { withDefaults, type Answers } from "@/lib/doc";
import { SITE } from "@/lib/site";
import { loadDraft, savePurchase } from "@/lib/storage";
import { DocPreview } from "./DocPreview";
import { Icon } from "./Icon";

type State = { kind: "loading" } | { kind: "ready"; url: string } | { kind: "no-answers" } | { kind: "error"; message: string };

export function DownloadClient({ slug }: { slug: string }) {
  const template = getTemplate(slug)!;
  const sessionId = useSearchParams().get("session_id") ?? "";
  const [state, setState] = useState<State>({ kind: "loading" });
  const [answers, setAnswers] = useState<Answers | null>(null);
  const started = useRef(false);

  const generate = useCallback(async (a: Answers, autoSave: boolean) => {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, sessionId, answers: a }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "We couldn't create your PDF.");
      }
      const url = URL.createObjectURL(await res.blob());
      setState({ kind: "ready", url });
      if (autoSave) triggerDownload(url, slug);
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Something went wrong." });
    }
  }, [slug, sessionId]);

  // Runs once after mount: browser storage isn't available during prerender.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!sessionId) {
      setState({ kind: "error", message: "This link is missing its purchase reference." });
      return;
    }
    savePurchase(slug, sessionId);
    const draft = loadDraft(slug);
    if (!draft) {
      setState({ kind: "no-answers" });
      return;
    }
    const a = withDefaults(template, draft.answers);
    setAnswers(a);
    generate(a, true);
  }, [slug, sessionId, template, generate]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div>
          {state.kind === "error" ? (
            <>
              <div className="grid size-12 place-items-center rounded-full bg-[#fde8e7] text-[#b42318]">
                <Icon name="x" />
              </div>
              <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight">We hit a snag</h1>
              <p className="mt-3 text-ink-soft">{state.message}</p>
              <p className="mt-3 text-sm text-ink-soft">
                If you were charged, email <a className="font-medium text-brand underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> and we will sort it out the same day.
              </p>
              {answers && (
                <button onClick={() => generate(answers, true)} className="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-white">
                  Try again
                </button>
              )}
            </>
          ) : state.kind === "no-answers" ? (
            <>
              <div className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
                <Icon name="check" />
              </div>
              <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight">Payment received</h1>
              <p className="mt-3 text-ink-soft">
                Your answers are saved only in the browser you filled them in, and we can&apos;t find them here. Open this
                page in that browser, or fill in the form again: your purchase covers it for {SITE.editDays} days.
              </p>
              <Link href={`/create/${slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white">
                Fill in the form <Icon name="arrowRight" className="size-4" />
              </Link>
            </>
          ) : (
            <>
              <ol className="flex items-center" aria-label="Your progress">
                {["Answered", "Reviewed", "Paid", "Ready"].map((label, i, all) => (
                  <li key={label} className="flex items-center">
                    <span className="flex flex-col items-center gap-1.5">
                      <span
                        className={`animate-pop grid size-9 place-items-center rounded-full ${i === all.length - 1 ? "bg-ink text-mint ring-4 ring-mint/30" : "bg-brand text-white"}`}
                        style={{ animationDelay: `${i * 120}ms` }}
                      >
                        <Icon name="check" className="size-4" strokeWidth={3} />
                      </span>
                      <span className="text-[11px] font-semibold text-ink-soft">{label}</span>
                    </span>
                    {i < all.length - 1 && <span className="mx-1.5 mb-5 h-0.5 w-8 rounded-full bg-brand sm:w-12" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
              <h1 className="mt-7 font-serif text-4xl font-medium tracking-tight sm:text-5xl">Your {template.shortName} is ready</h1>
              <p className="mt-3 text-lg text-ink-soft">Thanks for your purchase. It&apos;s yours to keep, with no subscription and nothing to cancel.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {state.kind === "ready" ? (
                  <a
                    href={state.url}
                    download={`${slug}.pdf`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-brand-dark"
                  >
                    <Icon name="download" className="size-4" /> Download PDF
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand/70 px-6 py-3.5 font-semibold text-white">Preparing your PDF…</span>
                )}
                <Link href={`/create/${slug}?step=review`} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 font-semibold hover:border-ink/30">
                  <Icon name="edit" className="size-4" /> Edit answers
                </Link>
              </div>
              <div className="mt-10 rounded-2xl border border-line bg-white p-6">
                <h2 className="font-medium">What to do next</h2>
                <ol className="mt-3 space-y-3 text-sm text-ink-soft">
                  <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cream text-xs font-semibold text-ink">1</span>Read it through once more and make sure every name and number is right.</li>
                  <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cream text-xs font-semibold text-ink">2</span>Print it, or sign it electronically. Every party signs and keeps a copy.</li>
                  <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cream text-xs font-semibold text-ink">3</span>If it has a notary section, sign that part in front of a notary.</li>
                  <li className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cream text-xs font-semibold text-ink">4</span>Need a change? Edit and download again free for {SITE.editDays} days, from this browser.</li>
                </ol>
              </div>
            </>
          )}
        </div>
        {answers && state.kind !== "error" && (
          <div className="hidden max-h-[640px] overflow-hidden rounded-sm bg-white px-10 py-12 shadow-[0_12px_40px_-12px_rgba(20,23,31,0.25)] lg:block [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
            <DocPreview blocks={template.render(answers)} watermark={false} />
          </div>
        )}
      </div>
    </main>
  );
}

function triggerDownload(url: string, slug: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
