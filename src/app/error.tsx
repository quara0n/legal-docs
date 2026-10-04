"use client";

import Link from "next/link";
import { t } from "@/i18n";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-brand">{t.error.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl font-medium">{t.error.title}</h1>
      <p className="mt-3 text-ink-soft">{t.error.text}</p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="rounded-full bg-ink px-6 py-3 font-semibold text-white">
          {t.error.tryAgain}
        </button>
        <Link href="/" className="rounded-full border border-line bg-white px-6 py-3 font-semibold">
          {t.error.home}
        </Link>
      </div>
    </main>
  );
}
