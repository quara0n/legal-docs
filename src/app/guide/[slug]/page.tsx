import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/content";
import { getGuide, getGuides, type Guide, type GuideBlock } from "@/content/guides";
import { Icon } from "@/components/Icon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDate, formatPrice, type Template } from "@/lib/doc";
import { t as tr } from "@/i18n";
import { LANG, MARKET } from "@/lib/market";
import { SITE } from "@/lib/site";

// Only the guides listed in the content are pages; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/guide/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: { absolute: g.title },
    description: g.description,
    alternates: { canonical: `/guide/${g.slug}` },
    openGraph: { type: "article", title: g.title, description: g.description, publishedTime: g.published, modifiedTime: g.updated },
  };
}

function Block({ b }: { b: GuideBlock }) {
  if (typeof b === "string") return <p>{b}</p>;
  const items = b.list.map((x) => <li key={x}>{x}</li>);
  return b.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
}

function GuideCta({ g, t }: { g: Guide; t: Template }) {
  return (
    <aside className="my-10 rounded-2xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(20,23,31,0.35)]">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon name={t.icon} className="size-5.5" />
        </span>
        <div>
          <p className="font-serif text-2xl font-medium text-ink">{t.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{g.cta}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="text-ink">
          <span className="font-serif text-3xl font-medium">{formatPrice(t.price, LANG)}</span>{" "}
          <span className="text-sm text-muted">{tr.doc.oneTime}</span>
        </p>
        <Link
          href={`/documents/${t.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white! no-underline! shadow-sm hover:bg-brand-dark"
        >
          Lag {t.shortName.toLowerCase()} <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </aside>
  );
}

export default async function GuidePage(props: PageProps<"/guide/[slug]">) {
  if (MARKET !== "no") notFound();
  const { slug } = await props.params;
  const g = getGuide(slug);
  if (!g) notFound();
  const t = getTemplate(g.template);
  if (!t) notFound();
  const related = g.related.map((s) => getGuide(s)).filter((x): x is Guide => !!x);
  const url = `${SITE.url}/guide/${g.slug}`;
  const words = [g.lead, ...g.sections.flatMap((s) => s.body.map((b) => (typeof b === "string" ? b : b.list.join(" "))))].join(" ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.h1,
        description: g.description,
        inLanguage: LANG,
        datePublished: g.published,
        dateModified: g.updated,
        mainEntityOfPage: url,
        url,
        author: { "@type": "Organization", name: SITE.name, url: SITE.url },
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` } },
      },
      {
        "@type": "FAQPage",
        mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Guider", item: `${SITE.url}/guide` },
          { "@type": "ListItem", position: 2, name: g.h1, item: url },
        ],
      },
    ],
  };

  // The call to action goes after the second section, then again at the end.
  const ctaAfter = Math.min(1, g.sections.length - 1);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/guide" className="hover:text-ink">Guider</Link> <span className="mx-1">/</span> {t.shortName}
        </nav>
        <article className="leading-relaxed text-ink-soft [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5">
          <h1 className="mt-4 font-serif text-[40px] leading-[1.08] font-medium tracking-tight text-ink sm:text-5xl">{g.h1}</h1>
          <p className="mt-5 text-lg">{g.lead}</p>
          <p className="mt-3 text-sm text-muted">
            Oppdatert {formatDate(g.updated, LANG)} · {minutes} min lesing
          </p>

          {g.sections.map((s, i) => (
            <section key={s.h2}>
              <h2>{s.h2}</h2>
              {s.body.map((b, j) => (
                <Block key={j} b={b} />
              ))}
              {i === ctaAfter && <GuideCta g={g} t={t} />}
            </section>
          ))}

          <section>
            <h2>Vanlige spørsmål</h2>
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {g.faq.map((f) => (
                <div key={f.q} className="p-6">
                  <h3 className="font-semibold text-ink">{f.q}</h3>
                  <p className="mt-2 mb-0!">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <GuideCta g={g} t={t} />
          <p className="text-xs text-muted">{tr.footer.legal}</p>
        </article>

        {related.length > 0 && (
          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-serif text-2xl font-medium tracking-tight">Les også</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/guide/${r.slug}`}
                  className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_18px_40px_-20px_rgba(20,23,31,0.3)]"
                >
                  <h3 className="font-semibold tracking-tight">{r.h1}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">{r.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                    Les guiden <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
