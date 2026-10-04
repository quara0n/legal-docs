# Legal review packet

For the attorney reviewing Fairform's templates before launch. Fairform sells self-help US legal
documents: the customer answers questions, the software fills a fixed template, and they download a
PDF. No one reviews individual customers' documents.

**What we're asking for:** review the 8 templates and 4 policy pages below. Mark anything that's
wrong, unenforceable or missing for general US use, and tell us which states need a warning, a
change, or a block (as we already do for New York powers of attorney). A fixed fee for the whole
package is preferred.

**How to read the templates.** Each template is one file in `src/content/en-US/`. The `render()`
function holds the document text; `⟦field¦…⟧` marks where an answer is inserted. The simplest
way to review is to open the live site, fill in each document with test answers, and read the
preview, or run `npx tsx scripts/sample-pdfs.ts` to get sample PDFs of all 8.

An AI pre-review (not legal advice) was done on 2026-10-04. The changes it made are listed so you
can confirm or undo them.

---

## Cross-cutting questions

1. **Unauthorized practice of law.** We show "not a substitute for the advice of an attorney" in the
   footer, on the review screen and on the disclaimer page (modeled on the Texas software
   exemption, Tex. Gov't Code § 81.101(c)). Is this enough for the states we sell in? Do the in-app
   warnings (e.g. "Florida requires two witnesses") cross into advice?
2. **Governing law of our own terms.** The terms say they're governed by the law where the company
   is established. Which state or country should we name, and should we add arbitration or a
   class-action waiver?
3. **Refund promise.** 14 days, no questions. Any consumer-law issue with how it's worded?
4. **Privacy policy.** Answers stay in the browser, are sent once to generate the PDF, and are not
   stored. Stripe processes payments. Optional cookie-free Plausible analytics. Is the
   GDPR/CCPA wording adequate for a small US-facing site?
5. **Electronic signatures.** Templates say they may be signed electronically and in
   counterparts. Fine for all 8? (We believe not for the power of attorney, which also needs a
   notary in almost every state.)

## Per template

### 1. Non-Disclosure Agreement (one-way or mutual), $9
- Added by pre-review: Defend Trade Secrets Act whistleblower immunity notice (18 U.S.C. §
  1833(b)) and a carve-out for reporting to government agencies.
- Check: definition and exclusions; "indefinite" term option; injunctive relief "without bond"
  wording; whether to add non-solicitation (we left it out on purpose).

### 2. Residential Lease Agreement, $19
- Added by pre-review: federal lead-based paint disclosure (pre-1978 homes), a general "required
  disclosures" clause, and warnings for the California deposit cap and rent-regulated states.
- Check: 24-hour entry notice; late fee "to the extent permitted by law"; holdover becoming
  month-to-month; 14-day guest limit; which states need mandatory addenda (e.g. Chicago RLTO,
  NYC riders, California disclosures) and whether to block any city.

### 3. Bill of Sale (vehicle or general), $9
- Changed by pre-review: removed a list of "notary-required states" from the FAQ that we couldn't
  verify. Please tell us the correct list.
- Check: "as is" disclaimer wording (conspicuousness under UCC § 2-316); odometer disclosure
  wording against 49 C.F.R. Part 580; whether a separate state form is required anywhere.

### 4. Freelance Service Agreement, $12
- Added by pre-review: notices for California, New York (and NYC) and Illinois freelance worker
  protection laws.
- Check: IP assignment on full payment and the portfolio carve-out; independent-contractor clause
  (especially California AB5 and the ABC test); liability cap; 1% monthly late interest.

### 5. General Power of Attorney (financial), $12
- Added by pre-review: **blocked for New York** (statutory short form required); Florida forced to
  take effect immediately (no springing POA under Fla. Stat. § 709.2108) with a two-witness note;
  info warnings for California, Pennsylvania, Texas and Illinois.
- Check: this is the highest-risk template. Is a general form usable at all in CA, PA, TX and IL,
  or should we block those too? Does California require a specific printed warning statement for
  forms sold to the public (Cal. Prob. Code § 4128)? Does Pennsylvania's required notice need to
  be added verbatim (20 Pa.C.S. § 5601(c))? We deliberately grant no gifting, trust-changing or
  beneficiary-changing powers. Please confirm.

### 6. Promissory Note, $9
- Added by pre-review: warning when the interest rate is over 10% (usury) and on interest-free
  loans over $10,000 (IRS imputed interest).
- Check: default and acceleration; waiver of presentment; collection costs; whether the co-signer
  clause needs separate disclosure (e.g. the FTC co-signer notice, if it applies).

### 7. Sublease Agreement, $12
- Check: landlord consent block; subtenant bound by the master lease without being a party to it;
  NYC and other rent-controlled sublet rules.

### 8. Roommate Agreement, $9
- Check: that it can't be read as changing obligations to the landlord; enforceability of the
  "keep paying until replaced" clause.

## Policy pages
`src/app/terms`, `src/app/privacy`, `src/app/refunds`, `src/app/disclaimer`. The company name and
address are filled in at launch.

---

## Who could do the review (estimates, not checked quotes)

An AI review can't stand in for a licensed attorney's sign-off: it carries no professional
responsibility or insurance, and no "AI-accredited lawyer" exists. AI tools are useful, as here,
to prepare the work so the lawyer's time costs less.

| Option | What it is | Rough cost (estimate) |
| --- | --- | --- |
| ContractsCounsel | Marketplace; post the job and get flat-fee bids from vetted lawyers | $200–$500 per document; ~$1.5k–$4k for everything |
| UpCounsel | Vetted business and startup attorneys, flat fee or hourly | $150–$400 an hour |
| LawTrades | Startup-focused legal marketplace | Similar to UpCounsel |
| State bar lawyer referral service | Referral to a local attorney, often with a cheap first consult | ~$35–$50 consult, then hourly |
| Law school startup or entrepreneurship clinic | Supervised students, often free | Free; slow, semester-bound |

Tips:
- Most lawyers are licensed in one state. Either launch in a few focus states first (for example
  your largest ad markets) and get those reviewed, or ask specifically for a "general US / 50-state
  issues" review and accept that it will flag rather than fix state differences.
- Avoid LegalZoom's and Rocket Lawyer's attorney plans for this. They are direct competitors.
- Send this packet plus sample PDFs. A clear scope keeps a fixed-fee quote low.
- Ask the lawyer to confirm in writing which states each template is suitable for. That list
  can then drive the in-app warnings.
