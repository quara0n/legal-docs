import { isSignatureLine, parseInline, type Block, type SigParty } from "@/lib/doc";
import { HTML_LANG } from "@/lib/market";

function Inline({ text, active }: { text: string; active?: string | null }) {
  return (
    <>
      {parseInline(text).map((s, i) => {
        const content = s.bold ? <strong>{s.text}</strong> : s.text;
        if (!s.field) return <span key={i}>{content}</span>;
        const cls = ["tok", s.empty ? "tok-empty" : "tok-filled", active === s.field ? "tok-active" : ""].join(" ");
        return (
          <span key={i} data-field={s.field} className={cls}>
            {s.empty ? `[${s.text}]` : content}
          </span>
        );
      })}
    </>
  );
}

function Party({ p, active }: { p: SigParty; active?: string | null }) {
  return (
    <div className="break-inside-avoid">
      <div className="text-[0.72em] font-bold tracking-wider">{p.heading}</div>
      <div className="mt-2 space-y-3">
        {p.lines.map((l, i) => (
          <div key={i} className={`flex items-end gap-2 text-[0.85em] ${l.value === undefined && isSignatureLine(l.label) ? "pt-5" : ""}`}>
            <span className="shrink-0 text-[#6b7280]">{l.label}:</span>
            <span className="min-h-[1.4em] flex-1 truncate border-b border-[#9ca3af] pb-0.5">
              {l.value !== undefined && <Inline text={l.value} active={active} />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocPreview({ blocks, active, watermark = true, small = false }: { blocks: Block[]; active?: string | null; watermark?: boolean; small?: boolean }) {
  let n = 0;
  return (
    <div className="relative">
      {watermark && <div className="watermark absolute inset-0 z-10" data-lang={HTML_LANG} />}
      <article className={`sheet relative select-none ${small ? "text-[11px]" : "text-[13.5px] sm:text-[14.5px]"}`}>
        {blocks.map((b, i) => {
          switch (b.type) {
            case "title":
              return (
                <h2 key={i} className="mb-5 text-center text-[1.55em] font-semibold leading-tight tracking-tight">
                  <Inline text={b.text} active={active} />
                </h2>
              );
            case "subtitle":
              return (
                <p key={i} className="-mt-3 mb-5 text-center text-[#6b7280]">
                  <Inline text={b.text} active={active} />
                </p>
              );
            case "heading":
              return (
                <h3 key={i} className="mt-5 mb-2 text-[0.8em] font-bold tracking-wider uppercase">
                  {b.text}
                </h3>
              );
            case "paragraph":
              return (
                <p key={i} className={`mb-3 whitespace-pre-line ${b.align === "center" ? "text-center" : ""}`}>
                  <Inline text={b.text} active={active} />
                </p>
              );
            case "list":
              return (
                <ul key={i} className="mb-3 ml-5 list-disc space-y-0.5">
                  {b.items.map((it, j) => (
                    <li key={j}>
                      <Inline text={it} active={active} />
                    </li>
                  ))}
                </ul>
              );
            case "clause": {
              n++;
              return (
                <section key={i} className="mb-3">
                  {b.paragraphs.map((p, j) => (
                    <p key={j} className="mb-2 whitespace-pre-line">
                      {j === 0 && (
                        <strong>
                          {n}. {b.title}.{" "}
                        </strong>
                      )}
                      <Inline text={p} active={active} />
                    </p>
                  ))}
                  {b.list && (
                    <ol className="mb-2 ml-6 list-[lower-alpha] space-y-1">
                      {b.list.map((it, j) => (
                        <li key={j} className="pl-1">
                          <Inline text={it} active={active} />
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              );
            }
            case "signatures":
              return (
                <section key={i} className="mt-6 mb-4">
                  {b.intro && (
                    <p className="mb-4">
                      <Inline text={b.intro} active={active} />
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    {b.parties.map((p, j) => (
                      <Party key={j} p={p} active={active} />
                    ))}
                  </div>
                </section>
              );
            case "notary":
              return (
                <section key={i} className="mt-6 border-t border-[#d1d5db] pt-4 text-[0.92em]">
                  <div className="mb-2 text-[0.8em] font-bold tracking-wider">NOTARY ACKNOWLEDGMENT</div>
                  <p className="mb-2">
                    State of {b.state ? <Inline text={b.state} active={active} /> : "________"}, County of ________
                  </p>
                  <p className="mb-2 text-[#4b5563]">
                    On ________, before me, ________, a Notary Public, personally appeared ________, known to me or
                    proved on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to
                    the within instrument, and acknowledged that they executed the same…
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <Party p={{ heading: "NOTARY PUBLIC", lines: [{ label: "Signature" }, { label: "Commission expires" }] }} />
                    <div className="grid place-items-center rounded border border-dashed border-[#9ca3af] text-xs text-[#9ca3af]">
                      (Seal)
                    </div>
                  </div>
                </section>
              );
            case "spacer":
              return <div key={i} className="h-4" />;
          }
        })}
      </article>
    </div>
  );
}
