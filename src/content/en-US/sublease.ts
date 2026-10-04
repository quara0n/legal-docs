import { makeCtx, type Block, type Template } from "@/lib/doc";
import { governingLawField } from "./shared";

export const sublease: Template = {
  slug: "sublease-agreement",
  locale: "en-US",
  name: "Sublease Agreement",
  shortName: "Sublease",
  tagline: "Rent your place to someone else while you're away, the right way.",
  category: "Real estate",
  price: 1200,
  minutes: 7,
  icon: "key",
  seo: {
    title: "Sublease Agreement Template: Sublet Your Apartment Online",
    description:
      "Create a sublease agreement to sublet an apartment or room: rent, deposit, dates, landlord consent. Free preview, $12 once for the PDF.",
    intro:
      "A sublease agreement lets a tenant rent all or part of their home to someone else (the subtenant) for part of the lease term. The original tenant stays responsible to the landlord, so a clear written sublease protects you if the subtenant pays late or damages the place.",
    whenToUse: [
      "Subletting your apartment for a summer, internship or semester abroad",
      "Renting a spare room in an apartment you lease",
      "Covering rent while you travel or work elsewhere",
      "Handing over the rest of your lease before you move out",
    ],
    includes: [
      "Subtenant rent, due date and payment method",
      "Security deposit and condition at move-in",
      "Start and end dates within your lease",
      "Landlord consent section",
      "Subtenant agrees to follow the original lease",
      "Utilities and house rules",
    ],
    faq: [
      {
        q: "Do I need my landlord's permission to sublet?",
        a: "Usually yes. Most leases require the landlord's written consent, and some states give tenants the right to sublet if the landlord unreasonably refuses. This template includes a landlord consent section to sign.",
      },
      {
        q: "Am I still responsible if my subtenant doesn't pay?",
        a: "Yes. You remain responsible to your landlord for the full rent and any damage. That's why the sublease includes a deposit and clear payment terms.",
      },
      {
        q: "Can I charge more than I pay?",
        a: "Some cities with rent control (for example New York City) limit what you can charge a subtenant. Elsewhere it's usually allowed if your lease doesn't forbid it.",
      },
    ],
  },
  steps: [
    {
      id: "people",
      label: "People",
      title: "Who is involved?",
      description: "You are the tenant subletting your home.",
      fields: [
        { id: "tenant", label: "Your full name (tenant)", type: "text", required: true, placeholder: "Alex Rivera" },
        { id: "subtenant", label: "Subtenant’s full name", type: "text", required: true, placeholder: "Sam Lee" },
        { id: "landlord", label: "Landlord’s name", type: "text", required: true, placeholder: "Maple Street Properties LLC" },
      ],
    },
    {
      id: "place",
      label: "Property",
      title: "What is being sublet?",
      fields: [
        { id: "address", label: "Property address", type: "text", required: true, placeholder: "45 Elm St, Apt 3B, Austin, TX 78702" },
        {
          id: "portion",
          label: "What does the subtenant get?",
          type: "choice",
          defaultValue: "whole",
          options: [
            { value: "whole", label: "The whole place" },
            { value: "room", label: "A private room", description: "Shared kitchen and living areas." },
          ],
        },
        { id: "masterLeaseDate", label: "Date of your original lease", type: "date", half: true, help: "The lease you signed with your landlord." },
        { ...governingLawField, half: true, label: "State", help: undefined },
      ],
    },
    {
      id: "dates",
      label: "Dates",
      title: "When does the sublease run?",
      fields: [
        { id: "start", label: "Start date", type: "date", required: true, half: true },
        { id: "end", label: "End date", type: "date", required: true, half: true, help: "Must end before your own lease does." },
      ],
    },
    {
      id: "money",
      label: "Rent & deposit",
      title: "Rent and deposit",
      fields: [
        { id: "rent", label: "Monthly rent", type: "money", required: true, half: true, placeholder: "1,200" },
        { id: "deposit", label: "Security deposit", type: "money", half: true, placeholder: "1,200" },
        { id: "payTo", label: "Rent is paid to", type: "select", half: true, defaultValue: "tenant", options: [
          { value: "tenant", label: "Me (the tenant)" },
          { value: "landlord", label: "The landlord directly" },
        ] },
        { id: "utilities", label: "Utilities the subtenant pays", type: "text", half: true, defaultValue: "electricity and internet", placeholder: "electricity and internet" },
        { id: "rules", label: "House rules (optional)", type: "textarea", placeholder: "e.g. No overnight guests for more than 3 nights. Water the plants weekly." },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a);
    const room = c.is("portion", "room");
    const blocks: Block[] = [
      { type: "title", text: "Sublease Agreement" },
      {
        type: "paragraph",
        text: `This Sublease Agreement (the “Sublease”) is made between **${c.v("tenant", "tenant name")}** (the “Tenant”) and **${c.v("subtenant", "subtenant name")}** (the “Subtenant”).`,
      },
      {
        type: "clause",
        title: "Premises",
        paragraphs: [
          `The Tenant rents ${room ? "a private bedroom, together with shared use of the kitchen, bathroom and common areas, in" : "the entire residence at"} ${c.v("address", "property address")} (the “Premises”), which the Tenant leases from ${c.v("landlord", "landlord name")} (the “Landlord”) under a lease${c.has("masterLeaseDate") ? ` dated ${c.date("masterLeaseDate", "")}` : ""} (the “Master Lease”).`,
        ],
      },
      {
        type: "clause",
        title: "Term",
        paragraphs: [
          `The Sublease begins on ${c.date("start", "start date")} and ends on ${c.date("end", "end date")}. The Subtenant shall move out and return all keys by the end date. This Sublease ends automatically if the Master Lease ends for any reason.`,
        ],
      },
      {
        type: "clause",
        title: "Rent",
        paragraphs: [
          `The Subtenant shall pay rent of ${c.money("rent", "monthly rent")} per month, in advance, on the first day of each month, to ${c.is("payTo", "landlord") ? "the Landlord directly, and shall send the Tenant proof of each payment" : "the Tenant"}. Rent for partial months shall be prorated.`,
        ],
      },
      {
        type: "clause",
        title: "Security Deposit",
        paragraphs: [
          c.has("deposit")
            ? `The Subtenant shall pay the Tenant a security deposit of ${c.money("deposit", "deposit")} on signing. The Tenant shall return it, less any lawful deductions for unpaid rent or damage beyond normal wear and tear, with an itemized statement, within the time required by the laws of the State of ${c.v("state", "state")}.`
            : "No security deposit is required.",
        ],
      },
      {
        type: "clause",
        title: "Utilities",
        paragraphs: [
          c.has("utilities")
            ? `The Subtenant shall pay for the following during the Sublease: ${c.v("utilities", "")}. All other utilities remain the Tenant’s responsibility.`
            : "All utilities remain the Tenant’s responsibility.",
        ],
      },
      {
        type: "clause",
        title: "Master Lease",
        paragraphs: [
          "The Subtenant has received a copy of the Master Lease and agrees to follow all of its rules and obligations as they apply to the Premises. The Subtenant shall not do anything that would cause the Tenant to breach the Master Lease. The Tenant remains responsible to the Landlord under the Master Lease.",
        ],
      },
      {
        type: "clause",
        title: "Condition and Damage",
        paragraphs: [
          "The Subtenant accepts the Premises in their current condition, shall keep them clean and in good order, and is responsible for damage caused by the Subtenant or the Subtenant’s guests beyond normal wear and tear. The Subtenant may not sublet further or assign this Sublease.",
        ],
      },
    ];
    if (c.has("rules")) blocks.push({ type: "clause", title: "House Rules", paragraphs: [c.v("rules", "")] });
    blocks.push(
      {
        type: "clause",
        title: "General",
        paragraphs: [
          `This Sublease is governed by the laws of the State of ${c.v("state", "state")}. It is the entire agreement between the Tenant and Subtenant and may only be changed in writing signed by both.`,
        ],
      },
      {
        type: "signatures",
        parties: [
          { heading: "TENANT", lines: [{ label: "Signature" }, { label: "Name", value: c.v("tenant", "tenant name") }, { label: "Date" }] },
          { heading: "SUBTENANT", lines: [{ label: "Signature" }, { label: "Name", value: c.v("subtenant", "subtenant name") }, { label: "Date" }] },
        ],
      },
      {
        type: "signatures",
        intro: "LANDLORD’S CONSENT. The Landlord consents to this Sublease. This consent does not release the Tenant from any obligation under the Master Lease.",
        parties: [{ heading: "LANDLORD", lines: [{ label: "Signature" }, { label: "Name", value: c.v("landlord", "landlord name") }, { label: "Date" }] }],
      },
    );
    return blocks;
  },
};
