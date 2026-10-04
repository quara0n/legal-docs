import { makeCtx, type Block, type Template } from "@/lib/doc";
import { governingLawField, partyFields, partyIntro, sigParty } from "./shared";

const ordinal = (n: string) => {
  const i = Number(n);
  if (!i) return "";
  const s = ["th", "st", "nd", "rd"];
  const v = i % 100;
  return i + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const lease: Template = {
  slug: "residential-lease-agreement",
  locale: "en-US",
  name: "Residential Lease Agreement",
  shortName: "Lease Agreement",
  tagline: "Rent out a house, apartment or room with clear terms.",
  category: "Real estate",
  price: 1900,
  minutes: 10,
  icon: "home",
  seo: {
    title: "Residential Lease Agreement Template: Make Your Rental Lease Online",
    description:
      "Create a residential lease agreement for a house, apartment or room. Fixed-term or month-to-month. Free preview, then $19 once for the PDF. No subscription.",
    intro:
      "A residential lease agreement sets out the rules between a landlord and tenant: rent, deposit, how long the tenancy lasts, who pays utilities and what happens if something goes wrong. A clear written lease prevents most landlord-tenant disputes.",
    whenToUse: [
      "Renting out a house, apartment, condo or basement unit",
      "Renting a room in your home to a lodger",
      "Renewing with an existing tenant on new terms",
      "Switching a tenant to month-to-month",
    ],
    includes: [
      "Fixed-term or month-to-month tenancy",
      "Rent, due date, late fees and grace period",
      "Security deposit terms",
      "Utilities, pets, smoking and occupancy rules",
      "Maintenance, entry and repair responsibilities",
      "Signature blocks for landlord and all tenants",
    ],
    faq: [
      {
        q: "Does this lease work in every state?",
        a: "It covers the terms most states expect, but some states and cities add their own rules (for example deposit limits, required disclosures such as lead paint for pre-1978 homes, or rent control). Check your local requirements before signing.",
      },
      {
        q: "Should I choose fixed-term or month-to-month?",
        a: "A fixed term (often 12 months) gives both sides certainty. Month-to-month is more flexible: either side can end it with written notice, usually 30 days.",
      },
      {
        q: "Can I list more than one tenant?",
        a: "Yes. Add each adult tenant on its own line. Everyone listed is jointly responsible for the full rent.",
      },
    ],
  },
  steps: [
    {
      id: "landlord", label: "Landlord",
      title: "Who is the landlord?",
      description: "The owner of the property, or the company that manages it.",
      fields: partyFields("ll", "landlord"),
    },
    {
      id: "tenants", label: "Tenants",
      title: "Who are the tenants?",
      description: "List every adult who will live in the property.",
      fields: [
        {
          id: "tenants",
          label: "Tenant names",
          type: "textarea",
          required: true,
          placeholder: "John Doe\nMary Doe",
          help: "One name per line.",
        },
      ],
    },
    {
      id: "property", label: "Property",
      title: "Which property is being rented?",
      fields: [
        { id: "propertyAddress", label: "Property address", type: "text", required: true, placeholder: "Street, unit, city, ZIP" },
        {
          id: "propertyType",
          label: "Type of property",
          type: "select",
          defaultValue: "apartment",
          half: true,
          options: [
            { value: "apartment", label: "Apartment" },
            { value: "house", label: "House" },
            { value: "condominium", label: "Condo" },
            { value: "townhouse", label: "Townhouse" },
            { value: "room", label: "Room in a home" },
          ],
        },
        {
          id: "furnished",
          label: "Furnished?",
          type: "select",
          defaultValue: "no",
          half: true,
          options: [
            { value: "no", label: "Unfurnished" },
            { value: "yes", label: "Furnished" },
          ],
        },
        { ...governingLawField, label: "State the property is in", help: undefined },
      ],
    },
    {
      id: "term", label: "Lease term",
      title: "How long is the lease?",
      fields: [
        {
          id: "leaseType",
          label: "Lease type",
          type: "choice",
          defaultValue: "fixed",
          options: [
            { value: "fixed", label: "Fixed term", description: "Ends on a set date, e.g. after 12 months." },
            { value: "monthly", label: "Month-to-month", description: "Continues until someone gives notice." },
          ],
        },
        { id: "startDate", label: "Start date", type: "date", required: true, half: true },
        { id: "endDate", label: "End date", type: "date", required: true, half: true, showIf: (a) => a.leaseType !== "monthly" },
        {
          id: "noticeDays",
          label: "Notice to end (days)",
          type: "number",
          defaultValue: "30",
          half: true,
          showIf: (a) => a.leaseType === "monthly",
        },
      ],
    },
    {
      id: "rent", label: "Rent & deposit",
      title: "Rent and deposit",
      fields: [
        { id: "rent", label: "Monthly rent", type: "money", required: true, half: true, placeholder: "1,500" },
        { id: "dueDay", label: "Due on day", type: "number", defaultValue: "1", half: true, help: "Day of the month" },
        { id: "deposit", label: "Security deposit", type: "money", half: true, placeholder: "1,500" },
        {
          id: "payment",
          label: "How is rent paid?",
          type: "text",
          defaultValue: "bank transfer",
          half: true,
          placeholder: "bank transfer, check, Zelle …",
        },
        { id: "lateFee", label: "Late fee (optional)", type: "money", half: true, placeholder: "50" },
        { id: "graceDays", label: "Grace period (days)", type: "number", defaultValue: "5", half: true },
      ],
    },
    {
      id: "rules", label: "House rules",
      title: "Utilities and house rules",
      fields: [
        {
          id: "tenantUtilities",
          label: "Utilities the tenant pays",
          type: "text",
          defaultValue: "electricity, gas, internet",
          placeholder: "electricity, gas, internet",
          help: "The landlord pays any utilities not listed.",
        },
        {
          id: "pets",
          label: "Pets",
          type: "select",
          defaultValue: "no",
          half: true,
          options: [
            { value: "no", label: "Not allowed" },
            { value: "yes", label: "Allowed" },
            { value: "approval", label: "With written approval" },
          ],
        },
        {
          id: "smoking",
          label: "Smoking",
          type: "select",
          defaultValue: "no",
          half: true,
          options: [
            { value: "no", label: "Not allowed" },
            { value: "outside", label: "Outside only" },
            { value: "yes", label: "Allowed" },
          ],
        },
        { id: "petDeposit", label: "Pet deposit (optional)", type: "money", half: true, showIf: (a) => a.pets === "yes" || a.pets === "approval" },
        { id: "parking", label: "Parking (optional)", type: "text", placeholder: "one assigned space, #12" },
        { id: "extraTerms", label: "Anything else? (optional)", type: "textarea", placeholder: "e.g. Tenant mows the lawn." },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a);
    const monthly = c.is("leaseType", "monthly");
    const pets = c.raw("pets");
    const blocks: Block[] = [
      { type: "title", text: "Residential Lease Agreement" },
      {
        type: "paragraph",
        text: `This Residential Lease Agreement (the “Lease”) is made between ${partyIntro(c, "ll", "landlord name")} (the “Landlord”) and **${c.names("tenants", "tenant names")}** (together, the “Tenant”). Each person signing as Tenant is jointly and severally responsible for all obligations under this Lease.`,
      },
      {
        type: "clause",
        title: "Property",
        paragraphs: [
          `The Landlord rents to the Tenant the ${c.opt("propertyType", { apartment: "apartment", house: "house", condominium: "condominium", townhouse: "townhouse", room: "room" }, "property")} located at ${c.v("propertyAddress", "property address")} (the “Property”)${c.is("furnished", "yes") ? ", together with the furniture and furnishings in it" : ""}${c.has("parking") ? `, together with parking: ${c.v("parking", "")}` : ""}.`,
        ],
      },
      {
        type: "clause",
        title: "Term",
        paragraphs: [
          monthly
            ? `The tenancy begins on ${c.date("startDate", "start date")} and continues on a month-to-month basis. Either party may end it by giving the other at least ${c.v("noticeDays", "number of")} days’ written notice.`
            : `The tenancy begins on ${c.date("startDate", "start date")} and ends on ${c.date("endDate", "end date")}. If the Tenant stays after that date with the Landlord’s consent, the tenancy continues month-to-month on the same terms, and either party may end it with 30 days’ written notice.`,
        ],
      },
      {
        type: "clause",
        title: "Rent",
        paragraphs: [
          `The Tenant shall pay rent of ${c.money("rent", "monthly rent")} per month, in advance, on the ${c.has("dueDay") ? `⟦dueDay¦${ordinal(c.raw("dueDay"))}⟧` : "⟦dueDay¦?due day⟧"} day of each month, by ${c.v("payment", "payment method")}. Rent for any partial month shall be prorated.`,
          c.has("lateFee")
            ? `If rent is not received within ${c.v("graceDays", "number of")} days after it is due, the Tenant shall pay a late fee of ${c.money("lateFee", "late fee")}, to the extent permitted by law.`
            : "",
        ].filter(Boolean),
      },
      {
        type: "clause",
        title: "Security Deposit",
        paragraphs: [
          c.has("deposit")
            ? `On signing this Lease, the Tenant shall pay a security deposit of ${c.money("deposit", "deposit")}${c.has("petDeposit") ? ` and a pet deposit of ${c.money("petDeposit", "pet deposit")}` : ""}. The Landlord may use the deposit to cover unpaid rent and damage beyond normal wear and tear. The Landlord shall return the deposit, less any lawful deductions with an itemized statement, within the time required by the laws of the State of ${c.v("state", "state")}.`
            : "No security deposit is required under this Lease.",
        ],
      },
      {
        type: "clause",
        title: "Utilities",
        paragraphs: [
          c.has("tenantUtilities")
            ? `The Tenant is responsible for the following utilities and services: ${c.v("tenantUtilities", "")}. The Landlord is responsible for all other utilities serving the Property.`
            : "The Landlord is responsible for all utilities serving the Property.",
        ],
      },
      {
        type: "clause",
        title: "Use and Occupancy",
        paragraphs: [
          "The Property shall be used only as a private residence by the Tenant and the Tenant’s minor children. Guests may not stay for more than 14 consecutive days without the Landlord’s written consent. The Tenant shall not sublet the Property or assign this Lease without the Landlord’s written consent.",
        ],
      },
      {
        type: "clause",
        title: "Pets and Smoking",
        paragraphs: [
          `${pets === "yes" ? "Pets are allowed. The Tenant is responsible for any damage caused by pets." : pets === "approval" ? "No pets may be kept on the Property without the Landlord’s prior written approval." : "No pets may be kept on the Property, except service or assistance animals as required by law."} ${c.is("smoking", "yes") ? "Smoking is permitted." : c.is("smoking", "outside") ? "Smoking is permitted only outside the building, away from doors and windows." : "Smoking of any kind is not permitted anywhere on the Property."}`,
        ],
      },
      {
        type: "clause",
        title: "Maintenance and Repairs",
        paragraphs: [
          "The Tenant shall keep the Property clean and in good condition, promptly report any needed repairs in writing, and pay for damage caused by the Tenant or the Tenant’s guests beyond normal wear and tear. The Landlord shall keep the Property in a habitable condition and make necessary repairs within a reasonable time. The Tenant shall not make alterations without the Landlord’s written consent.",
        ],
      },
      {
        type: "clause",
        title: "Landlord’s Entry",
        paragraphs: [
          "The Landlord may enter the Property at reasonable times to inspect, make repairs or show it to prospective tenants or buyers, after giving the Tenant reasonable notice (at least 24 hours, or longer if required by law), except in an emergency.",
        ],
      },
      {
        type: "clause",
        title: "End of Tenancy",
        paragraphs: [
          "At the end of the tenancy the Tenant shall return all keys and leave the Property clean and in the same condition as at the start, except for normal wear and tear. Property left behind may be handled as permitted by law.",
        ],
      },
      {
        type: "clause",
        title: "Default",
        paragraphs: [
          "If the Tenant fails to pay rent when due or materially breaches this Lease, the Landlord may end the tenancy and pursue any remedies available under applicable law, after giving any notice the law requires.",
        ],
      },
    ];
    if (c.has("extraTerms"))
      blocks.push({ type: "clause", title: "Additional Terms", paragraphs: [c.v("extraTerms", "")] });
    blocks.push(
      {
        type: "clause",
        title: "General",
        paragraphs: [
          `This Lease is governed by the laws of the State of ${c.v("state", "state")}. If any part of this Lease conflicts with applicable law, the law controls and the rest of the Lease remains in effect. This Lease is the entire agreement between the parties and may only be changed in writing signed by both parties. Notices shall be given in writing to the addresses above or to the Property.`,
        ],
      },
      {
        type: "signatures",
        intro: "The parties have signed this Lease on the dates written below.",
        parties: [
          sigParty(c, "ll", "LANDLORD", "landlord name"),
          ...tenantSigs(c.raw("tenants")),
        ],
      },
    );
    return blocks;
  },
};

function tenantSigs(raw: string) {
  const names = raw
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (names.length === 0)
    return [{ heading: "TENANT", lines: [{ label: "Signature" }, { label: "Name", value: "⟦tenants¦?tenant name⟧" }, { label: "Date" }] }];
  return names.map((n, i) => ({
    heading: names.length > 1 ? `TENANT ${i + 1}` : "TENANT",
    lines: [{ label: "Signature" }, { label: "Name", value: `⟦tenants¦${n.replace(/[⟦⟧¦*]/g, "")}⟧` }, { label: "Date" }],
  }));
}
