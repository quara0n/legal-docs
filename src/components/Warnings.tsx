import type { Warning } from "@/lib/doc";

export function Warnings({ items }: { items: Warning[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-2.5" role="status">
      {items.map((w) => (
        <div
          key={w.text}
          className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${
            w.level === "block" ? "border-[#f5c2c0] bg-[#fdf0ef] text-[#7a1d17]" : "border-[#f3d9a4] bg-honey-soft text-ink"
          }`}
        >
          <svg viewBox="0 0 20 20" className={`mt-0.5 size-4 shrink-0 ${w.level === "block" ? "text-[#b42318]" : "text-[#a16207]"}`} fill="currentColor" aria-hidden="true">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-.9 4h1.8v5.2H9.1V6zm.9 8.4a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
          </svg>
          <p>{w.text}</p>
        </div>
      ))}
    </div>
  );
}
