import Link from "next/link";
import { t } from "@/i18n";
import { SITE } from "@/lib/site";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const PAGES = [
  { href: "/terms", label: t.legalNav.terms },
  { href: "/privacy", label: t.legalNav.privacy },
  { href: "/refunds", label: t.legalNav.refunds },
  { href: "/disclaimer", label: t.legalNav.disclaimer },
];

export function LegalPage({ title, intro, current, children }: { title: string; intro: string; current: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[220px_1fr] lg:py-20">
        <nav aria-label={t.legalNav.label} className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-2 text-sm lg:flex-col lg:gap-1">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={p.href === current ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2 transition ${p.href === current ? "bg-ink font-medium text-white" : "text-ink-soft hover:bg-cream hover:text-ink"}`}
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-2xl leading-relaxed text-ink-soft [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-ink [&_li]:mb-1.5 [&_p]:mb-4 [&_strong]:text-ink [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg">{intro}</p>
          <p className="mt-2 text-sm text-muted">{t.legalNav.updated(SITE.legalUpdated)}</p>
          <div className="mt-8">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
