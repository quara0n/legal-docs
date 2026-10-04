import { makeCtx, type Block, type Template, type Warning } from "@/lib/doc";

const POWERS: Record<string, string> = {
  real: "Real property transactions (buying, selling, leasing and managing real estate)",
  personal: "Tangible personal property transactions (vehicles, furniture and other belongings)",
  banking: "Banking and other financial institution transactions",
  investments: "Stocks, bonds, mutual funds and other investments",
  business: "Operating a business or entity",
  insurance: "Insurance and annuity transactions",
  benefits: "Government benefits, including Social Security, Medicare and veterans’ benefits",
  retirement: "Retirement plans",
  taxes: "Tax matters, including filing returns and dealing with tax authorities",
  claims: "Claims and litigation",
  family: "Personal and family maintenance",
  digital: "Digital assets and online accounts",
};

const sanitize = (s: string) => s.replace(/[⟦⟧¦*]/g, "");

export const powerOfAttorney: Template = {
  slug: "general-power-of-attorney",
  locale: "en-US",
  name: "General Power of Attorney",
  shortName: "Power of Attorney",
  tagline: "Let someone you trust handle money and paperwork for you.",
  category: "Personal",
  price: 1200,
  minutes: 6,
  icon: "key",
  seo: {
    title: "Power of Attorney Form: Create a General or Durable POA Online",
    description:
      "Make a general financial power of attorney, durable or not, effective now or on incapacity. Free preview, then $12 once for the PDF with notary section.",
    intro:
      "A power of attorney (POA) lets you (the principal) appoint someone you trust (your agent, or attorney-in-fact) to act for you in financial and legal matters. A durable POA keeps working if you become unable to make decisions yourself.",
    whenToUse: [
      "Planning ahead in case of illness, injury or old age",
      "Letting a family member manage your finances while you travel or live abroad",
      "Allowing someone to sign for you in a property sale or at the bank",
      "Helping an aging parent with bills and paperwork",
    ],
    includes: [
      "Choose exactly which powers your agent gets",
      "Durable or non-durable",
      "Effective immediately or only if you become incapacitated",
      "Optional backup (successor) agent",
      "Optional end date",
      "Notary acknowledgment and witness lines",
    ],
    faq: [
      {
        q: "Does a power of attorney need to be notarized?",
        a: "Almost every state requires the principal's signature to be notarized, and some also require one or two witnesses. Sign in front of a notary to be safe.",
      },
      {
        q: "Does this cover medical decisions?",
        a: "No. This is a financial power of attorney. Medical decisions are made under a separate healthcare power of attorney or advance directive.",
      },
      {
        q: "Can I cancel it later?",
        a: "Yes. As long as you are mentally competent you can revoke it at any time by signing a written revocation and informing your agent and anyone relying on the POA.",
      },
    ],
  },
  steps: [
    {
      id: "principal", label: "You",
      title: "Who is giving the power?",
      description: "This is you, the principal.",
      fields: [
        { id: "pName", label: "Your full legal name", type: "text", required: true, placeholder: "Jane Smith" },
        { id: "pAddress", label: "Your address", type: "text", required: true, placeholder: "Street, city, state, ZIP" },
        { id: "state", label: "State you live in", type: "region", required: true, help: "Powers of attorney follow the rules of your state." },
      ],
    },
    {
      id: "agent", label: "Agent",
      title: "Who will act for you?",
      description: "Your agent. Choose someone you trust completely.",
      fields: [
        { id: "aName", label: "Agent’s full name", type: "text", required: true, placeholder: "John Smith" },
        { id: "aAddress", label: "Agent’s address", type: "text", placeholder: "Street, city, state, ZIP" },
        { id: "aRelation", label: "Relationship (optional)", type: "text", half: true, placeholder: "e.g. son" },
        {
          id: "hasAlt",
          label: "Add a backup agent?",
          type: "choice",
          defaultValue: "no",
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes", description: "Steps in if your agent can’t or won’t act." },
          ],
        },
        { id: "altName", label: "Backup agent’s name", type: "text", half: true, showIf: (a) => a.hasAlt === "yes", required: true },
        { id: "altAddress", label: "Backup agent’s address", type: "text", half: true, showIf: (a) => a.hasAlt === "yes" },
      ],
    },
    {
      id: "powers", label: "Powers",
      title: "What can your agent do?",
      description: "Tick everything your agent should be allowed to handle.",
      fields: [
        {
          id: "powers",
          label: "Powers",
          type: "multi",
          required: true,
          defaultValue: "real,personal,banking,investments,insurance,benefits,retirement,taxes,claims,family",
          options: Object.entries(POWERS).map(([value, label]) => ({ value, label })),
        },
        { id: "limits", label: "Special instructions or limits (optional)", type: "textarea", placeholder: "e.g. My agent may not sell my home at 12 Oak St." },
      ],
    },
    {
      id: "when", label: "When it applies",
      title: "When does it apply?",
      fields: [
        {
          id: "durable",
          label: "If you become incapacitated",
          type: "choice",
          defaultValue: "yes",
          options: [
            { value: "yes", label: "Keep working (durable)", description: "Recommended for long-term planning." },
            { value: "no", label: "End automatically", description: "Common for short, specific tasks." },
          ],
        },
        {
          id: "effective",
          label: "Starts",
          type: "choice",
          defaultValue: "now",
          options: [
            { value: "now", label: "Immediately", description: "As soon as it is signed." },
            { value: "incapacity", label: "Only if I become incapacitated", description: "Confirmed in writing by a doctor." },
          ],
          showIf: (a) => a.durable !== "no" && a.state !== "Florida",
        },
        { id: "endDate", label: "End date (optional)", type: "date", half: true, help: "Leave empty to keep it until revoked." },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a);
    const durable = !c.is("durable", "no");
    // Florida does not allow powers of attorney that only start on incapacity.
    const springing = durable && c.is("effective", "incapacity") && !c.is("state", "Florida");
    const chosen = c.multi("powers").filter((p) => POWERS[p]);
    const blocks: Block[] = [
      { type: "title", text: durable ? "Durable General Power of Attorney" : "General Power of Attorney" },
      { type: "subtitle", text: `State of ${c.v("state", "state")}` },
      {
        type: "paragraph",
        text: "IMPORTANT NOTICE: The powers granted by this document are broad and sweeping. They are explained in this document. The powers do not authorize anyone to make medical or other health-care decisions for you. You may revoke this power of attorney at any time.",
      },
      {
        type: "clause",
        title: "Appointment of Agent",
        paragraphs: [
          `I, **${c.v("pName", "your name")}**, of ${c.v("pAddress", "your address")} (the “Principal”), appoint **${c.v("aName", "agent name")}**${c.has("aAddress") ? `, of ${c.v("aAddress", "")}` : ""}${c.has("aRelation") ? `, my ${c.v("aRelation", "")}` : ""}, as my attorney-in-fact (my “Agent”).`,
          ...(c.is("hasAlt", "yes")
            ? [
                `If my Agent dies, becomes incapacitated, resigns or is unable or unwilling to act, I appoint **${c.v("altName", "backup agent name")}**${c.has("altAddress") ? `, of ${c.v("altAddress", "")}` : ""}, as my successor Agent, with the same powers.`,
              ]
            : []),
        ],
      },
      {
        type: "clause",
        title: "Powers Granted",
        paragraphs: [
          chosen.length
            ? "My Agent may act for me in any lawful way with respect to the following matters, to the same extent I could if personally present:"
            : "⟦powers¦?Select the powers your agent will have⟧",
        ],
        list: chosen.map((p) => `⟦powers¦${sanitize(POWERS[p])}⟧`),
      },
    ];
    if (c.has("limits"))
      blocks.push({ type: "clause", title: "Special Instructions", paragraphs: [`My Agent’s authority is subject to the following: ${c.v("limits", "")}`] });
    blocks.push(
      {
        type: "clause",
        title: "Effective Date",
        paragraphs: [
          springing
            ? "This power of attorney becomes effective only upon my incapacity. I shall be considered incapacitated when a licensed physician who has examined me states in writing that I am unable to manage my property or financial affairs."
            : "This power of attorney is effective immediately upon signing.",
        ],
      },
      {
        type: "clause",
        title: durable ? "Durability" : "Termination on Incapacity",
        paragraphs: [
          durable
            ? "This power of attorney shall not be affected by my subsequent disability or incapacity, or by lapse of time."
            : "This power of attorney shall terminate if I become disabled or incapacitated.",
        ],
      },
      {
        type: "clause",
        title: "Duration and Revocation",
        paragraphs: [
          c.has("endDate")
            ? `This power of attorney ends on ${c.date("endDate", "end date")}, unless I revoke it earlier.`
            : "This power of attorney continues until I revoke it or until my death.",
          "I may revoke this power of attorney at any time by giving written notice to my Agent. Any third party may rely on this power of attorney until they receive actual notice of its revocation.",
        ],
      },
      {
        type: "clause",
        title: "Agent’s Duties",
        paragraphs: [
          "My Agent shall act in good faith, in my best interest, and within the scope of authority granted. My Agent shall keep my property separate from the Agent’s own, keep records of all transactions, and avoid conflicts of interest. My Agent is entitled to reimbursement of reasonable expenses.",
        ],
      },
      {
        type: "clause",
        title: "Reliance by Third Parties",
        paragraphs: [
          "Any third party who receives a copy of this document may act under it. A photocopy or electronically transmitted copy has the same effect as the original. I agree to indemnify any third party for claims arising from their reasonable reliance on this power of attorney.",
        ],
      },
      {
        type: "clause",
        title: "Governing Law",
        paragraphs: [`This power of attorney is governed by the laws of the State of ${c.v("state", "state")}.`],
      },
      {
        type: "signatures",
        intro: "Signed by the Principal on the date below.",
        parties: [
          { heading: "PRINCIPAL", lines: [{ label: "Signature" }, { label: "Name", value: c.v("pName", "your name") }, { label: "Date" }] },
        ],
      },
      {
        type: "signatures",
        intro:
          "WITNESSES. We declare that the Principal signed this document in our presence, appeared to be of sound mind and free of undue influence, and that we are not the Agent.",
        parties: [
          { heading: "WITNESS 1", lines: [{ label: "Signature" }, { label: "Name" }, { label: "Address" }] },
          { heading: "WITNESS 2", lines: [{ label: "Signature" }, { label: "Name" }, { label: "Address" }] },
        ],
      },
      { type: "notary", state: c.v("state", "state") },
      {
        type: "signatures",
        intro:
          "AGENT’S ACKNOWLEDGMENT. By accepting this appointment, I acknowledge my legal responsibilities as Agent and agree to act in the Principal’s best interest.",
        parties: [{ heading: "AGENT", lines: [{ label: "Signature" }, { label: "Name", value: c.v("aName", "agent name") }, { label: "Date" }] }],
      },
    );
    return blocks;
  },
  warnings(a) {
    const out: Warning[] = [];
    switch (a.state) {
      case "New York":
        out.push({
          level: "block",
          text: "New York requires its own Statutory Short Form Power of Attorney, with exact wording set by law. This general template won't be accepted there. Use the official New York form (free from the NY courts website) or ask a New York attorney.",
        });
        break;
      case "Florida":
        out.push({
          level: "info",
          text: "Florida: the principal must sign in front of two witnesses and a notary, and the power of attorney takes effect immediately (Florida doesn't allow one that starts only on incapacity).",
        });
        break;
      case "California":
        out.push({
          level: "info",
          text: "California has its own Uniform Statutory Form Power of Attorney and requires the signature to be notarized or signed in front of two witnesses. Many California banks prefer the statutory form.",
        });
        break;
      case "Pennsylvania":
        out.push({
          level: "info",
          text: "Pennsylvania requires a specific notice signed by the principal at the start of the document, two witnesses plus a notary, and a signed agent acknowledgment. Have a Pennsylvania attorney check the document before relying on it.",
        });
        break;
      case "Texas":
      case "Illinois":
        out.push({
          level: "info",
          text: `${a.state} has an official statutory power of attorney form that banks and title companies recognize most easily. This document is valid if properly signed and notarized, but some institutions may ask for the statutory form.`,
        });
        break;
    }
    if (a.durable !== "no" && a.effective === "incapacity" && a.state !== "Florida")
      out.push({
        level: "info",
        text: "A power of attorney that only starts on incapacity can cause delays: banks may ask for the doctor's written statement before accepting it.",
      });
    return out;
  },
};
