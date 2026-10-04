import Link from "next/link";
import { t } from "@/i18n";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/documents" className="rounded-lg px-3 py-2 text-ink-soft hover:bg-cream hover:text-ink">
            {t.nav.documents}
          </Link>
          <Link href="/#pricing" className="hidden rounded-lg px-3 py-2 text-ink-soft hover:bg-cream hover:text-ink sm:block">
            {t.nav.pricing}
          </Link>
          <Link href="/#faq" className="hidden rounded-lg px-3 py-2 text-ink-soft hover:bg-cream hover:text-ink sm:block">
            {t.nav.faq}
          </Link>
          <Link
            href="/documents"
            className="ml-2 rounded-full bg-ink px-4 py-2 font-medium text-white shadow-sm transition hover:bg-black"
          >
            {t.nav.create}
          </Link>
        </nav>
      </div>
    </header>
  );
}
