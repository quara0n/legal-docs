# Legal coverage checklist

> **General information, not legal advice.** This list was put together by an AI, not a lawyer
> or accountant. It covers the usual risks for a self-help legal template site run from Norway
> and selling mainly to US customers. Rules change and depend on your facts. Where a line says
> "ask an accountant", that's a step worth paying for, even if a lawyer review isn't.

Legend: ✅ the site already does this · ☐ you need to do this

---

## 1. Not practicing law (the biggest risk)

In the US, only licensed attorneys may give legal advice. Template sites (LegalZoom, Rocket
Lawyer, Nolo) stay legal by selling **forms the customer fills in themselves**, with no personal
advice. Courts and state bars have challenged sites that crossed that line. Texas changed its law
so that forms and software are not "practice of law" if they clearly say they are not a
substitute for an attorney. In 2015, LegalZoom settled with North Carolina by agreeing to clear
disclaimers and attorney-reviewed templates.

- ✅ The customer picks the document and writes every answer. Nobody at the company edits or
  "customizes" a document for them.
- ✅ "Not a law firm, not legal advice, not a substitute for an attorney" appears in the footer,
  the disclaimer page, the editor, the required checkbox at checkout, the Stripe payment page and
  at the end of every PDF.
- ✅ State warnings: the editor warns, or blocks checkout, where a state needs something different
  (for example the power of attorney is blocked for New York).
- ☐ **Support emails: never advise.** Don't answer "which document should I use?", "is this valid
  in my state?" or "should I add this clause?". Help with the site, payments and downloads only.
  For legal questions, a stock reply: *"We can't give legal advice. For questions about your
  situation, please talk to a lawyer licensed in your state."*
- ☐ **Marketing: never claim** "lawyer-drafted", "attorney-approved", "valid in all 50 states",
  "guaranteed legally binding" or "replaces a lawyer". Don't use "law firm", "attorney" or
  "lawyers" in the name, ads or domain.
- ☐ Re-check the templates about once a year, and whenever a customer reports a problem. If one
  document draws complaints, pull it or pay for a review of that document only.

## 2. Terms, disclaimers and liability

- ✅ Terms of service with liability capped at the amount the customer paid. Lost deposits,
  rent, loans and legal fees are excluded, and the customer accepts responsibility for their own
  answers.
- ✅ Disclaimer, privacy and refund pages, linked in every footer.
- ✅ The buyer must tick a box agreeing to the terms before paying, so you have a clear record
  that they accepted.
- ☐ Fill in the real company name, address and support email (`.env.example`). The terms say
  they are governed by the law of the place where your company is registered, so this matters.
  Norway's e-commerce act (ehandelsloven) also requires your name, address, email and
  organization number to be easy to find.
- Good to know: a liability cap reduces your risk but can't remove it. Courts can ignore caps
  for gross negligence or under consumer protection law. That is why the company and insurance
  steps below matter.

## 3. Your business form: ENK now, AS later

You run this through your **ENK (enkeltpersonforetak)**. That's fine for launching, but an ENK
has **no liability shield**: if a customer sued and won, your personal savings and home would be
at stake. The disclaimers, the checkbox, the liability cap and insurance (section 4) are what
protect you while you're on the ENK, so don't skip the insurance.

- ☐ Use the ENK's registered name, address and organization number for the company details on the
  site (`NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_COMPANY_ADDRESS`).
- ☐ Put the Stripe account, domain and Google Ads account in the ENK's name. Use a separate bank
  account for the business, even though an ENK doesn't legally require one.
- ☐ **Convert to an AS (aksjeselskap)** once the revenue justifies it, and before you scale up ad
  spend. An AS limits your risk to what's in the company. It needs NOK 30,000 in share capital and
  is registered at Brønnøysundregistrene (Altinn). An accountant can help you move the business
  from the ENK into the AS.
- Alternative: a US LLC is common for US-facing businesses. Owned by a Norwegian tax resident it
  brings extra tax filings in both countries, so ask an accountant before choosing it.

## 4. Insurance

- ☐ Get a quote for **professional liability (E&O, "profesjonsansvar")** and general liability
  for the company.
- ☐ **Check that the policy covers claims from the US and Canada.** Many Norwegian and European
  policies exclude them unless you ask.
- At $9–19 per document, the realistic claim is a customer saying a template cost them money.
  The cap and disclaimers make that hard to win, and insurance covers the cost of defending it.

## 5. Privacy

You are based in Norway (EEA), so **GDPR applies to the whole business**, including US
customers. Norway's regulator is Datatilsynet.

- ✅ Privacy policy in plain language.
- ✅ Minimal data: answers stay in the customer's browser and aren't stored on the server. The
  server builds the PDF and forgets it. Stripe handles cards and emails.
