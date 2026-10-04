import type { Metadata } from "next";
import { getTemplates } from "@/content";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TemplateCard } from "@/components/TemplateCard";
import { t } from "@/i18n";

export const metadata: Metadata = {
  title: t.meta.docsTitle,
  description: t.meta.docsDescription,
  alternates: { canonical: "/documents" },
};

export default function DocumentsPage() {
  const templates = getTemplates();
  const categories = Array.from(new Set(templates.map((d) => d.category)));
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-serif text-5xl font-medium tracking-tight">{t.docs.title}</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">{t.docs.lead}</p>
        {categories.map((cat) => (
          <section key={cat} className="mt-14">
            <h2 className="text-sm font-semibold tracking-wider text-muted uppercase">{t.categories[cat] ?? cat}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templates
                .filter((d) => d.category === cat)
                .map((d) => (
                  <TemplateCard key={d.slug} t={d} />
                ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
