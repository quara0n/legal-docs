# Legal coverage checklist (Norway launch)

> **General information, not legal advice.** This list was put together by an AI, not a lawyer
> or accountant. It covers the usual risks for a self-help legal template site run from Norway
> through an ENK and selling to Norwegian customers. Rules change and depend on your facts. Where
> a line says "ask an accountant", that's a step worth paying for, even if a lawyer review isn't.

Legend: ✅ the site already does this · ☐ you need to do this

---

## 1. Selling templates, not legal advice

Norway regulates who may give legal assistance (rettshjelp) as a business. What's regulated is
advice and help in someone's own case. General templates that the customer fills in
themselves are widely available; Forbrukerrådet, for example, publishes standard contracts. The
line to stay behind is the same as anywhere: sell the form, never advise on the customer's case.

- ✅ The customer picks the document and writes every answer. Nobody at the company edits or
  "customizes" a document for them.
- ✅ "Ikke et advokatfirma, ikke juridisk rådgivning" appears in several places: the footer, the
  disclaimer page, the editor, the required checkbox before payment, the Stripe payment page and
  the end of every PDF.
- ✅ The editor warns, or blocks payment, where a template is the wrong tool or the result would
  break the law:
  - **Husleiekontrakt and fremleiekontrakt:** a deposit over six months' rent is blocked
    (husleieloven § 3-5). There is a warning when a fixed-term lease is shorter than the
    minimum period.
  - **Fullmakt:** a fremtidsfullmakt is blocked, because it has strict formal requirements under
    vergemålsloven.
  - **Kjøpekontrakt:** a business selling to a consumer is blocked, because forbrukerkjøpsloven
    applies and can't be contracted away.
  - **Gjeldsbrev:** very high interest triggers a warning.
  - **Oppdragsavtale:** there is a warning if the arrangement looks like employment.
- ☐ **Support emails: never advise.** Don't answer "hvilket dokument bør jeg bruke?", "er dette
  gyldig?" or "bør jeg legge til dette?". Help with the site, payment and downloads only. For
  legal questions, use a stock reply: *«Vi kan dessverre ikke gi juridiske råd. Har du spørsmål
  om din situasjon, bør du kontakte en advokat. Har du lav inntekt, kan du ha rett til fri
  rettshjelp.»*
- ☐ **Marketing: never claim** "advokatgodkjent", "skrevet av advokat", "garantert gyldig" or
  "erstatter advokat". Don't use "advokat" or "advokatfirma" in the name, ads or domain. The title
  "advokat" is protected.
- ☐ Re-check the templates about once a year, and whenever a customer reports a problem. If one
  document draws complaints, pull it or pay for a review of that document only. The open
  questions from the AI drafting are listed at the end of this file.

## 2. Terms, disclaimers and liability

- ✅ Norwegian terms (vilkår) under Norwegian law:
  - liability capped at the price paid
  - indirect losses (deposits, rent, loans, legal fees) excluded
  - the cap set aside for gross negligence and where mandatory consumer law says otherwise
- ✅ Personvern, angrerett (with angreskjema) and ansvarsfraskrivelse pages, linked in every
  footer.
- ✅ The buyer must tick a box accepting the terms before paying.
- ☐ **Fill in your ENK's details** in the hosting settings:
  - `NEXT_PUBLIC_COMPANY_NAME`
  - `NEXT_PUBLIC_COMPANY_ADDRESS`
  - `NEXT_PUBLIC_COMPANY_ID` (the org.nr.)
  - `NEXT_PUBLIC_SUPPORT_EMAIL`

  They then appear in the footer, terms and privacy page. The e-commerce act (ehandelsloven)
  requires your name, address, email and organization number to be easy to find.
- Good to know: a liability cap reduces your risk but can't remove it, especially against
  consumers. The insurance and the AS step below cover the rest.

## 3. Your business form: ENK now, AS later

You run this through your **ENK (enkeltpersonforetak)**. That's fine for launching, but an ENK
has **no liability shield**: if a customer sued and won, your personal savings and home would be
at stake. While you're on the ENK, you're protected by:
- the disclaimers
- the checkbox
- the liability cap
- insurance (section 4)

