"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-brand">Something went wrong</p>
      <h1 className="mt-2 font-serif text-4xl font-medium">That didn&apos;t work</h1>
      <p className="mt-3 text-ink-soft">
        Your answers are still saved in this browser. Try again, and if it keeps happening email{" "}
        <a className="font-medium text-brand underline" href={`mailto:${SITE.supportEmail}`}>
          {SITE.supportEmail}
        </a>
        .
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="rounded-full bg-ink px-6 py-3 font-semibold text-white">
          Try again
        </button>
        <Link href="/" className="rounded-full border border-line bg-white px-6 py-3 font-semibold">
          Home
        </Link>
      </div>
    </main>
  );
}
