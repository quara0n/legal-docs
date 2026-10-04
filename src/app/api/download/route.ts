import { getTemplate } from "@/content";
import { withDefaults, type Answers } from "@/lib/doc";
import { verifyPurchase } from "@/lib/payments";
import { renderPdf } from "@/lib/pdf";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { slug?: string; sessionId?: string; answers?: Answers };
  const template = body.slug ? getTemplate(body.slug) : undefined;
  if (!template) return Response.json({ error: "Unknown document." }, { status: 400 });

  const check = await verifyPurchase(body.sessionId ?? "", template.slug);
  if (!check.ok) return Response.json({ error: check.reason }, { status: 402 });

  const answers: Answers = {};
  for (const [k, v] of Object.entries(body.answers ?? {})) if (typeof v === "string") answers[k] = v.slice(0, 5000);

  const bytes = await renderPdf(template.render(withDefaults(template, answers)), { title: template.name });
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${template.slug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
