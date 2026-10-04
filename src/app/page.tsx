import Link from "next/link";
import { getTemplate, getTemplates } from "@/content";
import { DocPreview } from "@/components/DocPreview";
import { Icon, type IconName } from "@/components/Icon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TemplateCard } from "@/components/TemplateCard";
import { formatPrice } from "@/lib/doc";
import { NDA_SAMPLE } from "@/lib/samples";
import { SITE } from "@/lib/site";

const FAQ = [
  {
    q: "Is it really a one-time payment?",
    a: "Yes. You pay once for the document you download. There is no trial, nothing renews, and there is no subscription to cancel. We don't even ask you to create an account.",
  },
  {
    q: "Can I see the document before I pay?",
    a: "Yes. The full document builds itself live as you answer, and you can read every word before paying. You only pay when you want the clean, print-ready PDF.",
  },
  {
    q: "What if I need to change something later?",
    a: `Edit your answers and download again for free for ${SITE.editDays} days after purchase, from the same browser. The PDF itself is yours forever.`,
  },
  {
    q: "Where are my answers stored?",
    a: "Only in your own browser. We don't keep a copy on our servers. Your PDF is generated when you download it and is not stored.",
  },
  {
    q: "Are these documents legally binding?",
    a: "Contracts like these are generally binding when the parties sign them, but laws differ by state and situation. Our templates are self-help documents, not legal advice. For anything complex or high-stakes, have an attorney review it.",
  },
  {
    q: "What if I'm not happy?",
    a: `Email ${SITE.supportEmail} within 14 days and we'll refund you. No forms, no questions.`,
  },
];

const COMPARE: { label: string; them: string; us: string }[] = [
  { label: "Price", them: "Trial that turns into $30–$40 every month", us: "$9–$19 once per document" },
  { label: "See the document before paying", them: "Often only after you sign up", us: "Yes, every word, live as you type" },
  { label: "Account required", them: "Yes", us: "No" },
  { label: "Something to cancel", them: "Yes, or you keep getting charged", us: "Nothing, ever" },
  { label: "Keep your document", them: "Access can end when you cancel", us: "The PDF is yours forever" },
];

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "edit", title: "Answer plain-English questions", text: "One simple question at a time. No legal jargon, no 40-field forms." },
  { icon: "eye", title: "Watch it write itself", text: "Your document updates live beside the questions, so you always know what you're signing." },
  { icon: "download", title: "Pay once, download", text: "Only if you're happy. Get a clean PDF, ready to print and sign." },
];

