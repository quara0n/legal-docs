import { makeCtx, parseAmount, type Answers, type Block, type Template, type Warning } from "@/lib/doc";
import { NORWEGIAN_LAW, partyFields, partyIntro, sigParty, sigPerson } from "./shared";

const FREQ: Record<string, string> = { monthly: "hver måned", quarterly: "hvert kvartal" };
const isLump = (a: Answers) => a.plan === "lump";
const hasGuarantor = (a: Answers) => a.guarantor === "yes";

// "5" / "4,5" / "4.5 %" -> 4.5
const rateOf = (a: Answers) => {
  const n = Number((a.rate ?? "").replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export const gjeldsbrev: Template = {
  slug: "gjeldsbrev",
  locale: "nb-NO",
  name: "Gjeldsbrev (låneavtale)",
  shortName: "Gjeldsbrev",
  tagline: "Skriv ned et privat lån med beløp, rente og en tydelig nedbetalingsplan.",
  category: "Personal",
  price: 9900,
  minutes: 5,
  icon: "cash",
  seo: {
    title: "Gjeldsbrev mal – lag en enkel låneavtale mellom privatpersoner",
    description:
      "Lag gjeldsbrev for lån til familie, venner eller et lite selskap: rente, avdrag, mislighold og kausjonist. Forhåndsvis gratis, betal 99 kr én gang for PDF-en.",
    intro:
      "Et gjeldsbrev er en skriftlig erklæring fra låntakeren om at hun eller han skylder långiveren penger, og hvordan lånet skal betales tilbake. Det gjør et privat lån mellom familie, venner eller små bedrifter tydelig for begge, og et signert gjeldsbrev kan brukes som grunnlag for utlegg hvis lånet ikke blir betalt.",
    whenToUse: [
      "Du låner bort penger til et familiemedlem eller en venn",
      "Du låner penger fra en privatperson eller en forretningsforbindelse",
      "Du vil skrive ned et lån som tidligere bare er avtalt muntlig",
      "Du vil ha en kausjonist som hefter hvis låntakeren ikke betaler",
    ],
    includes: [
      "Lånebeløp, utbetalingsdato og rente (også rentefritt lån)",
      "Nedbetaling med faste terminbeløp eller alt på én gang",
      "Rett til å betale tilbake tidligere uten kostnad",
      "Forsinkelsesrente og hva som skjer ved mislighold",
      "Valgfri kausjonist (selvskyldnerkausjon) med eget signaturfelt",
      "Klausul om at gjeldsbrevet er tvangsgrunnlag for utlegg",
    ],
    faq: [
      {
        q: "Må et gjeldsbrev bevitnes?",
        a: "Nei. Et gjeldsbrev er gyldig når låntakeren har signert det, og det finnes ikke noe krav om vitner. To vitner som signerer, kan likevel gjøre det lettere å bevise at signaturen er ekte hvis det senere blir uenighet.",
      },
      {
        q: "Hva skjer hvis låntaker ikke betaler?",
        a: "Långiver bør først sende en skriftlig påminnelse. Et signert gjeldsbrev er et såkalt særlig tvangsgrunnlag for utlegg (tvangsfullbyrdelsesloven § 7-2 bokstav a). Det betyr at långiver normalt kan gå rett til namsmannen uten å gå via forliksrådet, etter først å ha sendt låntakeren et varsel med minst 14 dagers betalingsfrist. Er låntakeren uenig i kravet, kan saken likevel ende i retten.",
      },
      {
        q: "Må jeg ta rente når jeg låner bort penger til familie?",
        a: "Nei, dere kan avtale et rentefritt lån. Renter långiveren får, er normalt skattepliktig inntekt, og låntakeren kan normalt trekke fra renter hun eller han betaler. Ved store lån uten rente, eller når lånet egentlig er ment som en gave, kan det ha skattemessige følger. Spør Skatteetaten eller en regnskapsfører hvis beløpet er stort.",
      },
    ],
  },
  steps: [
    { id: "lender", label: "Långiver", title: "Hvem låner bort pengene?", fields: partyFields("l", "långiver") },
    { id: "borrower", label: "Låntaker", title: "Hvem låner pengene?", fields: partyFields("b", "låntaker") },
    {
      id: "loan",
      label: "Lånet",
      title: "Hvor mye, og til hvilken rente?",
      fields: [
        { id: "amount", label: "Lånebeløp", type: "money", required: true, half: true, placeholder: "50 000" },
        { id: "date", label: "Dato lånet betales ut", type: "date", required: true, half: true },
        {
          id: "rate",
          label: "Rente (% per år)",
          type: "text",
          half: true,
          defaultValue: "0",
          placeholder: "5",
          help: "Skriv 0 for et rentefritt lån.",
        },
      ],
    },
    {
      id: "repay",
      label: "Nedbetaling",
      title: "Hvordan skal lånet betales tilbake?",
      fields: [
        {
          id: "plan",
          label: "Nedbetaling",
          type: "choice",
          defaultValue: "installments",
          options: [
            { value: "installments", label: "Med faste avdrag", description: "Et fast beløp med jevne mellomrom til lånet er nedbetalt." },
            { value: "lump", label: "Alt på én gang", description: "Hele lånet betales tilbake på en bestemt dato." },
          ],
        },
        { id: "installment", label: "Terminbeløp", type: "money", half: true, required: true, placeholder: "2 000", showIf: (a) => !isLump(a) },
        {
          id: "frequency",
          label: "Hvor ofte",
          type: "select",
          half: true,
          defaultValue: "monthly",
          options: [
            { value: "monthly", label: "Hver måned" },
            { value: "quarterly", label: "Hvert kvartal" },
          ],
          showIf: (a) => !isLump(a),
        },
        { id: "firstPayment", label: "Første forfallsdato", type: "date", half: true, required: true, showIf: (a) => !isLump(a) },
        { id: "dueDate", label: "Forfallsdato", type: "date", half: true, required: true, showIf: isLump },
        { id: "account", label: "Långivers kontonummer", type: "text", half: true, placeholder: "1234 56 78901" },
      ],
    },
    {
      id: "guarantee",
      label: "Kausjonist",
      title: "Skal noen kausjonere for lånet?",
      description: "En kausjonist lover å betale hvis låntakeren ikke gjør det.",
      fields: [
        {
          id: "guarantor",
          label: "Kausjonist",
          type: "choice",
          defaultValue: "no",
          options: [
            { value: "no", label: "Nei" },
            { value: "yes", label: "Ja", description: "Selvskyldnerkausjon: långiver kan kreve kausjonisten direkte." },
          ],
        },
        { id: "guarantorName", label: "Kausjonistens fulle navn", type: "text", required: true, showIf: hasGuarantor },
        { id: "guarantorBirth", label: "Fødselsdato", type: "date", half: true, showIf: hasGuarantor },
        { id: "guarantorAddress", label: "Adresse", type: "text", half: true, showIf: hasGuarantor },
        {
          id: "guarantorMax",
          label: "Største beløp kausjonisten hefter for",
          type: "money",
          half: true,
          placeholder: "60 000",
          help: "Hvis du lar feltet stå tomt, brukes lånebeløpet.",
          showIf: hasGuarantor,
        },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a, "nb-NO");
    const lump = isLump(a);
    const rate = rateOf(a);
    const blocks: Block[] = [
      { type: "title", text: "Gjeldsbrev" },
      {
        type: "paragraph",
        text: `**Lånebeløp:** ${c.money("amount", "lånebeløp")}    **Utbetalt:** ${c.date("date", "dato")}`,
      },
      { type: "heading", text: "Partene" },
      { type: "paragraph", text: `**Långiver:** ${partyIntro(c, "l", "långivers navn")} («Långiver»)` },
      { type: "paragraph", text: `**Låntaker:** ${partyIntro(c, "b", "låntakers navn")} («Låntaker»)` },
      {
        type: "clause",
        title: "Lånet",
        paragraphs: [
          `Låntaker erkjenner å skylde Långiver ${c.money("amount", "lånebeløp")}, som Långiver har betalt ut til Låntaker ${c.date("date", "dato")}. Låntaker forplikter seg til å betale lånet tilbake etter vilkårene i dette gjeldsbrevet.`,
        ],
      },
      {
        type: "clause",
        title: "Rente",
        paragraphs: [
          rate > 0
            ? `Lånet har en fast rente på ${c.v("rate", "rente")} % per år. Renten beregnes av det til enhver tid utestående lånebeløpet fra utbetalingsdagen, og løper til lånet er nedbetalt.`
            : "Lånet er rentefritt.",
        ],
      },
    ];

    const account = c.has("account") ? ` til Långivers konto ${c.v("account", "kontonummer")}` : " til den kontoen Långiver oppgir";
    blocks.push({
      type: "clause",
      title: "Nedbetaling",
      paragraphs: lump
        ? [
            `Lånet${rate > 0 ? " med påløpt rente" : ""} skal betales tilbake i sin helhet senest ${c.date("dueDate", "forfallsdato")}.`,
            `Betaling skjer${account}.`,
          ]
        : [
            `Låntaker betaler ${c.money("installment", "terminbeløp")} ${c.opt("frequency", FREQ, "hver termin")}, første gang ${c.date("firstPayment", "første forfallsdato")}, til lånet${rate > 0 ? " og påløpt rente" : ""} er betalt fullt ut. Siste terminbeløp settes til det som da gjenstår.${rate > 0 ? " Hver innbetaling går først til påløpt rente og deretter til nedbetaling av lånet." : ""}`,
            `Betaling skjer${account}.`,
          ],
    });

    blocks.push(
      {
        type: "clause",
        title: "Innfrielse før tiden",
        paragraphs: [
          `Låntaker kan når som helst betale tilbake hele eller deler av lånet før avtalt tid, uten gebyr eller andre kostnader.${rate > 0 ? " Det skal da bare betales rente frem til innbetalingsdagen." : ""}`,
        ],
      },
      {
        type: "clause",
        title: "Forsinket betaling",
        paragraphs: [
          "Betales et beløp ikke ved forfall, skal Låntaker betale forsinkelsesrente etter forsinkelsesrenteloven fra forfallsdagen til betaling skjer.",
        ],
      },
      {
        type: "clause",
        title: "Mislighold og oppsigelse",
        paragraphs: ["Långiver kan si opp lånet og kreve hele det utestående beløpet med renter betalt straks dersom:"],
        list: [
          "et forfalt beløp er mer enn 30 dager forsinket, og Låntaker ikke har betalt innen 14 dager etter å ha fått skriftlig varsel fra Långiver, eller",
          "Låntaker blir slått konkurs, får åpnet gjeldsforhandling eller gjeldsordning, eller det er klart at Låntaker ikke vil kunne betale.",
        ],
      },
    );

    if (hasGuarantor(a)) {
      let who = `**${c.v("guarantorName", "kausjonistens navn")}**`;
      if (c.has("guarantorBirth")) who += ` (f. ${c.date("guarantorBirth", "fødselsdato")})`;
      if (c.has("guarantorAddress")) who += `, ${c.v("guarantorAddress", "adresse")}`;
      const max = c.has("guarantorMax") ? c.money("guarantorMax", "beløp") : c.money("amount", "lånebeløp");
      blocks.push({
        type: "clause",
        title: "Kausjon",
        paragraphs: [
          `${who} («Kausjonisten») påtar seg selvskyldnerkausjon for Låntakers forpliktelser etter dette gjeldsbrevet. Det betyr at Långiver kan kreve Kausjonisten direkte når et beløp ikke er betalt ved forfall, uten først å måtte forsøke å inndrive det hos Låntaker.`,
          `Kausjonistens samlede ansvar, inkludert renter og kostnader, er begrenset til ${max}.`,
          "Långiver skal uten ugrunnet opphold varsle Kausjonisten skriftlig hvis Låntaker misligholder lånet.",
        ],
      });
    }

    blocks.push(
      {
        type: "clause",
        title: "Gjeldsbrevets art og tvangsgrunnlag",
        paragraphs: [
          "Gjeldsbrevet er ikke et omsetningsgjeldsbrev.",
          "Låntaker er kjent med at gjeldsbrevet er tvangsgrunnlag for utlegg, jf. tvangsfullbyrdelsesloven § 7-2 bokstav a. Hvis lånet ikke betales, kan Långiver derfor begjære utlegg hos namsmannen uten først å få en dom.",
          "Når lånet er betalt fullt ut, skal Långiver levere originalen av gjeldsbrevet tilbake til Låntaker, eller skriftlig bekrefte at lånet er innfridd.",
        ],
      },
      {
        type: "clause",
        title: "Lovvalg og tvister",
        paragraphs: [NORWEGIAN_LAW.replace("Avtalen", "Gjeldsbrevet")],
      },
      {
        type: "signatures",
        intro: "Gjeldsbrevet er utstedt i to eksemplarer. Långiver beholder originalen, og Låntaker får en kopi.",
        parties: [
          sigParty(c, "b", "LÅNTAKER", "låntakers navn"),
          sigParty(c, "l", "LÅNGIVER", "långivers navn"),
          ...(hasGuarantor(a) ? [sigPerson("KAUSJONIST", c.v("guarantorName", "kausjonistens navn"))] : []),
        ],
      },
    );
    return blocks;
  },
  warnings(a) {
    const rate = rateOf(a);
    const amount = parseAmount(a.amount ?? "", "nb-NO");
    const out: Warning[] = [];
    if (rate > 20)
      out.push({
        level: "info",
        text: `En rente på ${rate.toLocaleString("nb-NO")} % per år er svært høy for et privat lån. En urimelig høy rente kan bli satt til side etter avtaleloven § 36, eller i verste fall regnes som åger.`,
        fields: ["rate"],
      });
    if (rate === 0 && amount > 100000)
      out.push({
        level: "info",
        text: "Store rentefrie lån kan i noen tilfeller ha skattemessige følger, for eksempel hvis lånet egentlig er ment som en gave. Spør Skatteetaten eller en regnskapsfører hvis du er usikker.",
        fields: ["rate", "amount"],
      });
    if (hasGuarantor(a))
      out.push({
        level: "info",
        text: "Er kausjonisten en privatperson (forbruker), kan særlige regler i finansavtaleloven gi kausjonisten ekstra vern, blant annet om informasjon og varsling. Kausjonisten bør lese gjeldsbrevet nøye før signering, og långiver bør sjekke hvilke regler som gjelder.",
        fields: ["guarantor", "guarantorName", "guarantorMax"],
      });
    if (!isLump(a) && a.installment && amount > 0 && parseAmount(a.installment, "nb-NO") > amount)
      out.push({
        level: "info",
        text: "Terminbeløpet er høyere enn lånebeløpet. Sjekk at beløpene er riktige.",
        fields: ["installment", "amount"],
      });
    return out;
  },
};
