import type { Answers, Ctx, Field, SigParty } from "@/lib/doc";

const isCompany = (prefix: string) => (a: Answers) => a[`${prefix}Type`] === "company";

// "Hvem er denne parten?" — brukes av de fleste malene.
// `noun` is the party in the definite form, e.g. "utleier", "kjøper".
export function partyFields(prefix: string, noun: string, opts: { allowCompany?: boolean; email?: boolean; idRequired?: boolean } = {}): Field[] {
  const allowCompany = opts.allowCompany ?? true;
  const fields: Field[] = [];
  if (allowCompany)
    fields.push({
      id: `${prefix}Type`,
      label: `Er ${noun} en person eller et selskap?`,
      type: "choice",
      defaultValue: "individual",
      options: [
        { value: "individual", label: "En person" },
        { value: "company", label: "Et selskap" },
      ],
    });
  fields.push({
    id: `${prefix}Name`,
    label: "Fullt navn",
    type: "text",
    required: true,
    placeholder: "f.eks. Kari Nordmann eller Eksempel AS",
    help: allowCompany ? "Selskap: bruk det registrerte navnet, med AS, ENK eller lignende." : undefined,
  });
  fields.push({
    id: `${prefix}Birth`,
    label: "Fødselsdato",
    type: "date",
    half: true,
    required: opts.idRequired,
    help: "Gjør det tydelig hvem avtalen gjelder.",
    showIf: allowCompany ? (a) => !isCompany(prefix)(a) : undefined,
  });
  if (allowCompany)
    fields.push({
      id: `${prefix}OrgNr`,
      label: "Organisasjonsnummer",
      type: "text",
      half: true,
      required: opts.idRequired,
      placeholder: "123 456 789",
      showIf: isCompany(prefix),
    });
  fields.push({ id: `${prefix}Address`, label: "Adresse", type: "text", placeholder: "Gate 1, 0150 Oslo" });
  if (opts.email) fields.push({ id: `${prefix}Email`, label: "E-post (valgfritt)", type: "email", placeholder: "navn@eksempel.no" });
  if (allowCompany)
    fields.push(
      { id: `${prefix}Signer`, label: "Hvem signerer for selskapet?", type: "text", half: true, placeholder: "Fullt navn", showIf: isCompany(prefix) },
      { id: `${prefix}SignerTitle`, label: "Rolle", type: "text", half: true, placeholder: "f.eks. daglig leder", showIf: isCompany(prefix) },
    );
  return fields;
}

// "**Kari Nordmann** (f. 1. mars 1985), Gate 1, 0150 Oslo"
// "**Eksempel AS** (org.nr. 123 456 789), Gate 1, 0150 Oslo"
export function partyIntro(c: Ctx, prefix: string, label: string) {
  let s = `**${c.v(`${prefix}Name`, label)}**`;
  if (c.is(`${prefix}Type`, "company")) {
    if (c.has(`${prefix}OrgNr`)) s += ` (org.nr. ${c.v(`${prefix}OrgNr`, "org.nr.")})`;
  } else if (c.has(`${prefix}Birth`)) s += ` (f. ${c.date(`${prefix}Birth`, "fødselsdato")})`;
  if (c.has(`${prefix}Address`)) s += `, ${c.v(`${prefix}Address`, "adresse")}`;
  return s;
}

export function sigParty(c: Ctx, prefix: string, heading: string, label: string): SigParty {
  if (c.is(`${prefix}Type`, "company"))
    return {
      heading,
      lines: [
        { label: "Selskap", value: c.v(`${prefix}Name`, label) },
        { label: "Sted og dato" },
        { label: "Underskrift" },
        { label: "Navn", value: c.v(`${prefix}Signer`, "navn") },
        { label: "Rolle", value: c.v(`${prefix}SignerTitle`, "rolle") },
      ],
    };
  return {
    heading,
    lines: [{ label: "Sted og dato" }, { label: "Underskrift" }, { label: "Navn", value: c.v(`${prefix}Name`, label) }],
  };
}

// Simple signature block for a named person who is not a party field set.
export function sigPerson(heading: string, name: string): SigParty {
  return { heading, lines: [{ label: "Sted og dato" }, { label: "Underskrift" }, { label: "Navn", value: name }] };
}

export const NORWEGIAN_LAW =
  "Avtalen er underlagt norsk rett. Partene skal først forsøke å løse uenighet gjennom forhandlinger. Tvister som ikke løses på denne måten, kan bringes inn for de alminnelige domstolene.";