export default function Home() {
  const templates = getTemplates();
  const nda = getTemplate("non-disclosure-agreement")!;
  const prices = templates.map((t) => t.price);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(15,107,92,0.10),transparent_70%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft/70 px-3 py-1 text-[13px] font-medium text-brand-dark">
                <Icon name="sparkle" className="size-3.5" /> No subscription. No account. No surprises.
              </p>
              <h1 className="mt-5 font-serif text-[44px] leading-[1.05] font-medium tracking-tight text-balance sm:text-[60px]">
                Legal documents at one <em className="text-brand">honest</em> price.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
                Answer a few simple questions and watch your NDA, lease or contract write itself. Read every word for
                free. Pay once, from {formatPrice(Math.min(...prices))}, only when you want to download it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/documents" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-black">
                  Create a document <Icon name="arrowRight" className="size-4" />
                </Link>
                <Link href="#how" className="rounded-full px-5 py-3.5 font-medium text-ink-soft hover:bg-cream hover:text-ink">
                  How it works
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
                {["Free full preview", "Pay once, keep forever", "Ready in about 5 minutes"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Icon name="check" className="size-4 text-brand" strokeWidth={2.4} /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product visual: a question card on top of the live document */}
            <div className="relative mx-auto w-full max-w-[520px]" aria-hidden="true">
              <div className="relative h-[460px] overflow-hidden rounded-md bg-white px-9 py-10 shadow-[0_30px_70px_-30px_rgba(20,23,31,0.45)] ring-1 ring-ink/5 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:h-[520px]">
                <DocPreview blocks={nda.render(NDA_SAMPLE)} active="bName" watermark={false} small />
              </div>
              <div className="absolute -bottom-6 -left-4 w-[290px] rounded-2xl border border-line bg-paper/95 p-5 shadow-[0_24px_50px_-20px_rgba(20,23,31,0.4)] backdrop-blur sm:-left-12">
                <p className="text-xs font-medium text-muted">Step 3 of 7</p>
                <p className="mt-1 font-serif text-xl font-medium">Who is the second party?</p>
                <div className="mt-3 rounded-xl border border-brand bg-white px-3 py-2.5 text-sm ring-4 ring-brand/10">
                  Daniel Cho<span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-ink" />
                </div>
                <div className="mt-3 flex justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                    Continue <Icon name="arrowRight" className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section aria-label="Why people trust us" className="border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
            {(
              [
                { icon: "lock", title: "Private by design", text: "Answers stay in your browser" },
                { icon: "shield", title: "Secure checkout", text: "Payments handled by Stripe" },
                { icon: "refresh", title: "14-day refund", text: "No forms, no questions" },
                { icon: "file", title: "Yours forever", text: "Clean PDF, no watermark" },
              ] as { icon: IconName; title: string; text: string }[]
            ).map((x) => (
              <div key={x.title} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-cream text-brand">
                  <Icon name={x.icon} className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{x.title}</p>
                  <p className="text-[13px] text-muted">{x.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documents */}
        <section className="border-y border-line bg-white/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-4xl font-medium tracking-tight">Pick your document</h2>
                <p className="mt-2 text-ink-soft">The price you see is the price you pay. Nothing more.</p>
              </div>
              <Link href="/documents" className="text-sm font-medium text-brand hover:underline">
                All documents →
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <TemplateCard key={t.slug} t={t} />
              ))}
              <div className="flex flex-col justify-center rounded-2xl border border-dashed border-[#d7d2c5] p-6 text-sm text-ink-soft">
                <p className="font-semibold text-ink">More on the way</p>
                <p className="mt-1.5 leading-relaxed">Promissory notes, eviction notices, last wills and more. Missing something? Tell us.</p>
                <a href={`mailto:${SITE.supportEmail}?subject=Document%20request`} className="mt-4 font-medium text-brand hover:underline">
                  Request a document →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-xl font-serif text-4xl font-medium tracking-tight">From blank page to signed in three steps</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <div key={s.title} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-ink text-white">
                      <Icon name={s.icon} />
                    </span>
                    <span className="font-serif text-5xl font-medium text-line">{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / comparison */}
        <section id="pricing" className="scroll-mt-20 bg-ink py-24 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
              <div>
                <p className="text-sm font-medium text-honey">Pricing</p>
                <h2 className="mt-2 font-serif text-4xl font-medium tracking-tight text-balance">
                  You need one document, not a subscription.
                </h2>
                <p className="mt-4 leading-relaxed text-white/70">
                  Many legal-form sites hide the price until the end, then sign you up for a trial that quietly renews
                  every month. We think that&apos;s backwards. Here is every price we charge:
                </p>
                <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
                  {templates.map((t) => (
                    <li key={t.slug} className="flex items-center justify-between px-5 py-3.5 text-[15px]">
                      <Link href={`/documents/${t.slug}`} className="hover:underline">
                        {t.name}
                      </Link>
                      <span className="font-semibold">{formatPrice(t.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-2xl bg-white text-ink">
                <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-line bg-cream/70 text-sm font-semibold">
                  <div className="p-4" />
                  <div className="p-4 text-ink-soft">Typical legal-form sites</div>
                  <div className="flex items-center gap-1.5 p-4 text-brand">{SITE.name}</div>
                </div>
                {COMPARE.map((r) => (
                  <div key={r.label} className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-line text-sm last:border-0">
                    <div className="p-4 font-medium">{r.label}</div>
                    <div className="flex gap-2 p-4 text-ink-soft">
                      <Icon name="x" className="mt-0.5 size-4 shrink-0 text-[#c2410c]" />
                      {r.them}
                    </div>
                    <div className="flex gap-2 bg-brand-soft/40 p-4">
                      <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.4} />
                      {r.us}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <h2 className="font-serif text-4xl font-medium tracking-tight">Questions, answered</h2>
              <p className="mt-3 text-ink-soft">
                Something else? Email{" "}
                <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-brand underline">
                  {SITE.supportEmail}
                </a>
                . A real person replies.
              </p>
            </div>
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {FAQ.map((f) => (
                <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-cream text-ink-soft transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand px-8 py-14 text-center text-white sm:px-16">
            <h2 className="font-serif text-4xl font-medium tracking-tight text-balance">Your document, done in five minutes.</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">Start now. You won&apos;t be asked for a card or an email until you choose to download.</p>
            <Link href="/documents" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink shadow-sm hover:bg-paper">
              Create a document <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
