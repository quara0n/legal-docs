import { makeCtx, type Block, type Template, type Warning } from "@/lib/doc";
import { partyFields, partyIntro, sigParty, sigPerson } from "./shared";

// Områder for generell fullmakt: valgtekst i veiviseren og tekst i dokumentet.
const AREAS: Record<string, { label: string; text: string }> = {
  bank: {
    label: "Bank og betalinger (bankene har som regel egne fullmaktsskjema)",
    text: "betale regninger og ellers ivareta mine bankforhold, i den grad banken godtar denne fullmakten",
  },
  post: { label: "Post og pakker", text: "hente, motta og kvittere for post og pakker adressert til meg" },
  public: {
    label: "Kontakt med offentlige etater (NAV, Skatteetaten, kommunen)",
    text: "kontakte offentlige etater, som NAV, Skatteetaten og kommunen, få innsyn i saker som gjelder meg, og gi og motta opplysninger og dokumenter",
  },
  housing: { label: "Avtaler om bolig og leie", text: "inngå, endre og si opp avtaler om leie av bolig, og ellers ivareta mine forhold som leietaker eller utleier" },
  goods: { label: "Kjøp og salg av løsøre", text: "kjøpe og selge løsøre (for eksempel møbler, kjøretøy og andre eiendeler)" },
  money: { label: "Motta og kvittere for penger", text: "motta penger for meg og kvittere for dem" },
  meetings: {
    label: "Representere meg på møter (sameie, borettslag o.l.)",
    text: "møte, uttale seg og stemme for meg på årsmøter, generalforsamlinger og andre møter i sameie, borettslag og lignende",
  },
};

const PURPOSES = {
  specific: "Én bestemt sak",
  general: "Generell fullmakt",
  future: "Hvis jeg en gang ikke kan ivareta mine egne interesser (fremtidsfullmakt)",
};

const sanitize = (s: string) => s.replace(/[⟦⟧¦*]/g, "");

