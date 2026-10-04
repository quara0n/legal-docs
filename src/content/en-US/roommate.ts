import { joinList, makeCtx, type Block, type Template } from "@/lib/doc";
import { governingLawField } from "./shared";

const names = (raw: string) =>
  raw
    .split(/\n|;/)
    .map((s) => s.replace(/[⟦⟧¦*]/g, "").trim())
    .filter(Boolean);

export const roommate: Template = {
  slug: "roommate-agreement",
  locale: "en-US",
  name: "Roommate Agreement",
  shortName: "Roommate Agreement",
  tagline: "Agree on rent, bills, chores and guests before anyone moves in.",
  category: "Real estate",
  price: 900,
  minutes: 6,
  icon: "users",
  seo: {
    title: "Roommate Agreement Template: Split Rent, Bills and Chores",
    description:
      "Create a roommate agreement that covers rent split, utilities, chores, guests, quiet hours and moving out. Free preview, $9 once for the PDF.",
    intro:
      "A roommate agreement is a contract between people who share a home. It doesn't replace your lease with the landlord; it covers what the lease doesn't: who pays what, how bills are split, cleaning, guests, quiet hours and what happens when someone moves out.",
    whenToUse: [
      "Moving in with friends, a partner or new roommates",
      "Adding a new roommate to an existing household",
      "Sorting out recurring arguments about bills or chores",
      "Making sure a roommate covers their share if they leave early",
    ],
    includes: [
      "Each roommate's share of the rent",
      "How utilities and shared supplies are split",
      "Chores, cleaning and common areas",
      "Guests, overnight stays and quiet hours",
      "Pets, smoking and parking",
      "Notice and replacement when someone moves out",
    ],
    faq: [
      {
        q: "Is a roommate agreement legally binding?",
        a: "Yes, generally, for money matters like rent and bills: it's a contract between the roommates. Courts rarely enforce house rules like chores, but writing them down prevents most disputes.",
      },
      {
        q: "Does it replace our lease?",
        a: "No. Your lease with the landlord still applies. If everyone signed the lease, each person is usually liable to the landlord for the full rent, whatever your roommate agreement says.",
      },
      {
        q: "How should we split rent for different room sizes?",
        a: "Many households split by room size or by whether a room has its own bathroom. You can enter any amount per roommate.",
      },
    ],
  },
  steps: [
    {
      id: "home",
      label: "Home",
      title: "Where do you live?",
      fields: [
        { id: "address", label: "Address", type: "text", required: true, placeholder: "12 Oak St, Apt 4, Portland, OR 97205" },
        { id: "start", label: "Agreement starts", type: "date", required: true, half: true },
        { ...governingLawField, half: true, label: "State", help: undefined },
      ],
    },
    {
      id: "people",
      label: "Roommates",
      title: "Who lives there?",
      description: "Everyone who signs this agreement.",
      fields: [
        {
          id: "roommates",
          label: "Roommates and their monthly rent share",
          type: "textarea",
          required: true,
          placeholder: "Alex Rivera - 900\nSam Lee - 800\nJo Park - 800",
          help: "One per line: name, a dash, then that person’s monthly share.",
        },
        { id: "totalRent", label: "Total monthly rent", type: "money", required: true, half: true, placeholder: "2,500" },
        { id: "dueDay", label: "Rent due to the landlord on day", type: "number", half: true, defaultValue: "1" },
        { id: "collector", label: "Who pays the landlord?", type: "text", placeholder: "e.g. Alex collects and pays the full rent", help: "Leave empty if each roommate pays the landlord directly." },
      ],
    },
    {
      id: "bills",
      label: "Bills",
      title: "How are bills split?",
      fields: [
        {
          id: "split",
          label: "Utilities and internet",
          type: "choice",
          defaultValue: "equal",
          options: [
            { value: "equal", label: "Split equally" },
            { value: "rent", label: "Same ratio as rent" },
          ],
        },
        { id: "billsDays", label: "Pay your share within (days)", type: "number", half: true, defaultValue: "7", help: "After the bill is shared." },
        { id: "deposit", label: "Each person’s deposit share (optional)", type: "money", half: true },
      ],
    },
    {
      id: "rules",
      label: "House rules",
      title: "House rules",
      description: "Pick the defaults that fit. You can add your own below.",
      fields: [
        { id: "quiet", label: "Quiet hours", type: "text", half: true, defaultValue: "10 pm to 7 am on weeknights" },
        { id: "guestNights", label: "Max guest nights in a row", type: "number", half: true, defaultValue: "3" },
        {
          id: "chores",
          label: "Chores",
          type: "select",
          defaultValue: "rota",
          options: [
            { value: "rota", label: "A weekly rotating rota" },
            { value: "own", label: "Everyone cleans up after themselves" },
            { value: "cleaner", label: "We share the cost of a cleaner" },
          ],
        },
        {
          id: "pets",
          label: "Pets",
          type: "select",
          half: true,
          defaultValue: "agree",
          options: [
            { value: "agree", label: "Only if everyone agrees" },
            { value: "no", label: "No pets" },
            { value: "yes", label: "Allowed" },
          ],
        },
        {
          id: "smoking",
          label: "Smoking",
          type: "select",
          half: true,
          defaultValue: "no",
          options: [
            { value: "no", label: "Not inside" },
            { value: "yes", label: "Allowed" },
          ],
        },
        { id: "extra", label: "Anything else? (optional)", type: "textarea", placeholder: "e.g. Food on the top shelf is shared. Label anything you don't want to share." },
      ],
    },
    {
      id: "leaving",
      label: "Moving out",
      title: "If someone moves out",
      fields: [
        { id: "noticeDays", label: "Notice to the others (days)", type: "number", half: true, defaultValue: "30" },
        {
          id: "replace",
          label: "Until a replacement is found",
          type: "choice",
          defaultValue: "pay",
          options: [
            { value: "pay", label: "Leaver keeps paying", description: "Until the notice ends or someone replaces them." },
            { value: "split", label: "Others cover it", description: "Remaining roommates share the gap." },
          ],
        },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a);
    const people = names(c.raw("roommates")).map((line) => {
      const m = line.match(/^(.*?)[\s]*[-–:,][\s]*\$?([\d,.]+)\s*$/);
      return m ? { name: m[1].trim(), share: m[2] } : { name: line, share: "" };
    });
    const list = people.length
      ? `⟦roommates¦${joinList(people.map((p) => p.name))}⟧`
      : "⟦roommates¦?roommate names⟧";
    const chores: Record<string, string> = {
      rota: "The roommates shall keep a weekly rotating chore rota for cleaning the kitchen, bathroom(s) and common areas and taking out trash and recycling.",
      own: "Each roommate shall clean up after themselves promptly and keep the kitchen, bathroom(s) and common areas tidy.",
      cleaner: "The roommates shall hire a cleaner for the common areas and split the cost equally. Each roommate keeps their own room clean.",
    };

    const blocks: Block[] = [
      { type: "title", text: "Roommate Agreement" },
      {
        type: "paragraph",
        text: `This Roommate Agreement (the “Agreement”) is made on ${c.date("start", "start date")} between **${list}** (each a “Roommate”), who share the home at ${c.v("address", "address")} (the “Home”). It sets out how the Roommates share costs and live together. It does not change any lease with the landlord.`,
      },
      {
        type: "clause",
        title: "Rent",
        paragraphs: [
          `The total rent for the Home is ${c.money("totalRent", "total rent")} per month, due to the landlord on day ${c.v("dueDay", "due day")} of each month. Each Roommate shall pay the following share:`,
        ],
        list: people.length
          ? people.map((p) => `⟦roommates¦${p.name}⟧: ${p.share ? `⟦roommates¦$${p.share}⟧` : "⟦roommates¦?share⟧"} per month`)
          : ["⟦roommates¦?Each roommate and their share⟧"],
      },
      {
        type: "clause",
        title: "Paying the Landlord",
        paragraphs: [
          c.has("collector")
            ? `${c.v("collector", "")}. Each Roommate shall pay their share to that person at least 3 days before rent is due.`
            : "Each Roommate shall pay their share directly to the landlord on time.",
          "A Roommate who pays late is responsible for any late fee caused by their late payment.",
        ],
      },
      {
        type: "clause",
        title: "Utilities and Shared Costs",
        paragraphs: [
          `Utilities, internet and agreed shared household supplies shall be split ${c.is("split", "rent") ? "in the same proportion as rent" : "equally between the Roommates"}. When a bill is shared with the household, each Roommate shall pay their part within ${c.v("billsDays", "number of")} days.${c.has("deposit") ? ` Each Roommate has contributed ${c.money("deposit", "deposit share")} toward the security deposit and is entitled to that share back, less any deductions for damage they caused.` : ""}`,
        ],
      },
      { type: "clause", title: "Cleaning", paragraphs: [chores[c.raw("chores")] ?? chores.rota] },
      {
        type: "clause",
        title: "Guests and Quiet Hours",
        paragraphs: [
          `Quiet hours are ${c.v("quiet", "quiet hours")}. A guest may stay no more than ${c.v("guestNights", "number of")} nights in a row without the agreement of all other Roommates. Each Roommate is responsible for their guests’ behavior and any damage they cause.`,
        ],
      },
      {
        type: "clause",
        title: "Pets and Smoking",
        paragraphs: [
          `${c.is("pets", "yes") ? "Pets are allowed if the lease permits them; the owner is responsible for their care and any damage." : c.is("pets", "no") ? "No pets may be kept in the Home." : "No pet may be brought into the Home without the agreement of all Roommates and the landlord where required."} ${c.is("smoking", "yes") ? "Smoking is allowed where the lease permits." : "No smoking or vaping inside the Home."}`,
        ],
      },
    ];
    if (c.has("extra")) blocks.push({ type: "clause", title: "Other Rules", paragraphs: [c.v("extra", "")] });
    blocks.push(
      {
        type: "clause",
        title: "Moving Out",
        paragraphs: [
          `A Roommate who wants to move out shall give the others at least ${c.v("noticeDays", "number of")} days’ written notice (a text or email is enough). ${c.is("replace", "split") ? "After the notice period, the remaining Roommates shall share that Roommate’s rent until a replacement moves in." : "The departing Roommate remains responsible for their share of rent and bills until the notice period ends or a replacement approved by all remaining Roommates (and the landlord, if required) moves in, whichever comes first."}`,
        ],
      },
      {
        type: "clause",
        title: "Disputes",
        paragraphs: [
          `The Roommates shall first try to resolve disagreements by talking in good faith. This Agreement is governed by the laws of the State of ${c.v("state", "state")}. It may be changed only in writing signed by all Roommates.`,
        ],
      },
      {
        type: "signatures",
        parties: people.length
          ? people.map((p, i) => ({ heading: `ROOMMATE ${i + 1}`, lines: [{ label: "Signature" }, { label: "Name", value: `⟦roommates¦${p.name}⟧` }, { label: "Date" }] }))
          : [{ heading: "ROOMMATE", lines: [{ label: "Signature" }, { label: "Name", value: "⟦roommates¦?name⟧" }, { label: "Date" }] }],
      },
    );
    return blocks;
  },
};
