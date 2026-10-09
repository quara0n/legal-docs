import Link from "next/link";
import { getTemplate, getTemplates } from "@/content";
import { DocPreview } from "@/components/DocPreview";
import { JourneyShowcase } from "@/components/JourneyShowcase";
import { Icon, type IconName } from "@/components/Icon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TemplateCard } from "@/components/TemplateCard";
import { formatPrice } from "@/lib/doc";
import { t } from "@/i18n";
import { LANG } from "@/lib/market";
import { HERO } from "@/lib/samples";
import { SITE } from "@/lib/site";

// Most-asked documents first. Matches the search campaign's keywords, not measured clicks.
const FRONT_ORDER = ["kjopekontrakt", "husleiekontrakt", "gjeldsbrev", "fullmakt", "fremleiekontrakt", "taushetserklaering", "oppdragsavtale"];

export default function Home() {
  const templates = [...getTemplates()].sort((a, b) => {
    const rank = (slug: string) => {
      const i = FRONT_ORDER.indexOf(slug);
      return i === -1 ? FRONT_ORDER.length : i;
    };
    return rank(a.slug) - rank(b.slug);
  });
  const hero = getTemplate(HERO.slug)!;
  const prices = templates.map((d) => d.price);
  const minPrice = formatPrice(Math.min(...prices), LANG);

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
                <Icon name="sparkle" className="size-3.5" /> {t.home.badge}
              </p>
              <h1 className="mt-5 font-serif text-[44px] leading-[1.05] font-medium tracking-tight text-balance sm:text-[60px]">
                {t.home.h1}
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">{t.home.lead(minPrice)}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/documents" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-black">
                  {t.home.cta} <Icon name="arrowRight" className="size-4" />
                </Link>
                <Link href="#how" className="rounded-full px-5 py-3.5 font-medium text-ink-soft hover:bg-cream hover:text-ink">
                  {t.home.how}
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
                {t.home.bullets.map((x) => (
                  <li key={x} className="flex items-center gap-1.5">
                    <Icon name="check" className="size-4 text-brand" strokeWidth={2.4} /> {x}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product visual: a question card on top of the live document */}
            <div className="relative mx-auto hidden w-full max-w-[520px] sm:block" aria-hidden="true">
              <div className="relative h-[460px] overflow-hidden rounded-md bg-white px-9 py-10 shadow-[0_30px_70px_-30px_rgba(20,23,31,0.45)] ring-1 ring-ink/5 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:h-[520px]">
                <DocPreview blocks={hero.render(HERO.answers)} active={HERO.active} watermark={false} small />
              </div>
              <div className="absolute -bottom-6 -left-4 w-[290px] rounded-2xl border border-line bg-paper/95 p-5 shadow-[0_24px_50px_-20px_rgba(20,23,31,0.4)] backdrop-blur sm:-left-12">
                <p className="text-xs font-medium text-muted">{t.home.heroStep}</p>
                <p className="mt-1 font-serif text-xl font-medium">{t.home.heroQuestion}</p>
                <div className="mt-3 rounded-xl border border-brand bg-white px-3 py-2.5 text-sm ring-4 ring-brand/10">
                  {t.home.heroAnswer}<span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-ink" />
                </div>
                <div className="mt-3 flex justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
                    {t.home.continue} <Icon name="arrowRight" className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section aria-label={t.home.trustLabel} className="border-t border-line bg-paper">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-4 px-4 py-6 sm:px-6 md:grid md:grid-cols-4 md:gap-6 md:py-8">
            {(t.home.trust as { icon: IconName; title: string; text: string }[]).map((x) => (
              <div key={x.title} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-cream text-brand">
                  <Icon name={x.icon} className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{x.title}</p>
                  <p className="hidden text-[13px] text-muted md:block">{x.text}</p>
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
                <h2 className="font-serif text-4xl font-medium tracking-tight">{t.home.pickTitle}</h2>
                <p className="mt-2 text-ink-soft">{t.home.pickLead}</p>
              </div>
              <Link href="/documents" className="text-sm font-medium text-brand hover:underline">
                {t.home.allDocs}
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((d) => (
                <TemplateCard key={d.slug} t={d} showCategory={false} />
              ))}
              <div className="flex flex-col justify-center rounded-2xl border border-dashed border-[#d7d2c5] p-6 text-sm text-ink-soft">
                <p className="font-semibold text-ink">{t.home.moreTitle}</p>
                <p className="mt-1.5 leading-relaxed">{t.home.moreText}</p>
                <a href={`mailto:${SITE.supportEmail}?subject=${encodeURIComponent(t.home.moreSubject)}`} className="mt-4 font-medium text-brand hover:underline">
                  {t.home.moreLink}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-brand">{t.home.howEyebrow}</p>
              <h2 className="mt-2 font-serif text-4xl font-medium tracking-tight text-balance sm:text-5xl">{t.home.howTitle}</h2>
              <p className="mt-4 text-ink-soft">{t.home.howLead}</p>
            </div>
            <div className="mt-14">
              <JourneyShowcase minPrice={minPrice} />
            </div>
          </div>
        </section>

        {/* Pricing / comparison */}
        <section id="pricing" className="scroll-mt-20 bg-ink py-24 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
              <div>
                <p className="text-sm font-medium text-honey">{t.home.pricingEyebrow}</p>
                <h2 className="mt-2 font-serif text-4xl font-medium tracking-tight text-balance">
                  {t.home.pricingTitle}
                </h2>
                <p className="mt-4 leading-relaxed text-white/70">{t.home.pricingLead}</p>
                <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
                  {templates.map((d) => (
                    <li key={d.slug} className="flex items-center justify-between px-5 py-3.5 text-[15px]">
                      <Link href={`/documents/${d.slug}`} className="hover:underline">
                        {d.name}
                      </Link>
                      <span className="font-semibold">{formatPrice(d.price, LANG)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-2xl bg-white text-ink">
                <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-line bg-cream/70 text-sm font-semibold">
                  <div className="p-4" />
                  <div className="p-4 text-ink-soft">{t.home.compareThem}</div>
                  <div className="flex items-center gap-1.5 p-4 text-brand">{SITE.name}</div>
                </div>
                {t.home.compare.map((r) => (
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
              <h2 className="font-serif text-4xl font-medium tracking-tight">{t.home.faqTitle}</h2>
              <p className="mt-3 text-ink-soft">{t.home.faqLead}</p>
            </div>
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {t.home.faq.map((f) => (
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
            <h2 className="font-serif text-4xl font-medium tracking-tight text-balance">{t.home.finalTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">{t.home.finalLead}</p>
            <Link href="/documents" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink shadow-sm hover:bg-paper">
              {t.home.cta} <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
