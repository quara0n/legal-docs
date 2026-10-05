import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/content";
import { getGuides } from "@/content/guides";
import { Icon } from "@/components/Icon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MARKET } from "@/lib/market";

const TITLE = "Guider: leiekontrakt, kjøpekontrakt, gjeldsbrev og mer";
const DESCRIPTION =
  "Enkle guider om husleiekontrakt, fremleie, bilsalg, gjeldsbrev, fullmakt, oppdragsavtale og taushetserklæring. Hva bør stå i avtalen, og hva sier loven?";

export async function generateMetadata(): Promise<Metadata> {
  if (MARKET !== "no") return {};
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: "/guide" },
    openGraph: { title: TITLE, description: DESCRIPTION },
  };
}

export default function GuideIndexPage() {
  if (MARKET !== "no") notFound();
  const guides = getGuides();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-serif text-5xl font-medium tracking-tight">Guider</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Enkle forklaringer på vanlige avtaler mellom privatpersoner og små bedrifter: hva avtalen bør inneholde, hvilke regler som gjelder, og hva du bør passe på. Generell informasjon, ikke juridisk rådgivning.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => {
            const t = getTemplate(g.template);
            return (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_18px_40px_-20px_rgba(20,23,31,0.3)]"
              >
                {t && (
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon name={t.icon} className="size-5.5" />
                  </span>
                )}
                <h2 className="mt-5 text-lg font-semibold tracking-tight">{g.h1}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">{g.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 border-t border-line pt-4 text-sm font-medium text-brand">
                  Les guiden <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
