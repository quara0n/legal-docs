import { makeCtx, type Block, type Template } from "@/lib/doc";
import { governingLawField, partyFields, partyIntro, sigParty } from "./shared";

export const serviceAgreement: Template = {
  slug: "freelance-service-agreement",
  locale: "en-US",
  name: "Freelance Service Agreement",
  shortName: "Service Agreement",
  tagline: "Agree on scope, payment and ownership before the work starts.",
  category: "Business",
  price: 1200,
  minutes: 7,
  icon: "briefcase",
  seo: {
    title: "Freelance Contract Template: Independent Contractor Service Agreement",
    description:
      "Create a freelance or independent contractor agreement with scope, payment terms, IP ownership and termination. Free preview, $12 once for the PDF.",
    intro:
      "A service agreement (also called a freelance contract or independent contractor agreement) defines the work a freelancer or consultant will do, how and when they get paid, and who owns the result. It is the single best way to avoid unpaid invoices and scope creep.",
    whenToUse: [
      "Hiring a designer, developer, writer or consultant",
      "Starting work for a new client as a freelancer",
      "Setting up a monthly retainer",
      "Putting an existing handshake deal in writing",
    ],
    includes: [
      "Description of services and deliverables",
      "Fixed fee, hourly rate or monthly retainer",
      "Invoicing and payment due dates, with late interest",
      "Intellectual property ownership",
      "Confidentiality and independent contractor status",
      "Termination with notice",
    ],
    faq: [
      {
        q: "Who should own the work?",
        a: "Clients usually expect to own what they pay for. A common, fair setup is that ownership transfers once the client has paid in full. Freelancers can keep the right to show the work in their portfolio.",
      },
      {
        q: "Hourly or fixed price?",
        a: "Fixed price works when the scope is clear. Hourly is better for open-ended work. A monthly retainer suits ongoing support.",
      },
      {
        q: "Is this an employment contract?",
        a: "No. It states that the provider is an independent contractor responsible for their own taxes and equipment. If you control how, when and where someone works, they may legally be an employee.",
      },
    ],
  },
  steps: [
    {
      id: "client", label: "Client",
      title: "Who is the client?",
      description: "The person or business paying for the work.",
      fields: partyFields("cl", "client", { email: true }),
    },
    {
      id: "provider", label: "Provider",
      title: "Who is doing the work?",
      description: "The freelancer, consultant or agency.",
      fields: partyFields("pr", "provider", { email: true }),
    },
    {
      id: "scope", label: "Scope",
      title: "What work will be done?",
      fields: [
        {
          id: "services",
          label: "Services",
          type: "textarea",
          required: true,
          placeholder: "Design and build a 5-page marketing website, including two rounds of revisions.",
          help: "Be specific. A clear scope prevents disagreements later.",
        },
        { id: "deliverables", label: "Deliverables (optional)", type: "textarea", placeholder: "Figma designs, source code on GitHub, a deployed website." },
        { id: "startDate", label: "Start date", type: "date", required: true, half: true },
        { id: "endDate", label: "End date (optional)", type: "date", half: true, help: "Leave empty for ongoing work." },
      ],
    },
    {
      id: "payment", label: "Payment",
      title: "How will you be paid?",
      fields: [
        {
          id: "feeType",
          label: "Fee type",
          type: "choice",
          defaultValue: "fixed",
          options: [
            { value: "fixed", label: "Fixed price", description: "One total for the project." },
            { value: "hourly", label: "Hourly", description: "Bill for the time spent." },
            { value: "retainer", label: "Monthly retainer", description: "Same amount every month." },
          ],
        },
        { id: "amount", label: "Amount", type: "money", required: true, half: true, placeholder: "4,000" },
        {
          id: "deposit",
          label: "Upfront deposit (optional)",
          type: "money",
          half: true,
          placeholder: "1,000",
          showIf: (a) => a.feeType === "fixed",
        },
        { id: "hoursCap", label: "Max hours / month (optional)", type: "number", half: true, showIf: (a) => a.feeType === "hourly" },
        {
          id: "netDays",
          label: "Invoices due within",
          type: "select",
          defaultValue: "14",
          half: true,
          options: [
            { value: "7", label: "7 days" },
            { value: "14", label: "14 days" },
            { value: "30", label: "30 days" },
          ],
        },
      ],
    },
    {
      id: "ownership", label: "Ownership",
      title: "Who owns the finished work?",
      fields: [
        {
          id: "ip",
          label: "Ownership",
          type: "choice",
          defaultValue: "client",
          options: [
            { value: "client", label: "The client", description: "Transfers once paid in full. Provider may show it in a portfolio." },
            { value: "provider", label: "The provider", description: "Client gets a permanent license to use it." },
          ],
        },
        {
          id: "noticeDays",
          label: "Notice to end the agreement (days)",
          type: "number",
          defaultValue: "14",
          half: true,
        },
      ],
    },
    { id: "law", label: "State", title: "Where are you located?", fields: [governingLawField] },
  ],
  render(a) {
    const c = makeCtx(a);
    const fee = c.raw("feeType");
    let payment: string;
    if (fee === "hourly")
      payment = `The Client shall pay the Provider ${c.money("amount", "rate")} per hour for time spent performing the Services${c.has("hoursCap") ? `, up to a maximum of ${c.v("hoursCap", "")} hours per month unless the Client approves more in writing` : ""}. The Provider shall invoice monthly with a summary of hours worked.`;
    else if (fee === "retainer")
      payment = `The Client shall pay the Provider a monthly retainer of ${c.money("amount", "monthly amount")}, invoiced at the start of each month.`;
    else
      payment = `The Client shall pay the Provider a fixed fee of ${c.money("amount", "total fee")} for the Services.${c.has("deposit") ? ` A deposit of ${c.money("deposit", "deposit")} is due on signing and is credited against the fee; the balance is invoiced on completion.` : " The Provider shall invoice on completion of the Services."}`;

    const blocks: Block[] = [
      { type: "title", text: "Service Agreement" },
      {
        type: "paragraph",
        text: `This Service Agreement (the “Agreement”) is made between ${partyIntro(c, "cl", "client name")} (the “Client”) and ${partyIntro(c, "pr", "provider name")} (the “Provider”).`,
      },
      {
        type: "clause",
        title: "Services",
        paragraphs: [
          `The Provider shall perform the following services (the “Services”): ${c.v("services", "description of services")}`,
          ...(c.has("deliverables") ? [`The Provider shall deliver: ${c.v("deliverables", "")}`] : []),
          "Any work outside this scope requires a written change agreed by both parties, which may adjust the fees and timeline.",
        ],
      },
      {
        type: "clause",
        title: "Term",
        paragraphs: [
          c.has("endDate")
            ? `This Agreement begins on ${c.date("startDate", "start date")} and continues until ${c.date("endDate", "end date")}, unless ended earlier under Section 8.`
            : `This Agreement begins on ${c.date("startDate", "start date")} and continues until the Services are completed or the Agreement is ended under Section 8.`,
        ],
      },
      {
        type: "clause",
        title: "Fees and Payment",
        paragraphs: [
          payment,
          `Invoices are due within ${c.v("netDays", "number of")} days of the invoice date. Late payments accrue interest at 1% per month (or the maximum rate allowed by law, if lower). The Client shall reimburse pre-approved, reasonable expenses. The Provider may pause work while any invoice is more than 15 days overdue.`,
        ],
      },
      {
        type: "clause",
        title: "Intellectual Property",
        paragraphs: [
          c.is("ip", "provider")
            ? "The Provider retains all rights in the work product created under this Agreement. Upon full payment, the Provider grants the Client a perpetual, worldwide, non-exclusive, royalty-free license to use, copy and modify the work product for the Client’s business purposes."
            : "Upon receipt of full payment, the Provider assigns to the Client all rights, title and interest in the work product created specifically for the Client under this Agreement. The Provider keeps ownership of its pre-existing tools, code and know-how, and grants the Client a perpetual license to use them as part of the work product. The Provider may display the work in its portfolio unless the Client objects in writing.",
        ],
      },
      {
        type: "clause",
        title: "Confidentiality",
        paragraphs: [
          "Each party shall keep confidential any non-public information it receives from the other party and use it only to perform this Agreement. This obligation continues for two years after the Agreement ends.",
        ],
      },
      {
        type: "clause",
        title: "Independent Contractor",
        paragraphs: [
          "The Provider is an independent contractor, not an employee, partner or agent of the Client. The Provider controls how the Services are performed, provides its own equipment, and is responsible for its own taxes, insurance and benefits.",
        ],
      },
      {
        type: "clause",
        title: "Warranties and Liability",
        paragraphs: [
          "The Provider shall perform the Services in a professional and workmanlike manner. Except as stated in this Agreement, neither party gives any other warranty. Neither party is liable for indirect or consequential damages, and each party’s total liability is limited to the fees paid or payable under this Agreement, except for breaches of confidentiality or amounts owed for Services.",
        ],
      },
      {
        type: "clause",
        title: "Termination",
        paragraphs: [
          `Either party may end this Agreement by giving ${c.v("noticeDays", "number of")} days’ written notice, or immediately if the other party materially breaches it and does not fix the breach within 7 days of written notice. The Client shall pay for all Services performed and expenses incurred up to the end date.`,
        ],
      },
      {
        type: "clause",
        title: "General",
        paragraphs: [
          `This Agreement is governed by the laws of the State of ${c.v("state", "state")}. It is the entire agreement between the parties and may only be changed in writing signed by both. Neither party may assign it without the other’s written consent. Notices may be sent by email to the addresses the parties have provided. This Agreement may be signed electronically and in counterparts.`,
        ],
      },
      {
        type: "signatures",
        parties: [sigParty(c, "cl", "CLIENT", "client name"), sigParty(c, "pr", "PROVIDER", "provider name")],
      },
    ];
    return blocks;
  },
};
