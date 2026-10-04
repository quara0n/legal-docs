import Link from "next/link";
import { SITE } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-semibold tracking-tight text-ink ${className}`}>
      <span className="grid size-7 place-items-center rounded-lg bg-brand text-white">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d="M7 4h10v16H7z M10 9h4 M10 13h4 M10 17h2" />
        </svg>
      </span>
      <span className="text-[17px]">{SITE.name}</span>
    </Link>
  );
}
