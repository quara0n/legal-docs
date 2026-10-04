import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate, getTemplates } from "@/content";
import { DocPreview } from "@/components/DocPreview";
import { Icon } from "@/components/Icon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TemplateCard } from "@/components/TemplateCard";
import { formatPrice, withDefaults } from "@/lib/doc";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getTemplates().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/documents/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getTemplate(slug);
  if (!t) return {};
  return {
    title: { absolute: t.seo.title },
    description: t.seo.description,
    alternates: { canonical: `/documents/${t.slug}` },
    openGraph: { title: t.seo.title, description: t.seo.description },
  };
}

export default async function TemplatePage(props: PageProps<"/documents/[slug]">) {
  const { slug } = await props.params;
  const t = getTemplate(slug);
  if (!t) notFound();
  const others = getTemplates().filter((o) => o.slug !== t.slug).slice(0, 3);
  const price = formatPrice(t.price);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: t.name,
        description: t.seo.description,
        brand: { "@type": "Brand", name: SITE.name },
        offers: { "@type": "Offer", price: (t.price / 100).toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE.url}/documents/${t.slug}` },
      },
      {
        "@type": "FAQPage",
        mainEntity: t.seo.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:pt-16">
          <div>
            <nav className="text-sm text-muted" aria-label="Breadcrumb">
              <Link href="/documents" className="hover:text-ink">Documents</Link> <span className="mx-1">/</span> {t.shortName}
            </nav>
            <h1 className="mt-4 font-serif text-[40px] leading-[1.08] font-medium tracking-tight sm:text-5xl">{t.name} template</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t.seo.intro}</p>

            <div className="mt-8 rounded-2xl border border-line bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-4xl font-medium">
                    {price} <span className="font-sans text-base font-normal text-muted">one-time</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">Takes about {t.minutes} minutes</p>
                </div>
                <Link href={`/create/${t.slug}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-black">
                  Start my {t.shortName} <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
              <ul className="mt-5 grid gap-2 border-t border-line pt-5 text-sm text-ink-soft sm:grid-cols-2">
                {["Free preview, pay to download", "No subscription or account", `Free edits for ${SITE.editDays} days`, "Print-ready PDF"].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-brand" strokeWidth={2.4} /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="h-[560px] overflow-hidden rounded-md bg-white px-10 py-12 shadow-[0_30px_70px_-30px_rgba(20,23,31,0.45)] ring-1 ring-ink/5 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]">
              <DocPreview blocks={t.render(withDefaults(t, {}))} />
            </div>
            <p className="absolute right-0 -bottom-2 left-0 text-center text-sm text-muted">
              The highlighted parts are filled in from your answers.
            </p>
          </div>
        </section>

        <section className="border-y border-line bg-white/60 py-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl font-medium tracking-tight">When to use a {t.shortName}</h2>
              <ul className="mt-6 space-y-3">
                {t.seo.whenToUse.map((x) => (
                  <li key={x} className="flex gap-3 text-ink-soft">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-medium tracking-tight">What&apos;s included</h2>
              <ul className="mt-6 space-y-3">
                {t.seo.includes.map((x) => (
                  <li key={x} className="flex gap-3 text-ink-soft">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={2.2} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="font-serif text-3xl font-medium tracking-tight">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
            {t.seo.faq.map((f) => (
              <div key={f.q} className="p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={`/create/${t.slug}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-brand-dark">
              Create my {t.shortName} for {price} <Icon name="arrowRight" className="size-4" />
            </Link>
            <p className="mt-3 text-xs text-muted">Not legal advice. Laws vary by state.</p>
          </div>
        </section>

        <section className="border-t border-line py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-serif text-2xl font-medium tracking-tight">Other documents</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <TemplateCard key={o.slug} t={o} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
