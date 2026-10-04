import { makeCtx, type Block, type Template } from "@/lib/doc";
import { governingLawField, partyFields, partyIntro, sigParty } from "./shared";

const TERMS: Record<string, string> = {
  "1": "one (1) year",
  "2": "two (2) years",
  "3": "three (3) years",
  "5": "five (5) years",
};

export const nda: Template = {
  slug: "non-disclosure-agreement",
  locale: "en-US",
  name: "Non-Disclosure Agreement",
  shortName: "NDA",
  tagline: "Protect ideas, plans and trade secrets before you share them.",
  category: "Business",
  price: 900,
  minutes: 5,
  icon: "shield",
  seo: {
    title: "Free NDA Template: Create a Non-Disclosure Agreement in 5 Minutes",
    description:
      "Make a mutual or one-way non-disclosure agreement online. Preview it free, then pay $9 once to download the PDF. No subscription, no account.",
    intro:
      "A non-disclosure agreement (NDA) is a contract where one or both sides promise to keep shared information secret. Use it before you show a business plan, source code, a product idea or client lists to someone outside your company.",
    whenToUse: [
      "Pitching an idea to an investor, partner or manufacturer",
      "Hiring a freelancer or contractor who will see internal information",
      "Talking about a merger, acquisition or joint venture",
      "Sharing a prototype or unreleased product for feedback",
    ],
    includes: [
      "One-way or mutual protection",
      "Clear definition of what counts as confidential",
      "Standard exclusions (public info, independently developed, etc.)",
      "Return or destruction of materials",
      "Right to seek an injunction if the NDA is broken",
      "Signature blocks for people or companies",
    ],
    faq: [
      {
        q: "Should I choose a mutual or one-way NDA?",
        a: "Pick one-way when only you are sharing secrets (for example with a contractor). Pick mutual when both sides will share sensitive information, such as in partnership talks.",
      },
      {
        q: "How long should an NDA last?",
        a: "Two to five years is common for business information. Trade secrets are usually protected for as long as they remain secret, which this template handles automatically.",
      },
      {
        q: "Does an NDA need to be notarized?",
        a: "No. An NDA is binding once both parties sign it. Electronic signatures are generally valid in the US under the E-SIGN Act.",
      },
    ],
  },
  steps: [
    {
      id: "type", label: "NDA type",
      title: "What kind of NDA do you need?",
      description: "You can change this later. The preview updates as you go.",
      fields: [
        {
          id: "ndaType",
          label: "Type",
          type: "choice",
          defaultValue: "oneway",
          options: [
            { value: "oneway", label: "One-way", description: "Only one side shares confidential information." },
            { value: "mutual", label: "Mutual", description: "Both sides share and both must keep it secret." },
          ],
        },
      ],
    },
    {
      id: "partyA", label: "First party",
      title: (a) => (a.ndaType === "mutual" ? "Who is the first party?" : "Who is sharing the information?"),
      description: (a) => (a.ndaType === "mutual" ? "This is usually you or your company." : "This is the Disclosing Party, usually you."),
      fields: partyFields("a", "party"),
    },
    {
      id: "partyB", label: "Second party",
      title: (a) => (a.ndaType === "mutual" ? "Who is the second party?" : "Who is receiving the information?"),
      description: (a) => (a.ndaType === "mutual" ? "The other side of the agreement." : "This is the Receiving Party, who promises to keep it secret."),
      fields: partyFields("b", "party"),
    },
    {
      id: "purpose", label: "Purpose",
      title: "Why are you sharing information?",
      description: "A short purpose limits how the information may be used.",
      fields: [
        {
          id: "purpose",
          label: "Purpose",
          type: "textarea",
          required: true,
          placeholder: "evaluating a potential business relationship between the parties",
          help: "Finish the sentence: “The information may only be used for …”",
        },
      ],
    },
    {
      id: "terms", label: "Dates",
      title: "Dates and duration",
      fields: [
        { id: "effectiveDate", label: "Effective date", type: "date", required: true, half: true },
        {
          id: "term",
          label: "How long must it stay secret?",
          type: "select",
          half: true,
          defaultValue: "3",
          options: [
            { value: "1", label: "1 year" },
            { value: "2", label: "2 years" },
            { value: "3", label: "3 years (most common)" },
            { value: "5", label: "5 years" },
            { value: "forever", label: "Indefinitely" },
          ],
        },
      ],
    },
    { id: "law", label: "State", title: "Where are you located?", fields: [governingLawField] },
  ],
  render(a) {
    const c = makeCtx(a);
    const mutual = c.is("ndaType", "mutual");
    const recv = mutual ? "the receiving Party" : "the Receiving Party";
    const disc = mutual ? "the disclosing Party" : "the Disclosing Party";
    const Recv = mutual ? "The receiving Party" : "The Receiving Party";
    const term = c.is("term", "forever")
      ? "shall continue indefinitely until the Confidential Information no longer qualifies as confidential under Section 3"
      : `shall survive for ${c.opt("term", TERMS, "number of years")} from the Effective Date`;

    const blocks: Block[] = [
      { type: "title", text: mutual ? "Mutual Non-Disclosure Agreement" : "Non-Disclosure Agreement" },
      {
        type: "paragraph",
        text: `This ${mutual ? "Mutual " : ""}Non-Disclosure Agreement (the “Agreement”) is entered into as of ${c.date("effectiveDate", "effective date")} (the “Effective Date”) by and between ${partyIntro(c, "a", "first party name")} (${mutual ? "a “Party”" : "the “Disclosing Party”"}), and ${partyIntro(c, "b", "second party name")} (${mutual ? "a “Party”, and together the “Parties”" : "the “Receiving Party”"}).`,
      },
      {
        type: "paragraph",
        text: mutual
          ? `The Parties wish to exchange certain confidential information for the purpose of ${c.v("purpose", "purpose")} (the “Purpose”). Each Party may act as a disclosing Party and as a receiving Party under this Agreement.`
          : `The Disclosing Party intends to share certain confidential information with the Receiving Party for the purpose of ${c.v("purpose", "purpose")} (the “Purpose”).`,
      },
      {
        type: "clause",
        title: "Confidential Information",
        paragraphs: [
          `“Confidential Information” means any non-public information disclosed by ${disc} to ${recv}, whether in writing, orally, electronically or by inspection, including business plans, financial information, customer and supplier lists, pricing, product designs, software, source code, know-how, inventions, trade secrets and any other information that a reasonable person would understand to be confidential.`,
        ],
      },
      {
        type: "clause",
        title: "Obligations",
        paragraphs: [`${Recv} shall:`],
        list: [
          "hold the Confidential Information in strict confidence and protect it with at least the same degree of care it uses for its own confidential information, and no less than reasonable care;",
          "use the Confidential Information only for the Purpose;",
          "not disclose the Confidential Information to any third party, except to its employees, contractors and advisers who need to know it for the Purpose and who are bound by confidentiality obligations at least as protective as those in this Agreement; and",
          `promptly notify ${disc} of any unauthorized use or disclosure it becomes aware of.`,
        ],
      },
      {
        type: "clause",
        title: "Exclusions",
        paragraphs: [`Confidential Information does not include information that ${recv} can show:`],
        list: [
          `is or becomes publicly available through no fault of ${recv};`,
          `was lawfully known to ${recv} before it was disclosed under this Agreement;`,
          `is lawfully received from a third party without a duty of confidentiality; or`,
          `is independently developed by ${recv} without use of the Confidential Information.`,
        ],
      },
      {
        type: "clause",
        title: "Required Disclosure",
        paragraphs: [
          `If ${recv} is required by law, regulation or court order to disclose Confidential Information, it shall (where legally permitted) give ${disc} prompt written notice and reasonable assistance so that ${disc} may seek a protective order, and shall disclose only the portion that is legally required.`,
        ],
      },
      {
        type: "clause",
        title: "Term",
        paragraphs: [
          `The obligations in this Agreement ${term}. Obligations relating to trade secrets shall continue for as long as the information remains a trade secret under applicable law.`,
        ],
      },
      {
        type: "clause",
        title: "Return of Materials",
        paragraphs: [
          `Upon written request of ${disc}, ${recv} shall promptly return or destroy all Confidential Information in its possession, including copies, and confirm in writing that it has done so, except for copies it is required to keep by law.`,
        ],
      },
      {
        type: "clause",
        title: "No License or Warranty",
        paragraphs: [
          "All Confidential Information remains the property of the party that disclosed it. Nothing in this Agreement grants any license or right in any patent, copyright, trademark or other intellectual property. Confidential Information is provided “as is” without warranty of any kind.",
        ],
      },
      {
        type: "clause",
        title: "Remedies",
        paragraphs: [
          `Unauthorized use or disclosure of Confidential Information may cause irreparable harm for which money damages would be inadequate. ${mutual ? "Each Party" : "The Disclosing Party"} shall be entitled to seek injunctive relief, in addition to any other remedies available at law or in equity, without the need to post a bond.`,
        ],
      },
      {
        type: "clause",
        title: "Whistleblower Protection",
        paragraphs: [
          "Nothing in this Agreement prevents anyone from reporting a possible violation of law to a government agency, or from making disclosures protected by whistleblower laws. Under the Defend Trade Secrets Act (18 U.S.C. § 1833(b)), an individual is not liable for disclosing a trade secret in confidence to a government official or an attorney solely to report or investigate a suspected violation of law, or in a complaint or other document filed under seal in a lawsuit or other proceeding.",
        ],
      },
      {
        type: "clause",
        title: "General",
        paragraphs: [
          `This Agreement is governed by the laws of the State of ${c.v("state", "state")}, without regard to its conflict of laws rules. This Agreement is the entire agreement between the parties about its subject matter and may only be changed in a writing signed by both parties. Neither party is obligated to enter into any further agreement or transaction. If any provision is found unenforceable, the remainder shall remain in effect. This Agreement may be signed in counterparts and by electronic signature, each of which is deemed an original.`,
        ],
      },
      {
        type: "signatures",
        intro: "IN WITNESS WHEREOF, the parties have signed this Agreement as of the Effective Date.",
        parties: [
          sigParty(c, "a", mutual ? "FIRST PARTY" : "DISCLOSING PARTY", "first party name"),
          sigParty(c, "b", mutual ? "SECOND PARTY" : "RECEIVING PARTY", "second party name"),
        ],
      },
    ];
    return blocks;
  },
};
