# Launch checklist

The app is built, tested and ready to deploy. These are the steps only the owner can do.
Rough order; the first five get you live.

1. **Pick the name and domain.** "Fairform" is a placeholder. Buy the domain, then set
   `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_SITE_URL`.
2. **Deploy on Vercel.** vercel.com/new → import `quara0n/legal-docs` → add the variables from
   `.env.example` → Deploy. Add the domain under Settings → Domains.
3. **Stripe.** Create an account, finish business verification, paste the secret key into
   `STRIPE_SECRET_KEY` (test key first, try card 4242 4242 4242 4242, then the live key).
   Turn on email receipts, and verify the domain for Apple Pay.
4. **Company details and support email.** Set `NEXT_PUBLIC_COMPANY_NAME`,
   `NEXT_PUBLIC_COMPANY_ADDRESS` and `NEXT_PUBLIC_SUPPORT_EMAIL` (and make sure the inbox works).
5. **Legal risk (no lawyer review).** The templates had an AI pre-review only, not an attorney's.
   The site limits the risk: buyers must tick "not a law firm, not legal advice" before paying,
   every PDF ends with a not-legal-advice note, the terms cap liability at the price paid, and the
   editor warns or blocks where a state needs something different. If you ever get complaints
   about one document, pull it or get just that one reviewed. The full list of what keeps you
   covered (company, insurance, privacy, cookies, tax, ads, trademark) is in `LEGAL-CHECKLIST.md`.
6. **Refund promise.** The site offers a 14-day no-questions refund. Keep it (it converts well)
   or change `refundDays` in `src/lib/site.ts`.
7. **Analytics (optional).** Create a Plausible site and set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
   Add the goals Document started, Step completed, Checkout started, Purchase completed and
   PDF downloaded to see the funnel.
8. **Search and ads.** Submit `https://<domain>/sitemap.xml` in Google Search Console. Check
   real search volume and cost per click in Google Keyword Planner before spending on ads.

Already done in the code: 8 templates, one-time Stripe checkout, PDF generation, free
preview, terms/privacy/refund/disclaimer pages, SEO pages with structured data and share
images, sitemap and robots, security headers, cookie-free analytics hooks, unit and browser
tests, and CI on every push.