So don't skip the insurance.

- ☐ Use the ENK's registered name, address and organization number on the site (section 2).
- ☐ Put the Stripe account, domain and Google Ads account in the ENK's name.
  - Use a separate bank account for the business, even though an ENK doesn't legally require one.
- ☐ **Convert to an AS (aksjeselskap)** once revenue justifies it, and before you scale up ad
  spend.
  - An AS limits your risk to what's in the company.
  - It needs NOK 30,000 in share capital and is registered at Brønnøysundregistrene (Altinn).
  - An accountant can help move the business from the ENK into the AS.

## 4. Insurance

- ☐ Get a quote for **professional liability insurance (ansvarsforsikring / profesjonsansvar)**
  for the ENK.
  - Tell the insurer exactly what you sell: self-help document templates, no advice.
- At 99–199 kr per document, the realistic claim is a customer saying a template cost them money.
  The cap and disclaimers make that hard to win. Insurance covers the cost of defending it.

## 5. Privacy (GDPR)

GDPR applies through personopplysningsloven. The regulator is Datatilsynet.

- ✅ A Norwegian privacy page covering:
  - who is responsible (behandlingsansvarlig)
  - the legal basis for each use
  - processors and US transfers
  - how long data is stored
  - the right to complain to Datatilsynet
- ✅ Minimal data:
  - Answers stay in the customer's browser and aren't stored on the server.
  - The server builds the PDF and forgets it.
  - Stripe handles cards and emails.
- ✅ Analytics is cookie-free (Plausible).
- ☐ Accept the data processing agreements (databehandleravtaler) for:
  - Stripe
  - Vercel
  - Plausible
  - your email provider

  They are standard and usually part of their terms or dashboards.
- ☐ Keep a one-page record of what personal data you handle, why, where it goes and how long
  it stays (GDPR Article 30). The privacy page is a good starting point.
- ☐ Answer requests for access or deletion within one month.

## 6. Cookies and the Google Ads tag

- ✅ **Consent banner is built in.** It appears when GA4, Google Ads or Microsoft Clarity is set
  (`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_CLARITY_ID`).
  - Clarity only loads after «Godta», and the form and download pages are masked so answers are never recorded.
  - Google Consent Mode v2 keeps every Google cookie denied until the visitor clicks «Godta».
  - «Avvis» is just as prominent as «Godta», and the privacy page has a button to change the choice.
  - The privacy page's cookie section and the list of processors update automatically.
- ✅ With none of them set, **no cookie banner is needed**.
  - The site sets no tracking cookies.
  - Saving the customer's own draft in their browser is part of the service they asked for.
- ☐ **When you add Google Ads conversion tracking or remarketing, you need a consent banner
  first.**
  - The Google tag sets cookies, and Norway's cookie rules (ekomloven, tightened in 2025) require
    opt-in consent before that.
  - Google also requires Consent Mode v2 in the EEA.
  - Use a consent tool (Cookiebot, CookieYes or similar) and update the cookie section of the
    privacy page. Ask me to wire this up when you're ready.

## 7. Consumer rules (angrerett, prices, marketing)

- ✅ **Angrerett:** the site gives 14 days to change your mind, even after download.
  - Strictly, the angrerett for downloaded digital content can lapse once delivery starts. We
    keep it anyway, which is simpler and builds trust.
  - The angrerett page includes the standard angreskjema.
- ✅ **Total price** is shown before checkout. It's a one-time payment with no subscription.
- ☐ Actually honor the refund promise. Pay back within 14 days at the latest.
- ☐ **Prices and MVA:** consumer prices must include all taxes. While the ENK isn't
  MVA-registered, the shown price is the full price. Once you register, either raise the prices
  or absorb the 25% MVA.
- ☐ **Marketing (markedsføringsloven):**
  - Only use real reviews.
  - Don't run fake "sale" prices or countdowns.
  - "Gratis forhåndsvisning" is fine because it's true.

## 8. Tax (ask an accountant)

