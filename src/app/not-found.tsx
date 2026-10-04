import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-serif text-4xl font-medium">Page not found</h1>
        <p className="mt-3 text-ink-soft">That page doesn&apos;t exist. Maybe you were looking for a document?</p>
        <Link href="/documents" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">Browse documents</Link>
      </main>
    </>
  );
}