- ✅ Analytics is cookie-free (Plausible).
- ☐ Accept the data processing agreements (DPAs) for Stripe, Vercel, Plausible and your email
  provider. These are standard and usually built into their terms or dashboards. Check that they
  cover transfers to the US (EU–US Data Privacy Framework or standard contractual clauses).
- ☐ Keep a one-page record of what personal data you handle, why, where it goes and how long it
  stays (GDPR Article 30). The privacy page is a good starting point.
- ☐ Answer access and deletion requests within one month. In practice this is mostly Stripe
  records and support emails.
- **CCPA (California):** applies only above about $26.6M yearly revenue, 100,000 California
  consumers' data, or when you earn most of your money selling data. You're far below that. The
  privacy page already mentions the rights anyway. Review this if you grow a lot.

## 6. Cookies and the Google Ads tag

- ✅ Right now **no cookie banner is needed**. The site sets no tracking cookies, and saving the
  customer's own draft in their browser is part of the service they asked for.
- ☐ **When you add Google Ads conversion tracking or remarketing, you need a consent banner.**
  The Google tag sets cookies. Norway's cookie rules (since 2025) and GDPR require opt-in consent
  first, and Google requires Consent Mode v2 for EEA visitors. Use a consent tool (Cookiebot,
  CookieYes or similar) and update the cookie section of the privacy page. If you only target US
  visitors, you can show the banner to EEA visitors only. Ask me to wire this up when you're ready.

## 7. Refunds and consumer rules

- ✅ A 14-day no-questions refund, shown before purchase. That beats what US law requires (no
  general refund right) and covers the EU/Norway 14-day withdrawal right for digital content.
- ✅ The full price is shown before checkout. It's a one-time payment with no subscription, so
  US auto-renewal rules don't apply.
- ☐ Actually honor the policy. The FTC treats a refund promise you don't keep as deceptive.

## 8. Tax: VAT and US sales tax (ask an accountant)

- ☐ **Norwegian VAT (MVA):** register once taxable sales reach NOK 50,000 in 12 months. Sales to
  Norwegian customers then carry 25% VAT. Electronic services sold to customers outside Norway are
  generally zero-rated, but confirm this with your accountant.
- ☐ **EU customers:** a seller outside the EU owes EU VAT on digital sales to EU consumers from
  the first sale (no threshold), usually reported through the EU "non-Union OSS" scheme. Either
  register, or limit sales to the US at first (ads targeting plus a checkout country check, which
  I can add).
- ☐ **US sales tax:** there's no federal sales tax. Each state taxes digital products
  differently, and foreign sellers owe tax in a state once sales there pass its threshold
  (commonly $100,000 a year, sometimes 200 orders). At $9–19 per document you won't hit those at
  first. **Turn on Stripe Tax** in monitoring mode: it tracks your sales per state and tells you
  when you need to register.
- ☐ Bookkeeping: keep receipts and Stripe payout reports for at least 5 years (bokføringsloven).

## 9. Google Ads

- ☐ Complete Google's **advertiser verification** (identity and business) in the company name.
- ☐ Ads must follow the "Misrepresentation" policy: clear pricing, no implied lawyer or law firm,
  no false urgency, no "official form" or government look. That matters especially for the bill
  of sale (DMV) and power of attorney.
- ☐ Before your first campaign, read Google's Advertising Policies pages on Misrepresentation and
  on Government documents and official services.
- ☐ Only use real reviews and testimonials. Fake ones break both FTC and Norwegian marketing law.

## 10. Name and trademark

- ☐ Before buying the domain, search the name in:
  - the **USPTO** trademark search (tmsearch.uspto.gov),
  - **TMview** (EU and many national registers),
  - **Patentstyret** (Norway),
  - plus a plain Google search and the main app stores.
- ☐ Look for exact and similar names in legal services, software and online documents.
- ☐ Avoid names close to LegalZoom, Rocket Lawyer, LawDepot, Nolo, Docusign and similar.
- Optional: once you've had some sales, register the name as a trademark in Norway or the EU, and
  later in the US.

## 11. Nice to have

- **Accessibility:** US websites get ADA demand letters. The site uses proper labels, keyboard
  navigation and contrast, so keep it that way when you change the design.
- **Keep the dates honest:** the terms and privacy pages show "last updated". Update the date
  (`legalUpdated` in `src/lib/site.ts`) whenever you change them.

---

### The short version

1. Launch on your ENK, and fill in its name, address, org number and a support email on the site.
2. Get E&O/liability insurance that covers US claims. On an ENK this is your main protection.
3. Convert to an AS before you scale up ad spend.
4. Never give legal advice in support emails or ads, and never claim "lawyer-approved".
5. Accept your providers' DPAs and keep a one-page data record.
6. Add a cookie consent banner before you add the Google Ads tag.
7. Ask an accountant about MVA, EU VAT and turning on Stripe Tax.
8. Run trademark searches before you buy the domain.
