import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-serif text-4xl font-medium">{t.notFound.title}</h1>
        <p className="mt-3 text-ink-soft">{t.notFound.text}</p>
        <Link href="/documents" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">{t.notFound.browse}</Link>
      </main>
    </>
  );
}
