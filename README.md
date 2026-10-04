# Rettfram: legal documents at one honest price

A guided document builder for simple legal documents. Visitors answer one short question
at a time, watch the document write itself in a live preview, and pay once per document only
when they download the PDF. No subscription, no account.

The brand is **Rettfram** (rettframavtaler.no). `NEXT_PUBLIC_SITE_NAME` overrides it, for example for a US deployment.

## Markets

One deployment sells to one market, chosen with `NEXT_PUBLIC_MARKET` at build time:

- `no` (default): Norwegian site, prices in NOK, A4 PDFs, Norwegian terms with angrerett.
  Templates in `src/content/nb-NO/`: husleiekontrakt, fremleiekontrakt, kjøpekontrakt,
  gjeldsbrev, fullmakt, oppdragsavtale and taushetserklæring.
- `us`: English site, prices in USD, US Letter PDFs. Templates in `src/content/en-US/`: NDA,
  residential lease, bill of sale, service agreement, power of attorney, promissory note,
  sublease and roommate agreement.

Interface text lives in `src/i18n/` (`en.tsx`, `nb.tsx`); the legal pages have a version per
market (`src/app/terms/no.tsx` and `us.tsx`, and so on). The other market's templates stay in the
code and in the tests, but are not published.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: add a Stripe test key
npm run dev                  # http://localhost:3000
```

Without `STRIPE_SECRET_KEY` the app runs in **demo mode**: the pay button skips checkout and
goes straight to the download page, so every flow can be tried locally.

## Deploy to Vercel

1. Go to vercel.com/new, import the `legal-docs` GitHub repository, and keep the default
   Next.js settings.
2. Add the environment variables from `.env.example` (at least `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_COMPANY_ADDRESS` and
   `STRIPE_SECRET_KEY`).
3. Deploy, then add your domain under Project → Settings → Domains and update
   `NEXT_PUBLIC_SITE_URL` to match.

Every push to `main` redeploys automatically.

## Tests

```bash
npm run lint && npm run typecheck   # static checks
npm test                            # unit tests: every template, PDF output, payment checks
npm run build && npm run test:e2e   # browser tests (desktop + mobile) against the production build
```

The template tests answer every question with every option and fail if any blank is left
in the document, if a template refers to a field that doesn't exist, or if the PDF breaks.
CI runs all of this on every push (`.github/workflows/ci.yml`).

## Analytics

Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to turn on cookie-free Plausible analytics. The app sends
these events (never any document answers): Document started, Step completed, Checkout
started, Purchase completed, PDF downloaded. Add them as goals in Plausible to get a funnel.

## Turning on payments

1. Create a Stripe account and copy the test secret key into `.env.local` as `STRIPE_SECRET_KEY`.
2. Pay with card `4242 4242 4242 4242`, any future date, any CVC.
3. For production, use the live key and set `NEXT_PUBLIC_SITE_URL`.
4. In the Stripe dashboard, turn on email receipts (Settings → Customer emails) and, for
   Apple Pay, verify your domain (Settings → Payment methods → Apple Pay).

Checkout is a one-time Stripe Checkout session built from the template's price (no Stripe
products to set up). The download API re-checks the session with Stripe (paid, right
document, within the 30-day free-edit window) before it generates a PDF.

## How it fits together

| Path | What it is |
| --- | --- |
| `src/content/en-US/*.ts` | The templates: questions (steps and fields), SEO copy, and a `render()` that turns answers into document blocks |
| `src/content/index.ts` | Template registry per locale (currency, regions, templates) |
| `src/lib/doc.ts` | Shared types and helpers. Answers are wrapped in tokens so the preview can highlight them |
| `src/lib/pdf.ts` | Renders the same blocks to a US Letter PDF with pdf-lib (page numbers, signature lines, notary block) |
| `src/components/Wizard.tsx` | The one-question-at-a-time editor with live preview, autosave, review and checkout |
| `src/app/api/checkout` | Creates the Stripe Checkout session (or a demo session) |
| `src/app/api/download` | Verifies the purchase and returns the PDF |
| `src/app/documents/[slug]` | SEO landing page per template, with FAQ and Product structured data |

Answers live only in the visitor's browser (localStorage). They are sent to the server once,
at download, to build the PDF, and are not stored.

## Adding a template

Copy one of the files in `src/content/en-US/`, change the steps and `render()`, and add it to
`src/content/index.ts`. Field types: text, textarea, date, choice (cards), select, multi
(checkboxes), money, number, region, email. Steps and fields can be conditional with `showIf`.

To preview every template as a PDF with sample answers: `npx tsx scripts/sample-pdfs.ts`
(writes to `./out`).

## Adding a language or country (e.g. Norway)

Create `src/content/nb-NO/` with its own templates (for example a husleiekontrakt), register
the locale in `src/content/index.ts` with `currency: "nok"` and the list of fylker as
`regions`. The page routes currently serve the default locale; add a `[locale]` segment or a
separate domain when the second locale is ready.

## Before launch

See `LAUNCH.md`.
