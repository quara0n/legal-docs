import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/content";
import { Icon } from "@/components/Icon";
import { KpiCalculator } from "@/components/KpiCalculator";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPrice } from "@/lib/doc";
import { getKpi, KPI_TABLE, latestMonth, monthLabel, regulate } from "@/lib/kpi";
import { t as tr } from "@/i18n";
import { LANG, MARKET } from "@/lib/market";
import { SITE } from "@/lib/site";

const PATH = "/verktoy/regulere-husleie";
const TITLE = "Regulere husleie etter KPI: gratis kalkulator og varselbrev";
const DESCRIPTION =
  "Regn ut ny husleie etter konsumprisindeksen med siste tall fra SSB, og last ned et ferdig varselbrev til leietaker. Gratis, uten registrering.";

export async function generateMetadata(): Promise<Metadata> {
  if (MARKET !== "no") return {};
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: PATH },
    openGraph: { title: TITLE, description: DESCRIPTION },
  };
}

const nb = (n: number) => n.toLocaleString("nb-NO");
const idx = (n: number) => n.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default async function RegulereHusleiePage() {
  if (MARKET !== "no") notFound();
  const series = await getKpi();
  const latest = latestMonth(series);
  const [y, m] = latest.split("-");
  const example = regulate(series, 12000, `${Number(y) - 1}-${m}`)!;
  const contract = getTemplate("husleiekontrakt");

  const faq = [
    {
      q: "Hvilken KPI skal jeg bruke?",
      a: `Bruk konsumprisindeksen i alt fra Statistisk sentralbyrå (tabell ${KPI_TABLE}). Sammenlign indeksen for måneden leien sist ble fastsatt med siste publiserte måned. SSB publiserer nye tall rundt den 10. hver måned. Siste tall her er fra ${monthLabel(latest)}.`,
    },
    {
      q: "Hvor ofte kan husleien reguleres?",
      a: "Tidligst ett år etter at leien sist ble fastsatt, og med minst én måneds skriftlig varsel (husleieloven § 4-2). Du kan ikke kreve regulering tilbake i tid.",
    },
    {
      q: "Kan leietaker kreve at leien går ned?",
      a: "Ja. Regelen gjelder begge veier: faller konsumprisindeksen, kan leietaker kreve leien satt ned på samme måte.",
    },
    {
      q: "Hva betyr «2025=100», og stemmer gamle tall fortsatt?",
      a: "SSB byttet basisår fra 2015 til 2025 i januar 2026, så indekstallene ser lavere ut enn før. Forholdet mellom to måneder er det samme, så den nye leien blir lik uansett hvilken serie du bruker, så lenge begge tallene er fra samme serie.",
    },
    {
      q: "Kan jeg øke leien mer enn KPI?",
      a: "Ikke ensidig gjennom KPI-regulering. Etter at leieforholdet har vart en stund, kan hver av partene kreve leien endret til gjengs leie etter egne regler i husleieloven § 4-3. Andre økninger må leietaker være enig i.",
    },
  ];

  const url = `${SITE.url}${PATH}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Kalkulator for regulering av husleie",
        url,
        description: DESCRIPTION,
        inLanguage: LANG,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "NOK" },
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-medium text-brand">Gratis verktøy</p>
        <h1 className="mt-2 font-serif text-[40px] leading-[1.08] font-medium tracking-tight text-ink sm:text-5xl">Regulere husleie etter KPI</h1>
        <p className="mt-5 text-lg text-ink-soft">
          Regn ut ny husleie med siste konsumprisindeks fra SSB ({monthLabel(latest)}), og last ned et ferdig varselbrev til leietaker. Gratis, uten konto.
        </p>

        <div className="mt-10">
          <KpiCalculator series={series} />
        </div>

        <article className="mt-14 leading-relaxed text-ink-soft [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-5">
          <h2>Slik regulerer du husleien</h2>
          <ol>
            <li>Finn måneden leien sist ble fastsatt: da kontrakten startet, eller da leien sist ble endret.</li>
            <li>Del siste publiserte KPI på KPI for den måneden, og gang med leien du har i dag.</li>
            <li>Send leietaker et skriftlig varsel med ny leie og datoen den gjelder fra.</li>
            <li>Ny leie gjelder tidligst én måned etter varselet, og tidligst ett år etter forrige fastsetting.</li>
          </ol>

          <h2>Regneeksempel</h2>
          <p>
            Leien var {nb(example.oldRent)} kr da den ble fastsatt i {monthLabel(example.from)}. KPI var da {idx(example.kpiFrom)}. Siste KPI ({monthLabel(example.to)}) er {idx(example.kpiTo)}.
          </p>
          <p>
            {idx(example.kpiTo)} / {idx(example.kpiFrom)} × {nb(example.oldRent)} kr = <strong className="text-ink">{nb(example.newRent)} kr</strong>, en endring på {nb(example.pct)} %.
          </p>

          <h2>Vanlige spørsmål</h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-white">
            {faq.map((f) => (
              <div key={f.q} className="p-6">
                <h3 className="font-semibold text-ink">{f.q}</h3>
                <p className="mt-2 mb-0!">{f.a}</p>
              </div>
            ))}
          </div>
        </article>

        {contract && (
          <aside className="my-12 rounded-2xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(20,23,31,0.35)]">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon name={contract.icon} className="size-5.5" />
              </span>
              <div>
                <p className="font-serif text-2xl font-medium text-ink">Ny leietaker?</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Lag husleiekontrakt med KPI-regulering, depositum og leietid etter husleieloven. Se hele kontrakten gratis før du betaler.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <p className="text-ink">
                <span className="font-serif text-3xl font-medium">{formatPrice(contract.price, LANG)}</span>{" "}
                <span className="text-sm text-muted">{tr.doc.oneTime}</span>
              </p>
              <Link
                href={`/documents/${contract.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                Lag husleiekontrakt <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </aside>
        )}
        <p className="text-xs text-muted">{tr.footer.legal}</p>
      </main>
      <SiteFooter />
    </>
  );
}
