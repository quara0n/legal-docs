import { makeCtx, type Block, type Template, type Warning } from "@/lib/doc";
import { NORWEGIAN_LAW, partyFields, partyIntro, sigParty } from "./shared";

const TERMS: Record<string, string> = {
  "1": "ett (1) år",
  "2": "to (2) år",
  "3": "tre (3) år",
  "5": "fem (5) år",
};

// Adds a full stop unless the answer already ends with punctuation.
const dot = (raw: string) => (/[.!?]$/.test(raw) ? "" : ".");

export const taushetserklaering: Template = {
  slug: "taushetserklaering",
  locale: "nb-NO",
  name: "Taushetserklæring",
  shortName: "Taushetserklæring",
  tagline: "Beskytt ideer og forretningsinformasjon før du deler dem.",
  category: "Business",
  price: 9900,
  minutes: 5,
  icon: "shield",
  seo: {
    title: "Taushetserklæring mal: Lag en NDA på norsk på 5 minutter",
    description:
      "Lag en ensidig eller gjensidig taushetserklæring (NDA) etter norsk rett, med valgfri konvensjonalbot. Forhåndsvis gratis, betal 99 kr én gang for PDF-en.",
    intro:
      "En taushetserklæring (også kalt konfidensialitetsavtale eller NDA) er en avtale der den ene eller begge parter lover å holde informasjon hemmelig og bare bruke den til et bestemt formål. Bruk den før du viser en forretningsidé, kildekode, kundelister eller økonomiske tall til noen utenfor virksomheten din.",
    whenToUse: [
      "Før du presenterer en idé for en investor, partner eller produsent",
      "Når en frilanser eller konsulent får innsyn i intern informasjon",
      "Ved samtaler om samarbeid, oppkjøp eller fusjon",
      "Når du deler en prototype eller et produkt som ikke er lansert",
    ],
    includes: [
      "Ensidig eller gjensidig taushetsplikt",
      "Tydelig definisjon av hva som er konfidensielt, med vanlige unntak",
      "Krav om tilbakelevering eller sletting av materiale",
      "Varighet på 1–5 år, og vern av forretningshemmeligheter så lenge de er hemmelige",
      "Valgfri konvensjonalbot ved brudd",
      "Forbehold for varsling og opplysninger til offentlige myndigheter",
    ],
    faq: [
      {
        q: "Er en taushetserklæring juridisk bindende?",
        a: "Ja, som hovedregel er en taushetserklæring bindende når begge parter har akseptert den, for eksempel ved signering. Det finnes ingen formkrav, så elektronisk signatur (som BankID) fungerer fint. Taushetsplikten må likevel være rimelig: en domstol kan sette til side eller lempe vilkår som er urimelige, og avtalen kan ikke hindre lovlig varsling.",
      },
      {
        q: "Hva er konvensjonalbot?",
        a: "En konvensjonalbot er et beløp som er avtalt på forhånd, og som skal betales ved brudd på avtalen, uten at den andre parten må bevise hvor stort tapet er. Den gjør det enklere å reagere på brudd. Er beløpet urimelig høyt, kan domstolene sette det ned. I denne malen hindrer ikke konvensjonalboten krav om erstatning for et større, dokumentert tap.",
      },
      {
        q: "Hvor lenge bør taushetsplikten vare?",
        a: "To til fem år er vanlig for forretningsinformasjon. Forretningshemmeligheter, som oppskrifter, kildekode eller kundedata, er i tillegg vernet så lenge de faktisk holdes hemmelige, og det tar denne malen høyde for.",
      },
      {
        q: "Kan jeg bruke denne for ansatte?",
        a: "For ansatte står taushetsplikten som regel i arbeidsavtalen, og arbeidsforholdet har egne regler. Denne malen er laget for avtaler med samarbeidspartnere, investorer, leverandører og frilansere.",
      },
    ],
  },
  steps: [
    {
      id: "type", label: "Type",
      title: "Hva slags taushetserklæring trenger du?",
      description: "Du kan endre dette senere. Forhåndsvisningen oppdateres mens du fyller ut.",
      fields: [
        {
          id: "ndaType",
          label: "Type",
          type: "choice",
          defaultValue: "ensidig",
          options: [
            { value: "ensidig", label: "Ensidig", description: "Bare den ene parten deler konfidensiell informasjon." },
            { value: "gjensidig", label: "Gjensidig", description: "Begge parter deler, og begge må holde det hemmelig." },
          ],
        },
      ],
    },
    {
      id: "partyA", label: "Første part",
      title: (a) => (a.ndaType === "gjensidig" ? "Hvem er den første parten?" : "Hvem deler informasjonen?"),
      description: (a) => (a.ndaType === "gjensidig" ? "Som regel deg eller selskapet ditt." : "Dette er «Avgiver», som regel deg."),
      fields: partyFields("a", "parten"),
    },
    {
      id: "partyB", label: "Andre part",
      title: (a) => (a.ndaType === "gjensidig" ? "Hvem er den andre parten?" : "Hvem mottar informasjonen?"),
      description: (a) =>
        a.ndaType === "gjensidig" ? "Den andre parten i avtalen." : "Dette er «Mottaker», som lover å holde informasjonen hemmelig.",
      fields: partyFields("b", "parten"),
    },
    {
      id: "purpose", label: "Formål",
      title: "Hvorfor deles informasjonen?",
      description: "Et kort og tydelig formål begrenser hva informasjonen kan brukes til.",
      fields: [
        {
          id: "purpose",
          label: "Formål",
          type: "textarea",
          required: true,
          placeholder: "å vurdere et mulig samarbeid om utvikling og salg av en ny app",
          help: "Fullfør setningen: «Informasjonen kan bare brukes til …»",
        },
      ],
    },
    {
      id: "terms", label: "Varighet",
      title: "Varighet og reaksjoner ved brudd",
      fields: [
        {
          id: "term",
          label: "Hvor lenge skal taushetsplikten vare?",
          type: "select",
          defaultValue: "3",
          help: "Regnet fra avtalen er signert. Forretningshemmeligheter er vernet så lenge de er hemmelige uansett.",
          options: [
            { value: "1", label: "1 år" },
            { value: "2", label: "2 år" },
            { value: "3", label: "3 år (vanligst)" },
            { value: "5", label: "5 år" },
          ],
        },
        {
          id: "penalty",
          label: "Skal det være konvensjonalbot ved brudd?",
          type: "choice",
          defaultValue: "nei",
          options: [
            { value: "nei", label: "Nei", description: "Erstatning for dokumentert tap etter vanlige regler." },
            { value: "ja", label: "Ja", description: "Et fast beløp per brudd, uten at tapet må bevises." },
          ],
        },
        {
          id: "penaltyAmount",
          label: "Konvensjonalbot per brudd",
          type: "money",
          half: true,
          placeholder: "50 000",
          showIf: (a) => a.penalty === "ja",
        },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a, "nb-NO");
    const mutual = c.is("ndaType", "gjensidig");
    // Defined terms for the one-way version; neutral wording for the mutual one.
    const recv = mutual ? "den mottakende parten" : "Mottaker";
    const Recv = mutual ? "Den mottakende parten" : "Mottaker";
    const disc = mutual ? "den avgivende parten" : "Avgiver";

    const blocks: Block[] = [
      { type: "title", text: "Taushetserklæring" },
      { type: "subtitle", text: mutual ? "Gjensidig avtale om taushetsplikt" : "Avtale om taushetsplikt" },
      {
        type: "paragraph",
        text: mutual
          ? `Denne avtalen («Avtalen») er inngått mellom ${partyIntro(c, "a", "første part")} og ${partyIntro(c, "b", "andre part")}, hver for seg kalt «Part» og sammen «Partene».`
          : `Denne avtalen («Avtalen») er inngått mellom ${partyIntro(c, "a", "avgiver")} («Avgiver») og ${partyIntro(c, "b", "mottaker")} («Mottaker»).`,
      },
      {
        type: "clause",
        title: "Formål",
        paragraphs: [
          mutual
            ? `Partene skal utveksle konfidensiell informasjon med følgende formål («Formålet»): ${c.v("purpose", "formål")}${dot(c.raw("purpose"))} Hver Part kan både gi og motta informasjon etter Avtalen. Når en Part gir informasjon, kalles den i Avtalen «den avgivende parten», og den Parten som mottar informasjonen, kalles «den mottakende parten».`
            : `Avgiver skal gi Mottaker tilgang til konfidensiell informasjon med følgende formål («Formålet»): ${c.v("purpose", "formål")}${dot(c.raw("purpose"))}`,
        ],
      },
      {
        type: "clause",
        title: "Konfidensiell informasjon",
        paragraphs: [
          `Med konfidensiell informasjon menes all informasjon som ikke er offentlig kjent, og som ${recv} får fra ${disc} i forbindelse med Formålet, uansett om den gis muntlig, skriftlig, elektronisk eller ved besøk og demonstrasjoner. Dette omfatter blant annet:`,
        ],
        list: [
          "forretningshemmeligheter og knowhow;",
          "kunde- og leverandørinformasjon, priser og avtalevilkår;",
          "tekniske data, programvare, kildekode, design og oppfinnelser;",
          "forretningsplaner, markedsplaner, økonomiske opplysninger og budsjetter; og",
          "annen informasjon som en fornuftig person vil forstå er konfidensiell.",
        ],
      },
      {
        type: "clause",
        title: "Unntak",
        paragraphs: [`Taushetsplikten gjelder ikke informasjon som ${recv} kan vise at:`],
        list: [
          `er eller blir offentlig kjent uten at ${recv} har brutt Avtalen;`,
          `${recv} allerede kjente lovlig før den ble mottatt etter Avtalen;`,
          `${recv} har mottatt lovlig fra en tredjeperson uten taushetsplikt; eller`,
          `${recv} har utviklet selv, uten å bruke den konfidensielle informasjonen.`,
        ],
      },
      {
        type: "clause",
        title: "Bruk og oppbevaring",
        paragraphs: [`${Recv} skal:`],
        list: [
          "bare bruke den konfidensielle informasjonen til Formålet;",
          "ikke gi informasjonen videre til andre, bortsett fra egne ansatte, styremedlemmer og rådgivere som trenger den for Formålet, og som har en taushetsplikt som er minst like streng som etter Avtalen;",
          "beskytte informasjonen med minst samme grad av aktsomhet som egen konfidensiell informasjon, og aldri mindre enn det som er forsvarlig; og",
          `straks varsle ${disc} dersom informasjonen er kommet på avveie eller er brukt i strid med Avtalen.`,
        ],
      },
      {
        type: "clause",
        title: "Pålegg om utlevering",
        paragraphs: [
          `Dersom ${recv} plikter å utlevere konfidensiell informasjon etter lov, rettskjennelse eller pålegg fra offentlig myndighet, kan informasjonen utleveres i den utstrekning plikten gjelder. ${Recv} skal i så fall, så langt det er lovlig, varsle ${disc} på forhånd, slik at ${disc} kan ivareta sine interesser.`,
        ],
      },
      {
        type: "clause",
        title: "Tilbakelevering og sletting",
        paragraphs: [
          `Når ${disc} ber om det, og senest når samtalene om Formålet avsluttes, skal ${recv} levere tilbake eller slette all konfidensiell informasjon, inkludert kopier, og bekrefte skriftlig at dette er gjort. ${Recv} kan beholde kopier som må oppbevares etter lov. Taushetsplikten gjelder fortsatt for slike kopier.`,
        ],
      },
      {
        type: "clause",
        title: "Varighet",
        paragraphs: [
          `Taushetsplikten gjelder i ${c.opt("term", TERMS, "antall år")} fra Avtalen er signert av begge parter, også om samtalene avsluttes uten at det blir noe samarbeid.`,
          "Informasjon som er en forretningshemmelighet, skal likevel holdes hemmelig så lenge den er en forretningshemmelighet. Vernet etter forretningshemmelighetsloven gjelder i tillegg til Avtalen.",
        ],
      },
      {
        type: "clause",
        title: "Ingen overføring av rettigheter",
        paragraphs: [
          `Konfidensiell informasjon tilhører fortsatt ${disc}. Avtalen gir ingen lisens, eiendomsrett eller annen rett til patenter, opphavsrett, varemerker eller andre immaterielle rettigheter. Avtalen forplikter ikke ${mutual ? "Partene" : "partene"} til å inngå noe videre samarbeid.`,
        ],
      },
      {
        type: "clause",
        title: "Brudd på Avtalen",
        paragraphs: c.is("penalty", "ja")
          ? [
              `Ved brudd på taushetsplikten skal ${recv} betale en konvensjonalbot på ${c.money("penaltyAmount", "beløp")} til ${disc} for hvert brudd. Konvensjonalboten kan kreves uten at ${disc} må dokumentere tap.`,
              `Konvensjonalboten begrenser ikke retten til å kreve erstatning for dokumentert tap som er større enn konvensjonalboten, eller retten til å kreve midlertidig forføyning eller andre tiltak for å stanse bruddet.`,
            ]
          : [
              `Ved brudd på taushetsplikten kan ${disc} kreve erstatning for sitt tap etter alminnelige regler, og kan kreve midlertidig forføyning eller andre tiltak for å stanse bruddet.`,
            ],
      },
      {
        type: "clause",
        title: "Varsling og opplysninger til myndigheter",
        paragraphs: [
          "Avtalen begrenser ikke noens rett til å varsle om kritikkverdige forhold etter arbeidsmiljøloven, eller til å gi opplysninger til offentlige myndigheter når loven gir rett eller plikt til det.",
        ],
      },
      {
        type: "clause",
        title: "Øvrige bestemmelser",
        paragraphs: [
          `Avtalen er den fullstendige avtalen mellom ${mutual ? "Partene" : "partene"} om taushetsplikt for den konfidensielle informasjonen, og kan bare endres skriftlig. Dersom en bestemmelse i Avtalen blir ansett som ugyldig, gjelder resten av Avtalen fortsatt. Avtalen kan signeres elektronisk.`,
        ],
      },
      { type: "clause", title: "Lovvalg og tvister", paragraphs: [NORWEGIAN_LAW] },
      {
        type: "signatures",
        intro: "Avtalen er utstedt i to eksemplarer, ett til hver part.",
        parties: [
          sigParty(c, "a", mutual ? "PART 1" : "AVGIVER", mutual ? "første part" : "avgiver"),
          sigParty(c, "b", mutual ? "PART 2" : "MOTTAKER", mutual ? "andre part" : "mottaker"),
        ],
      },
    ];
    return blocks;
  },
  warnings(a) {
    const out: Warning[] = [];
    if (a.penalty === "ja")
      out.push({
        level: "info",
        text: "Velg et beløp som står i forhold til hva et brudd realistisk kan koste. En svært høy konvensjonalbot kan settes ned av domstolene etter avtaleloven § 36.",
        fields: ["penalty", "penaltyAmount"],
      });
    return out;
  },
};