export const fullmakt: Template = {
  slug: "fullmakt",
  locale: "nb-NO",
  name: "Fullmakt",
  shortName: "Fullmakt",
  tagline: "La en du stoler på handle for deg, i én sak eller flere.",
  category: "Personal",
  price: 9900,
  minutes: 4,
  icon: "key",
  seo: {
    title: "Fullmakt mal: Lag en skriftlig fullmakt på nett",
    description:
      "Lag en skriftlig fullmakt for én bestemt sak eller flere områder, med varighet, tilbakekall og vitner. Forhåndsvis gratis, betal 99 kr én gang for PDF-en.",
    intro:
      "En fullmakt gir en annen person (fullmektigen) rett til å handle på dine vegne, for eksempel hente en pakke, signere en avtale eller møte for deg på et sameiemøte. En skriftlig fullmakt gjør det tydelig hva fullmektigen kan gjøre, og hvor lenge. Reglene om fullmakt står i avtaleloven kapittel 2.",
    whenToUse: [
      "Noen skal hente en pakke, et rekommandert brev eller et dokument for deg",
      "Du er på reise eller bor i utlandet og trenger hjelp med post, leieforhold eller kontakt med offentlige etater",
      "Noen skal møte og stemme for deg på årsmøte i sameiet eller borettslaget",
      "Du vil at en du stoler på skal kunne kjøpe, selge eller signere for deg i en bestemt sak",
    ],
    includes: [
      "Fullmakt for én bestemt sak eller generell fullmakt for områdene du velger",
      "Varighet: til en bestemt dato eller til du trekker den tilbake",
      "Valg om fullmektigen kan gi videre fullmakt til andre",
      "Fullmektigens plikt til å handle i din interesse og gjøre rede for penger",
      "Regler for tilbakekall og tilbakelevering av fullmakten",
      "Underskrift for fullmaktsgiver, og valgfritt for vitner og fullmektig",
    ],
    faq: [
      {
        q: "Må en fullmakt være bevitnet?",
        a: "Nei, en vanlig fullmakt trenger som hovedregel ikke vitner for å være gyldig. Vitner gjør det likevel lettere å bevise at det var du som signerte, og noen som skal godta fullmakten, for eksempel banker eller offentlige etater, kan kreve vitner eller egne skjema. Sjekk med mottakeren på forhånd.",
      },
      {
        q: "Hva er forskjellen på fullmakt og fremtidsfullmakt?",
        a: "En vanlig fullmakt brukes mens du selv kan ivareta egne interesser, og du kan når som helst trekke den tilbake. En fremtidsfullmakt etter vergemålsloven er laget for å gjelde hvis du senere blir syk eller svekket og ikke lenger kan ivareta dine interesser. Den har strenge formkrav, blant annet to vitner som er til stede samtidig, og må som regel stadfestes av Statsforvalteren før den kan brukes. Denne malen er ikke en fremtidsfullmakt.",
      },
      {
        q: "Hvordan trekker jeg tilbake en fullmakt?",
        a: "Gi beskjed til fullmektigen om at fullmakten er trukket tilbake, helst skriftlig, og be om å få fullmaktsdokumentet tilbake eller få det makulert. Gi også beskjed til dem fullmektigen har brukt eller kan komme til å bruke fullmakten overfor, for eksempel banken, posten eller sameiet. Så lenge fullmektigen har dokumentet, kan tredjepersoner i god tro i noen tilfeller fortsatt legge vekt på det.",
      },
    ],
  },
  steps: [
    {
      id: "giver",
      label: "Deg",
      title: "Hvem gir fullmakten?",
      description: "Dette er deg, «Fullmaktsgiver».",
      fields: partyFields("giver", "fullmaktsgiver", { allowCompany: false, idRequired: true }),
    },
    {
      id: "agent",
      label: "Fullmektig",
      title: "Hvem skal handle for deg?",
      description: "«Fullmektig» er personen som får fullmakten. Velg en du stoler på.",
      fields: partyFields("agent", "fullmektig", { allowCompany: false, idRequired: true }),
    },
    {
      id: "scope",
      label: "Hva den gjelder",
      title: "Hva er fullmakten til?",
      fields: [
        {
          id: "purpose",
          label: "Hva er fullmakten til?",
          type: "choice",
          required: true,
          defaultValue: "specific",
          options: [
            { value: "specific", label: PURPOSES.specific, description: "F.eks. hente en pakke eller signere én bestemt kontrakt." },
            { value: "general", label: PURPOSES.general, description: "Fullmektigen kan handle for deg på områdene du velger." },
            { value: "future", label: PURPOSES.future, description: "Krever egne formregler etter vergemålsloven." },
          ],
        },
        {
          id: "task",
          label: "Beskriv nøyaktig hva fullmektigen kan gjøre",
          type: "textarea",
          required: true,
          placeholder:
            "f.eks. hente en pakke med sporingsnummer 123456 på Posten, signere kjøpekontrakt for leilighet i Storgata 1, eller møte og stemme for meg på årsmøtet i Storgata Sameie i 2026",
          help: "Vær konkret. Jo tydeligere, jo lettere er det for andre å godta fullmakten.",
          showIf: (a) => a.purpose === "specific",
        },
        {
          id: "areas",
          label: "Hvilke områder skal fullmakten gjelde?",
          type: "multi",
          required: true,
          defaultValue: "post,public",
          options: Object.entries(AREAS).map(([value, o]) => ({ value, label: o.label })),
          showIf: (a) => a.purpose === "general",
        },
        {
          id: "limits",
          label: "Begrensninger eller instrukser (valgfritt)",
          type: "textarea",
          placeholder: "f.eks. Fullmektig kan ikke selge bilen min for under kr 100 000,-",
          showIf: (a) => a.purpose !== "future",
        },
      ],
    },
    {
      id: "terms",
      label: "Vilkår",
      title: "Varighet og vilkår",
      fields: [
        {
          id: "validity",
          label: "Hvor lenge skal fullmakten gjelde?",
          type: "choice",
          defaultValue: "revoked",
          options: [
            { value: "date", label: "Til en bestemt dato" },
            { value: "revoked", label: "Til jeg trekker den tilbake" },
          ],
        },
        { id: "endDate", label: "Gjelder til og med", type: "date", half: true, required: true, showIf: (a) => a.validity === "date" },
        {
          id: "subDelegation",
          label: "Kan fullmektigen gi fullmakt videre til andre?",
          type: "choice",
          defaultValue: "no",
          options: [
            { value: "no", label: "Nei", description: "Fullmektigen må handle selv. Anbefalt." },
            { value: "yes", label: "Ja", description: "Fullmektigen kan la en annen gjøre oppgaven, men har fortsatt ansvaret." },
          ],
        },
        {
          id: "witnesses",
          label: "Vil du ha to vitner til underskriften din?",
          type: "choice",
          defaultValue: "yes",
          help: "Ikke et krav for en vanlig fullmakt, men det gjør det lettere å bevise at du har signert.",
          options: [
            { value: "yes", label: "Ja, med vitner", description: "Anbefalt." },
            { value: "no", label: "Nei" },
          ],
        },
        {
          id: "agentAccept",
          label: "Skal fullmektigen signere på at hen tar på seg fullmakten?",
          type: "choice",
          defaultValue: "yes",
          options: [
            { value: "yes", label: "Ja", description: "Fullmektigen bekrefter vilkårene med sin underskrift." },
            { value: "no", label: "Nei" },
          ],
        },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a, "nb-NO");
    const general = c.is("purpose", "general");
    const chosen = c.multi("areas").filter((x) => AREAS[x]);

    const scope: Block = general
      ? {
          type: "clause",
          title: "Hva fullmakten gjelder",
          paragraphs: [
            chosen.length
              ? "Fullmektig kan på mine vegne, og med samme virkning som om jeg handlet selv:"
              : "Fullmektig kan på mine vegne ⟦areas¦?velg områder⟧.",
          ],
          list: chosen.length ? chosen.map((x) => `⟦areas¦${sanitize(AREAS[x].text)}⟧`) : undefined,
        }
      : {
          type: "clause",
          title: "Hva fullmakten gjelder",
          paragraphs: [
            `Fullmakten gjelder denne saken: ${c.v("task", "beskrivelse av saken")}`,
            "Fullmektig kan gjøre det som er nødvendig for å gjennomføre denne saken på mine vegne, med samme virkning som om jeg handlet selv. Fullmakten gjelder ikke andre saker.",
          ],
        };
    if (c.has("limits")) scope.paragraphs.push(`Fullmakten er begrenset av følgende: ${c.v("limits", "begrensninger")}`);

    const blocks: Block[] = [
      { type: "title", text: "Fullmakt" },
      {
        type: "clause",
        title: "Partene",
        paragraphs: [
          `Jeg, ${partyIntro(c, "giver", "fullmaktsgiver")} («Fullmaktsgiver»), gir med dette ${partyIntro(c, "agent", "fullmektig")} («Fullmektig») fullmakt til å handle på mine vegne som beskrevet nedenfor.`,
        ],
      },
      scope,
      {
        type: "clause",
        title: "Hva fullmakten ikke gjelder",
        paragraphs: [
          "Fullmakten gjelder ikke handlinger som etter loven må gjøres personlig, som å inngå ekteskap eller opprette testament. Fullmektig kan ikke gi bort mine penger eller eiendeler, eller bruke dem til egen fordel, uten at det står uttrykkelig i denne fullmakten.",
          "Fullmakten er ikke en fremtidsfullmakt etter vergemålsloven.",
        ],
      },
      {
        type: "clause",
        title: "Varighet",
        paragraphs: [
          c.is("validity", "date")
            ? `Fullmakten gjelder fra den er signert, og til og med ${c.date("endDate", "sluttdato")}, med mindre jeg trekker den tilbake før.`
            : "Fullmakten gjelder fra den er signert, og til jeg trekker den tilbake.",
        ],
      },
      {
        type: "clause",
        title: "Videre fullmakt",
        paragraphs: [
          c.is("subDelegation", "yes")
            ? "Fullmektig kan gi en annen person fullmakt til å utføre hele eller deler av oppdraget. Fullmektig har fortsatt ansvaret overfor meg for det som blir gjort."
            : "Fullmektig skal handle selv og kan ikke gi fullmakt videre til andre.",
        ],
      },
      {
        type: "clause",
        title: "Fullmektigs plikter",
        paragraphs: [
          "Fullmektig skal handle lojalt og i min interesse, og holde seg innenfor denne fullmakten og mine instrukser.",
          "Penger og eiendeler Fullmektig mottar eller forvalter for meg, skal holdes atskilt fra Fullmektigs egne. Fullmektig skal ta vare på kvitteringer og bilag, og på forespørsel, og senest når fullmakten opphører, gjøre rede for alle penger som er mottatt eller brukt på mine vegne.",
        ],
      },
      {
        type: "clause",
        title: "Tilbakekall",
        paragraphs: [
          "Jeg kan når som helst trekke fullmakten tilbake ved å gi Fullmektig beskjed, helst skriftlig.",
          "Når fullmakten trekkes tilbake eller opphører, skal Fullmektig straks levere dette dokumentet tilbake til meg, eller makulere det hvis jeg ber om det. Jeg bør også gi beskjed til dem Fullmektig har brukt fullmakten overfor, eller som kan komme til å legge vekt på den.",
        ],
      },
      {
        type: "clause",
        title: "Lovvalg og tvister",
        paragraphs: [
          "Fullmakten er underlagt norsk rett, blant annet reglene om fullmakt i avtaleloven kapittel 2. Uenighet mellom Fullmaktsgiver og Fullmektig skal først forsøkes løst gjennom forhandlinger. Tvister som ikke løses på denne måten, kan bringes inn for de alminnelige domstolene.",
        ],
      },
      {
        type: "signatures",
        intro:
          "Fullmakten er utstedt i ett eksemplar, som Fullmektig oppbevarer og leverer tilbake når fullmakten opphører. Fullmaktsgiver bør beholde en kopi.",
        parties: [sigParty(c, "giver", "FULLMAKTSGIVER", "fullmaktsgiver")],
      },
    ];

    if (!c.is("witnesses", "no")) {
      const witness = (n: number) => ({
        heading: `VITNE ${n}`,
        lines: [{ label: "Sted og dato" }, { label: "Underskrift" }, { label: "Navn (blokkbokstaver)" }, { label: "Adresse" }],
      });
      blocks.push({
        type: "signatures",
        intro: `Vi bekrefter at ${c.v("giverName", "fullmaktsgiver")} har signert denne fullmakten i vårt nærvær, eller har vedkjent seg underskriften overfor oss. Ingen av oss er Fullmektig.`,
        parties: [witness(1), witness(2)],
      });
    }

    if (!c.is("agentAccept", "no"))
      blocks.push({
        type: "signatures",
        intro: "Jeg tar på meg fullmakten og forplikter meg til å følge vilkårene i den.",
        parties: [sigPerson("FULLMEKTIG", c.v("agentName", "fullmektig"))],
      });

    return blocks;
  },
  warnings(a) {
    const out: Warning[] = [];
    const areas = (a.areas ?? "").split(",").map((s) => s.trim());
    if (a.purpose === "future")
      out.push({
        level: "block",
        text: "En fullmakt som skal gjelde hvis du senere ikke kan ivareta egne interesser, må være en fremtidsfullmakt etter vergemålsloven. Den har strenge formkrav, blant annet to vitner til stede samtidig, og denne malen oppfyller dem ikke. Kontakt Statsforvalteren for veiledning og skjema.",
        fields: ["purpose"],
      });
    else {
      out.push({
        level: "info",
        text: "Banker, Kartverket og enkelte offentlige etater har egne fullmaktsskjema eller krav. Sjekk med dem før du bruker denne. Skal fullmektigen selge eller kjøpe fast eiendom, har Kartverket egne krav til fullmakt. Sjekk kartverket.no før du bruker denne.",
        fields: ["purpose", "task", "areas"],
      });
      out.push({
        level: "info",
        text: "En vanlig fullmakt kan ikke brukes til det loven krever at du gjør personlig, som å gifte deg eller opprette testament.",
        fields: ["purpose", "task", "areas"],
      });
    }
    if (a.purpose === "general" && areas.includes("bank"))
      out.push({
        level: "info",
        text: "De fleste banker godtar bare sine egne fullmaktsskjema eller disposisjonsrett i nettbanken. Spør banken din hva de krever.",
        fields: ["areas"],
      });
    return out;
  },
};