- ☐ **MVA:** register once taxable sales reach 50 000 kr in 12 months. That is roughly 400
  documents at 129 kr.
- ☐ **Income tax:** the ENK's profit is taxed as your personal income. Set money aside, and file
  the næringsoppgave with your tax return.
- ☐ **Customers outside Norway:** the site is in Norwegian and priced in NOK, so this will be
  rare. A seller outside the EU owes EU VAT from the first digital sale to an EU consumer. Ask
  your accountant whether to limit checkout to Norway; I can add a country check in Stripe.
- ☐ **Bookkeeping:** keep receipts and Stripe payout reports for at least 5 years
  (bokføringsloven).

## 9. Google Ads

- ☐ Complete Google's **advertiser verification** (identity and business) in the ENK's name.
- ☐ Ads must follow Google's misrepresentation policy:
  - clear pricing
  - no implied lawyer or law firm
  - no false urgency
  - no "official form" or government look

  That matters especially for kjøpekontrakt for bil, because of Statens vegvesen.
- ☐ Before your first campaign, read Google's Advertising Policies pages on Misrepresentation and
  on Government documents and official services.

## 10. Name, domain and trademark

- ☐ Before buying the domain, search the name in:
  - **Patentstyret** (search.patentstyret.no)
  - **TMview** (EU and many national registers)
  - a plain Google search
- ☐ Avoid names close to existing Norwegian contract and legal-help sites, and anything with
  "advokat".
- ☐ A `.no` domain is registered through a Norid registrar. The ENK's organization number can be
  used.
- Optional: once you've had some sales, register the name as a trademark at Patentstyret.

## 11. Business risk worth knowing

Some templates are available for free in Norway. Forbrukerrådet publishes a standard
husleiekontrakt and a kjøpekontrakt for bruktbil, for example. Your edge is the guided flow, the
live preview and the warnings, not the text itself. Lead your ads with that, and watch which
documents actually sell.

## 12. Open questions from the AI drafting

These are points where the AI that drafted the templates was unsure. Its texts are worded
cautiously because of that. Worth a check if you ever pay for a review of one document:

- **Husleiekontrakt, minimum lease periods (husleieloven § 9-3):** whether a saklig grunn
  exception gives exactly a 1-year minimum, and how rooms in the landlord's own home are treated.
  The template only warns, it doesn't block.
- **Husleiekontrakt, notice periods:** shortest lawful agreed notice for hybel and rooms. The
  default is 3 months.
- **Fremleiekontrakt:** whether the 3-year minimum applies to fremleie. It is worded as "kan også
  gjelde".
- **Gjeldsbrev, kausjon:** whether the finansavtaleloven rules on kausjon apply when the lender is
  a private person. The warning is hedged, and the guarantor's liability is capped.
- **Kjøpekontrakt:** the «som den er» exceptions are paraphrased in plain language from
  kjøpsloven § 19.
- **Oppdragsavtale:** adding MVA mid-contract if the contractor registers later. The liability
  cap can be overridden by consumer law when the client is a private person; a warning says so.
- **Fullmakt:** issued in one copy that the fullmektig returns when it's revoked. Witnesses are
  optional.

---

### The short version

1. Fill in the ENK's name, address, org.nr. and a support email on the site.
2. Get ansvarsforsikring for the ENK. Until you have an AS, that's your main protection.
3. Never give legal advice in support emails, and never claim "advokatgodkjent".
4. Accept your providers' data processing agreements and keep a one-page data record.
5. Add a cookie consent banner before you add the Google Ads tag.
6. Register for MVA when you pass 50 000 kr in sales, and ask an accountant about tax.
7. Search Patentstyret before you buy the domain.
8. Convert to an AS before you scale up ad spend.

### If you later open the US market

Set `NEXT_PUBLIC_MARKET=us` on a separate deployment. Before you do, add the US-specific steps:
- unauthorized-practice-of-law care
- insurance that explicitly covers US claims
- state sales tax (Stripe Tax)
- CCPA, once you're large enough

The git history has the earlier US version of this checklist.
