import { makeCtx, type Block, type Template } from "@/lib/doc";
import { governingLawField, partyFields, partyIntro, sigParty } from "./shared";

const FREQ: Record<string, string> = { monthly: "monthly", biweekly: "every two weeks", weekly: "weekly" };

export const promissoryNote: Template = {
  slug: "promissory-note",
  locale: "en-US",
  name: "Promissory Note",
  shortName: "Promissory Note",
  tagline: "Put a personal or business loan in writing, with a clear repayment plan.",
  category: "Personal",
  price: 900,
  minutes: 5,
  icon: "cash",
  seo: {
    title: "Promissory Note Template: Create a Loan Agreement Online",
    description:
      "Make a promissory note for a personal or business loan: installments or lump sum, interest, late fees. Free preview, $9 once for the PDF.",
    intro:
      "A promissory note is a written promise to repay a loan. It records how much was borrowed, the interest rate, and exactly when and how it will be paid back. It turns a handshake loan between friends, family or businesses into something both sides can rely on.",
    whenToUse: [
      "Lending money to a friend or family member",
      "Borrowing from a private investor or business partner",
      "Selling something and letting the buyer pay over time",
      "Documenting an existing loan that was never written down",
    ],
    includes: [
      "Loan amount and interest rate",
      "Monthly, biweekly or weekly installments, or one lump-sum payment",
      "Late fees and what happens on default",
      "Prepayment without penalty",
      "Optional co-signer",
      "Signature blocks for borrower and lender",
    ],
    faq: [
      {
        q: "Do I need to charge interest on a family loan?",
        a: "Not legally, but in the US the IRS may treat large interest-free loans (over $10,000) as gifts. Many people charge at least the IRS applicable federal rate. A tax adviser can confirm what applies to you.",
      },
      {
        q: "Does a promissory note need to be notarized?",
        a: "Usually not. It's binding when signed by the borrower. Some lenders notarize it anyway for extra proof.",
      },
      {
        q: "Is there a maximum interest rate?",
        a: "Yes. Every state has usury laws that cap interest on private loans, often between 6% and 25% a year. Check your state's limit before choosing a rate.",
      },
    ],
  },
  steps: [
    { id: "lender", label: "Lender", title: "Who is lending the money?", fields: partyFields("l", "lender") },
    { id: "borrower", label: "Borrower", title: "Who is borrowing it?", fields: partyFields("b", "borrower") },
    {
      id: "loan",
      label: "Loan",
      title: "How much, and at what interest?",
      fields: [
        { id: "amount", label: "Loan amount", type: "money", required: true, half: true, placeholder: "5,000" },
        { id: "rate", label: "Yearly interest rate (%)", type: "text", half: true, defaultValue: "0", help: "Use 0 for an interest-free loan." },
        { id: "date", label: "Date of the loan", type: "date", required: true, half: true },
      ],
    },
    {
      id: "repay",
      label: "Repayment",
      title: "How will it be paid back?",
      fields: [
        {
          id: "plan",
          label: "Repayment",
          type: "choice",
          defaultValue: "installments",
          options: [
            { value: "installments", label: "In installments", description: "Regular payments until it's paid off." },
            { value: "lump", label: "All at once", description: "One payment on a set date." },
          ],
        },
        { id: "installment", label: "Payment amount", type: "money", half: true, required: true, placeholder: "250", showIf: (a) => a.plan !== "lump" },
        {
          id: "frequency",
          label: "How often",
          type: "select",
          half: true,
          defaultValue: "monthly",
          options: [
            { value: "monthly", label: "Monthly" },
            { value: "biweekly", label: "Every two weeks" },
            { value: "weekly", label: "Weekly" },
          ],
          showIf: (a) => a.plan !== "lump",
        },
        { id: "firstPayment", label: "First payment date", type: "date", half: true, required: true, showIf: (a) => a.plan !== "lump" },
        { id: "dueDate", label: "Due date", type: "date", half: true, required: true, showIf: (a) => a.plan === "lump" },
        { id: "lateFee", label: "Late fee (optional)", type: "money", half: true, placeholder: "25" },
      ],
    },
    {
      id: "extras",
      label: "Co-signer & state",
      title: "Co-signer and location",
      fields: [
        {
          id: "cosigner",
          label: "Is there a co-signer?",
          type: "choice",
          defaultValue: "no",
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes", description: "Someone who repays if the borrower doesn't." },
          ],
        },
        { id: "cosignerName", label: "Co-signer’s full name", type: "text", required: true, showIf: (a) => a.cosigner === "yes" },
        governingLawField,
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a);
    const lump = c.is("plan", "lump");
    const rate = Number((c.raw("rate") || "0").replace(/[^0-9.]/g, "")) || 0;
    const interest =
      rate > 0
        ? `with interest on the unpaid balance at the rate of ${c.v("rate", "rate")}% per year, calculated on a simple-interest basis from ${c.date("date", "loan date")}`
        : "without interest";
    const blocks: Block[] = [
      { type: "title", text: "Promissory Note" },
      {
        type: "paragraph",
        text: `**Principal amount:** ${c.money("amount", "loan amount")}    **Date:** ${c.date("date", "loan date")}`,
      },
      {
        type: "paragraph",
        text: `FOR VALUE RECEIVED, ${partyIntro(c, "b", "borrower name")} (the “Borrower”) promises to pay to ${partyIntro(c, "l", "lender name")} (the “Lender”) the principal sum of ${c.money("amount", "loan amount")}, ${interest}, on the terms below.`,
      },
      {
        type: "clause",
        title: "Repayment",
        paragraphs: [
          lump
            ? `The Borrower shall repay the full principal${rate > 0 ? " and all accrued interest" : ""} in one payment on or before ${c.date("dueDate", "due date")}.`
            : `The Borrower shall make ${c.opt("frequency", FREQ, "regular")} payments of ${c.money("installment", "payment amount")}, beginning on ${c.date("firstPayment", "first payment date")} and continuing until the principal${rate > 0 ? " and all accrued interest are" : " is"} paid in full. Each payment is applied first to any late fees, then to accrued interest, then to principal.`,
        ],
      },
      {
        type: "clause",
        title: "Prepayment",
        paragraphs: ["The Borrower may prepay all or part of the balance at any time without penalty."],
      },
      {
        type: "clause",
        title: "Late Payments",
        paragraphs: [
          c.has("lateFee")
            ? `If any payment is more than 10 days late, the Borrower shall pay a late fee of ${c.money("lateFee", "late fee")}, to the extent permitted by law.`
            : "Late payments do not incur a late fee, but remain subject to Section 4.",
        ],
      },
      {
        type: "clause",
        title: "Default",
        paragraphs: [
          "The Borrower is in default if any payment is more than 30 days late, or if the Borrower becomes insolvent or files for bankruptcy. On default, the Lender may give written notice declaring the entire unpaid balance immediately due. The Borrower shall pay the Lender’s reasonable costs of collection, including attorney’s fees, to the extent permitted by law.",
        ],
      },
      {
        type: "clause",
        title: "Interest Limit",
        paragraphs: [
          "Nothing in this Note requires payment of interest above the maximum rate allowed by law. Any excess shall be applied to principal or refunded.",
        ],
      },
    ];
    if (c.is("cosigner", "yes"))
      blocks.push({
        type: "clause",
        title: "Co-Signer",
        paragraphs: [
          `**${c.v("cosignerName", "co-signer name")}** (the “Co-Signer”) agrees to be jointly and severally liable with the Borrower for all amounts due under this Note.`,
        ],
      });
    blocks.push(
      {
        type: "clause",
        title: "General",
        paragraphs: [
          `This Note is governed by the laws of the State of ${c.v("state", "state")}. The Borrower waives presentment, demand and notice of dishonor. The Lender’s delay in enforcing any right is not a waiver of it. If any provision is unenforceable, the rest of this Note remains in effect.`,
        ],
      },
      {
        type: "signatures",
        intro: "Signed by the parties on the date written below.",
        parties: [
          sigParty(c, "b", "BORROWER", "borrower name"),
          sigParty(c, "l", "LENDER", "lender name"),
          ...(c.is("cosigner", "yes")
            ? [{ heading: "CO-SIGNER", lines: [{ label: "Signature" }, { label: "Name", value: c.v("cosignerName", "co-signer name") }, { label: "Date" }] }]
            : []),
        ],
      },
    );
    return blocks;
  },
};
