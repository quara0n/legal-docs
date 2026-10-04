import type { Answers, Ctx, Field, SigParty } from "@/lib/doc";

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
  "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const isCompany = (prefix: string) => (a: Answers) => a[`${prefix}Type`] === "company";

// The same "who is this party" questions are used by most templates.
export function partyFields(prefix: string, noun: string, opts: { allowCompany?: boolean; email?: boolean } = {}): Field[] {
  const allowCompany = opts.allowCompany ?? true;
  const fields: Field[] = [];
  if (allowCompany)
    fields.push({
      id: `${prefix}Type`,
      label: `Is the ${noun} a person or a company?`,
      type: "choice",
      defaultValue: "individual",
      options: [
        { value: "individual", label: "A person" },
        { value: "company", label: "A company" },
      ],
    });
  fields.push(
    {
      id: `${prefix}Name`,
      label: "Full legal name",
      type: "text",
      required: true,
      placeholder: "e.g. Jane Smith or Acme LLC",
      help: "Companies: use the exact registered name, including LLC or Inc.",
    },
    {
      id: `${prefix}Address`,
      label: "Address",
      type: "text",
      placeholder: "Street, city, state, ZIP",
    },
  );
  if (opts.email) fields.push({ id: `${prefix}Email`, label: "Email (optional)", type: "email", placeholder: "name@example.com" });
  if (allowCompany)
    fields.push(
      {
        id: `${prefix}Signer`,
        label: "Who signs for the company?",
        type: "text",
        half: true,
        placeholder: "Full name",
        showIf: isCompany(prefix),
      },
      {
        id: `${prefix}SignerTitle`,
        label: "Their title",
        type: "text",
        half: true,
        placeholder: "e.g. CEO",
        showIf: isCompany(prefix),
      },
    );
  return fields;
}

// "Jane Smith, of 12 Main St, Springfield"  or  "Acme LLC, a company with its address at …"
export function partyIntro(c: Ctx, prefix: string, label: string) {
  const name = `**${c.v(`${prefix}Name`, label)}**`;
  if (!c.has(`${prefix}Address`)) return name;
  return c.is(`${prefix}Type`, "company")
    ? `${name}, with its principal address at ${c.v(`${prefix}Address`, "address")}`
    : `${name}, of ${c.v(`${prefix}Address`, "address")}`;
}

export function sigParty(c: Ctx, prefix: string, heading: string, label: string): SigParty {
  if (c.is(`${prefix}Type`, "company"))
    return {
      heading,
      lines: [
        { label: "Company", value: c.v(`${prefix}Name`, label) },
        { label: "Signature" },
        { label: "Name", value: c.v(`${prefix}Signer`, "signer name") },
        { label: "Title", value: c.v(`${prefix}SignerTitle`, "title") },
        { label: "Date" },
      ],
    };
  return {
    heading,
    lines: [{ label: "Signature" }, { label: "Name", value: c.v(`${prefix}Name`, label) }, { label: "Date" }],
  };
}

export const governingLawField: Field = {
  id: "state",
  label: "Which state's laws apply?",
  type: "region",
  required: true,
  help: "Usually the state where you (or the property) are located.",
};
