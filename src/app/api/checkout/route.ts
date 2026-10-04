import { getLocale, getTemplate } from "@/content";
import { t } from "@/i18n";
import { LANG } from "@/lib/market";
import { demoMode, stripe } from "@/lib/payments";

export async function POST(request: Request) {
  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  const template = slug ? getTemplate(slug) : undefined;
  if (!template) return Response.json({ error: t.api.unknownDoc }, { status: 400 });

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const done = `${origin}/create/${template.slug}/download`;

  if (demoMode || !stripe) {
    const id = `demo__${template.slug}__${Date.now()}`;
    return Response.json({ url: `${done}?session_id=${encodeURIComponent(id)}`, demo: true });
  }

  // Answers never leave the browser for checkout. Stripe only sees the product.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: getLocale(template.locale).currency,
          unit_amount: template.price,
          product_data: {
            name: template.name,
            description: t.api.productDescription,
          },
        },
      },
    ],
    metadata: { slug: template.slug },
    success_url: `${done}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/create/${template.slug}?step=review`,
    allow_promotion_codes: true,
    locale: LANG === "nb-NO" ? "nb" : "en",
    custom_text: {
      submit: { message: t.api.checkoutNote },
    },
  });
  return Response.json({ url: session.url });
}
