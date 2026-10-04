import type { Metadata } from "next";
import { getTemplates } from "@/content";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TemplateCard } from "@/components/TemplateCard";

export const metadata: Metadata = {
  title: "Legal document templates",
  description: "NDA, residential lease, bill of sale, freelance contract and power of attorney templates. Preview free, pay once per document.",
  alternates: { canonical: "/documents" },
};

export default function DocumentsPage() {
  const templates = getTemplates();
  const categories = Array.from(new Set(templates.map((t) => t.category)));
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-serif text-5xl font-medium tracking-tight">Documents</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Choose a document to start. You&apos;ll see it take shape as you answer, and pay only if you download.
        </p>
        {categories.map((cat) => (
          <section key={cat} className="mt-14">
            <h2 className="text-sm font-semibold tracking-wider text-muted uppercase">{cat}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templates
                .filter((t) => t.category === cat)
                .map((t) => (
                  <TemplateCard key={t.slug} t={t} />
                ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
