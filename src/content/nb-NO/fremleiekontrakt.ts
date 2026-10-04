import { makeCtx, type Block, type Template, type Warning } from "@/lib/doc";
import { NORWEGIAN_LAW, partyFields, partyIntro, sigParty, sigPerson } from "./shared";

const isIso = (s?: string) => /^\d{4}-\d{2}-\d{2}$/.test(s ?? "");

export const fremleiekontrakt: Template = {
  slug: "fremleiekontrakt",
  locale: "nb-NO",
  name: "Fremleiekontrakt",
  shortName: "Fremleie",
  tagline: "Lei ut boligen du selv leier, eller et rom i den, på riktig måte.",
  category: "Real estate",
  price: 12900,
  minutes: 6,
  icon: "key",
  seo: {
    title: "Fremleiekontrakt mal: fremlei leiligheten eller et rom",
    description:
      "Lag en fremleiekontrakt når du leier ut boligen du selv leier: periode, leie, depositum og utleiers samtykke. Forhåndsvis gratis, betal 129 kr én gang for PDF-en.",
    intro:
      "En fremleiekontrakt brukes når du som leietaker leier ut hele eller deler av boligen din til en annen, en fremleietaker. Du er fortsatt ansvarlig overfor din egen utleier, så en skriftlig avtale med depositum og klare regler beskytter deg hvis fremleietakeren ikke betaler eller gjør skade.",
    whenToUse: [
      "Du skal studere, jobbe eller reise bort en periode og vil leie ut leiligheten imens",
      "Du vil leie ut et ledig rom i leiligheten du leier",
      "Du har fått ny jobb et annet sted, men vil beholde boligen",
      "Du vil ha utleiers samtykke skriftlig på samme dokument",
    ],
    includes: [
      "Hele boligen eller et rom med tilgang til fellesarealer",
      "Leieperiode som slutter senest når din egen leiekontrakt slutter",
      "Husleie, depositum (maks seks måneders leie) og strøm/internett",
      "Fremleietaker følger reglene i hovedleiekontrakten",
      "Tilstand, skader og forbud mot videre fremleie",
      "Signaturfelt for utleiers samtykke",
    ],
    faq: [
      {
        q: "Trenger jeg utleiers samtykke?",
        a: "Som hovedregel ja. Etter husleieloven kreves utleiers samtykke til fremleie. Bor du selv i boligen og vil leie ut en del av den, kan utleier etter loven bare nekte hvis det er saklig grunn. Er du midlertidig borte på grunn av arbeid, studier, sykdom eller lignende, kan du som regel fremleie hele boligen i inntil to år, og også her kan samtykke bare nektes av saklig grunn. Sjekk husleieloven §§ 7-1 og 7-2 og din egen kontrakt, og få samtykket skriftlig.",
      },
      {
        q: "Er jeg ansvarlig hvis fremleietakeren ikke betaler?",
        a: "Ja. Du er fortsatt bundet av din egen leiekontrakt og må betale full leie til utleier, og du svarer overfor utleier for skader. Derfor bør du ta depositum fra fremleietakeren og ha klare betalingsvilkår.",
      },
      {
        q: "Kan jeg ta mer i leie enn jeg betaler selv?",
        a: "Husleieloven forbyr leie som er urimelig sammenlignet med gjengs leie for tilsvarende boliger, og det gjelder også ved fremleie. Fremleier du et rom, bør leien stå i forhold til hvor stor del av boligen fremleietakeren bruker. Å tjene penger på fremleie kan også ha skattemessige følger.",
      },
    ],
  },
  steps: [
    {
      id: "leietaker",
      label: "Deg",
      title: "Hvem er du?",
      description: "Du er leietakeren som fremleier boligen.",
      fields: partyFields("lt", "du", { allowCompany: false, email: true }).map((f) => (f.id === "ltName" ? { ...f, label: "Ditt fulle navn", placeholder: "Kari Nordmann" } : f)),
    },
    {
      id: "fremleietaker",
      label: "Fremleietaker",
      title: "Hvem skal fremleie?",
      fields: partyFields("fl", "fremleietaker", { allowCompany: false, email: true }).map((f) => (f.id === "flName" ? { ...f, placeholder: "Ola Nordmann" } : f)),
    },
    {
      id: "bolig",
      label: "Boligen",
      title: "Hva fremleies?",
      fields: [
        { id: "landlord", label: "Navn på din utleier", type: "text", required: true, placeholder: "Eksempel Eiendom AS" },
        { id: "address", label: "Adresse", type: "text", required: true, placeholder: "Storgata 1 H0201, 0155 Oslo" },
        {
          id: "portion",
          label: "Hva får fremleietakeren?",
          type: "choice",
          defaultValue: "whole",
          options: [
            { value: "whole", label: "Hele boligen" },
            { value: "room", label: "Et rom", description: "Med felles bruk av kjøkken, bad og stue." },
          ],
        },
        { id: "shared", label: "Fellesarealer (valgfritt)", type: "text", placeholder: "kjøkken, bad og stue", showIf: (a) => a.portion === "room", defaultValue: "kjøkken, bad og stue" },
        { id: "mainLeaseDate", label: "Dato for din egen leiekontrakt", type: "date", half: true, help: "Kontrakten du har med utleieren din." },
      ],
    },
    {
      id: "periode",
      label: "Periode",
      title: "Hvor lenge varer fremleien?",
      fields: [
        { id: "start", label: "Startdato", type: "date", required: true, half: true },
        { id: "end", label: "Sluttdato", type: "date", required: true, half: true, help: "Kan ikke være senere enn når din egen leiekontrakt slutter." },
      ],
    },
    {
      id: "leie",
      label: "Leie og depositum",
      title: "Leie og depositum",
      fields: [
        { id: "rent", label: "Månedlig leie", type: "money", required: true, half: true, placeholder: "8 000" },
        { id: "dueDay", label: "Forfaller den", type: "number", defaultValue: "1", half: true, help: "Dag i måneden" },
        { id: "account", label: "Kontonummer", type: "text", half: true, placeholder: "1234 56 78903" },
        { id: "deposit", label: "Depositum (valgfritt)", type: "money", half: true, placeholder: "16 000", help: "Maks seks måneders leie." },
        {
          id: "utilities",
          label: "Hva betaler fremleietakeren i tillegg til leien? (valgfritt)",
          type: "text",
          placeholder: "f.eks. strøm og internett",
          help: "Står feltet tomt, er alt inkludert i leien.",
        },
        { id: "rules", label: "Husregler (valgfritt)", type: "textarea", placeholder: "f.eks. Ikke overnattingsgjester mer enn tre netter på rad. Vann plantene hver uke." },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a, "nb-NO");
    const room = c.is("portion", "room");
    const blocks: Block[] = [
      { type: "title", text: "Fremleiekontrakt" },
      {
        type: "paragraph",
        text: `Denne avtalen er inngått mellom ${partyIntro(c, "lt", "ditt navn")} («Leietaker») og ${partyIntro(c, "fl", "fremleietakers navn")} («Fremleietaker»).`,
      },
      {
        type: "clause",
        title: "Boligen",
        paragraphs: [
          `Leietaker fremleier ${room ? `ett rom i boligen i ${c.v("address", "adresse")}, med rett til felles bruk av ${c.v("shared", "fellesarealer")}` : `hele boligen i ${c.v("address", "adresse")}`} («Boligen»). Leietaker leier selv Boligen av ${c.v("landlord", "utleiers navn")} («Utleier») etter en leiekontrakt${c.has("mainLeaseDate") ? ` datert ${c.date("mainLeaseDate", "")}` : ""} («Hovedkontrakten»).`,
        ],
      },
      {
        type: "clause",
        title: "Leieperiode",
        paragraphs: [
          `Fremleien starter ${c.date("start", "startdato")} og slutter uten oppsigelse ${c.date("end", "sluttdato")}. Fremleietaker skal flytte ut og levere tilbake alle nøkler innen sluttdatoen.`,
          "Fremleien slutter uansett senest når Hovedkontrakten slutter, uavhengig av årsak. Leietaker skal i så fall varsle Fremleietaker så snart som mulig.",
        ],
      },
      {
        type: "clause",
        title: "Leie",
        paragraphs: [
          `Leien er ${c.money("rent", "månedlig leie")} per måned. Leien betales forskuddsvis til Leietaker innen den ${c.v("dueDay", "forfallsdag")}. i hver måned til konto ${c.v("account", "kontonummer")}.`,
          c.has("utilities")
            ? `I tillegg betaler Fremleietaker for ${c.v("utilities", "")} i leieperioden. Alt annet er inkludert i leien.`
            : "Strøm, oppvarming, vann og internett er inkludert i leien.",
        ],
      },
      {
        type: "clause",
        title: "Depositum",
        paragraphs: [
          c.has("deposit")
            ? `Før innflytting betaler Fremleietaker et depositum på ${c.money("deposit", "depositum")} som sikkerhet for leie, skader og andre krav etter avtalen. Depositumet settes inn på en egen depositumskonto i Fremleietakers navn, jf. husleieloven § 3-5. Leietaker betaler kostnadene ved å opprette kontoen. Ingen av partene kan disponere kontoen alene i leieperioden.`
            : "Fremleietaker skal ikke betale depositum.",
        ],
      },
      {
        type: "clause",
        title: "Hovedkontrakten",
        paragraphs: [
          "Fremleietaker har fått en kopi av Hovedkontrakten og skal følge reglene i den, også husordensregler, så langt de gjelder for den delen av Boligen Fremleietaker bruker. Fremleietaker skal ikke gjøre noe som fører til at Leietaker bryter Hovedkontrakten.",
          "Leietaker er fortsatt ansvarlig overfor Utleier etter Hovedkontrakten.",
        ],
      },
      {
        type: "clause",
        title: "Tilstand og skader",
        paragraphs: [
          "Fremleietaker overtar Boligen i den stand den er ved innflytting og skal behandle den med tilbørlig aktsomhet. Fremleietaker skal straks melde fra til Leietaker om skader eller feil. Fremleietaker er ansvarlig for skader som Fremleietaker eller gjester forårsaker, utover vanlig slit og elde.",
          "Ved utflytting skal Boligen være ryddet, rengjort og i samme stand som ved innflytting, bortsett fra vanlig slit og elde.",
        ],
      },
      {
        type: "clause",
        title: "Videre fremleie",
        paragraphs: ["Fremleietaker kan ikke fremleie Boligen videre eller overføre denne avtalen til andre."],
      },
    ];
    if (c.has("rules")) blocks.push({ type: "clause", title: "Husregler", paragraphs: [c.v("rules", "")] });
    blocks.push(
      {
        type: "clause",
        title: "Lovvalg og tvister",
        paragraphs: [`Husleieloven gjelder for fremleieforholdet. ${NORWEGIAN_LAW}`],
      },
      {
        type: "signatures",
        intro: "Avtalen er utstedt i to eksemplarer, ett til hver part.",
        parties: [sigParty(c, "lt", "LEIETAKER", "ditt navn"), sigParty(c, "fl", "FREMLEIETAKER", "fremleietakers navn")],
      },
      {
        type: "signatures",
        intro:
          "UTLEIERS SAMTYKKE. Utleier samtykker til fremleien som er beskrevet i denne avtalen. Samtykket fritar ikke Leietaker for noen forpliktelser etter Hovedkontrakten.",
        parties: [sigPerson("UTLEIER", c.v("landlord", "utleiers navn"))],
      },
    );
    return blocks;
  },
  warnings(a) {
    const out: Warning[] = [];
    const c = makeCtx(a, "nb-NO");
    const rent = c.num("rent");
    const dep = c.num("deposit");
    if (rent > 0 && dep > rent * 6)
      out.push({
        level: "block",
        text: "Depositum kan ikke være mer enn seks måneders leie (husleieloven § 3-5). Senk beløpet for å fortsette.",
        fields: ["deposit", "rent"],
      });
    if (isIso(a.start) && isIso(a.end)) {
      if (a.end <= a.start) out.push({ level: "info", text: "Sluttdatoen er før startdatoen. Sjekk datoene.", fields: ["start", "end"] });
      else {
        const min = new Date(a.start + "T00:00:00Z");
        min.setUTCFullYear(min.getUTCFullYear() + 3);
        min.setUTCDate(min.getUTCDate() - 1);
        if (new Date(a.end + "T00:00:00Z") < min)
          out.push({
            level: "info",
            text: "Reglene om minstetid for tidsbestemte leieavtaler (husleieloven § 9-3) kan også gjelde fremleie. Er perioden kortere enn tre år, bør du sjekke om fremleietakeren kan kreve å bli boende lenger.",
            fields: ["end"],
          });
      }
    }
    out.push({
      level: "info",
      text: "Du trenger som hovedregel utleiers samtykke til fremleie. Få det skriftlig før fremleietakeren flytter inn, for eksempel ved at utleier signerer samtykket nederst i avtalen.",
      fields: ["landlord"],
    });
    return out;
  },
};
