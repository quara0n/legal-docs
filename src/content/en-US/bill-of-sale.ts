import { makeCtx, type Answers, type Block, type Template } from "@/lib/doc";
import { governingLawField, partyFields, partyIntro, sigParty } from "./shared";

const isVehicle = (a: Record<string, string>) => a.itemKind === "vehicle";

const withCommas = (v?: string) => {
  const n = Number((v ?? "").replace(/,/g, ""));
  return v && Number.isFinite(n) ? n.toLocaleString("en-US") : (v ?? "");
};

export const billOfSale: Template = {
  slug: "bill-of-sale",
  locale: "en-US",
  name: "Bill of Sale",
  shortName: "Bill of Sale",
  tagline: "Record the sale of a car, boat, furniture or anything of value.",
  category: "Personal",
  price: 900,
  minutes: 4,
  icon: "receipt",
  seo: {
    title: "Bill of Sale Template: Car, Vehicle & General Bill of Sale Online",
    description:
      "Create a bill of sale for a car, motorcycle, boat or any item. Free preview, then $9 once for a print-ready PDF. No subscription, no sign-up.",
    intro:
      "A bill of sale is a written record that ownership of something has passed from a seller to a buyer for a price. It protects both sides: the buyer has proof of ownership, and the seller has proof they no longer own the item.",
    whenToUse: [
      "Selling or buying a used car, motorcycle or trailer privately",
      "Selling a boat, RV, or other titled item",
      "Selling furniture, equipment, electronics or livestock",
      "Registering a vehicle at the DMV after a private sale",
    ],
    includes: [
      "Vehicle details (VIN, make, model, odometer) or item description",
      "Purchase price and payment method",
      "“As is” sale or seller warranty",
      "Odometer disclosure statement for vehicles",
      "Optional notary section",
    ],
    faq: [
      {
        q: "Is a bill of sale enough to transfer a car?",
        a: "In most states you also need to sign over the title. The bill of sale is the proof of the deal and is often required by the DMV together with the title.",
      },
      {
        q: "Does a bill of sale need to be notarized?",
        a: "Most states don't require it, but some do for certain vehicles, boats or title transfers. Check your state DMV's website before you sign. You can include a notary section with one click."
      },
      {
        q: "What does “as is” mean?",
        a: "The buyer accepts the item in its current condition and the seller makes no promises about it. This is the most common choice for private sales.",
      },
    ],
  },
  steps: [
    {
      id: "item", label: "Item",
      title: "What are you selling?",
      fields: [
        {
          id: "itemKind",
          label: "Item",
          type: "choice",
          defaultValue: "vehicle",
          options: [
            { value: "vehicle", label: "A vehicle", description: "Car, truck, motorcycle, trailer, RV." },
            { value: "general", label: "Something else", description: "Furniture, equipment, boat, electronics …" },
          ],
        },
      ],
    },
    {
      id: "details", label: "Details",
      title: (a) => (isVehicle(a) ? "Tell us about the vehicle" : "Describe the item"),
      fields: [
        { id: "year", label: "Year", type: "text", half: true, placeholder: "2018", showIf: isVehicle },
        { id: "make", label: "Make", type: "text", half: true, required: true, placeholder: "Toyota", showIf: isVehicle },
        { id: "model", label: "Model", type: "text", half: true, required: true, placeholder: "Camry", showIf: isVehicle },
        { id: "color", label: "Color", type: "text", half: true, placeholder: "Silver", showIf: isVehicle },
        { id: "vin", label: "VIN", type: "text", placeholder: "17-character vehicle identification number", showIf: isVehicle },
        { id: "odometer", label: "Odometer (miles)", type: "number", half: true, placeholder: "84,200", showIf: isVehicle },
        {
          id: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "e.g. Herman Miller Aeron chair, size B, graphite, serial no. 12345",
          help: "Include brand, model and serial number if it has one.",
          showIf: (a) => !isVehicle(a),
        },
      ],
    },
    { id: "seller", label: "Seller", title: "Who is the seller?", fields: partyFields("s", "seller") },
    { id: "buyer", label: "Buyer", title: "Who is the buyer?", fields: partyFields("b", "buyer") },
    {
      id: "sale", label: "Price & terms",
      title: "Price and terms",
      fields: [
        { id: "price", label: "Sale price", type: "money", required: true, half: true, placeholder: "7,500" },
        { id: "saleDate", label: "Date of sale", type: "date", required: true, half: true },
        {
          id: "paymentMethod",
          label: "Payment method",
          type: "select",
          defaultValue: "cash",
          options: [
            { value: "cash", label: "Cash" },
            { value: "check", label: "Check" },
            { value: "cashier", label: "Cashier’s check" },
            { value: "transfer", label: "Bank transfer" },
            { value: "trade", label: "Trade" },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "choice",
          defaultValue: "asis",
          options: [
            { value: "asis", label: "Sold “as is”", description: "No promises about condition. Most common." },
            { value: "warranty", label: "With a warranty", description: "Seller guarantees something specific." },
          ],
        },
        {
          id: "warranty",
          label: "What does the seller guarantee?",
          type: "textarea",
          placeholder: "e.g. the engine and transmission will work for 30 days after the sale",
          showIf: (a) => a.condition === "warranty",
        },
      ],
    },
    {
      id: "law", label: "State & notary",
      title: "Location and notary",
      fields: [
        governingLawField,
        {
          id: "notary",
          label: "Add a notary section?",
          type: "choice",
          defaultValue: "no",
          options: [
            { value: "no", label: "No", description: "Fine for most private sales." },
            { value: "yes", label: "Yes", description: "Needed in a few states." },
          ],
        },
      ],
    },
  ],
  render(input) {
    const a: Answers = { ...input, odometer: withCommas(input.odometer) };
    const c = makeCtx(a);
    const vehicle = isVehicle(a);
    const payment = c.opt(
      "paymentMethod",
      { cash: "cash", check: "check", cashier: "cashier’s check", transfer: "bank transfer", trade: "trade" },
      "payment method",
    );
    const blocks: Block[] = [
      { type: "title", text: vehicle ? "Vehicle Bill of Sale" : "Bill of Sale" },
      {
        type: "paragraph",
        text: `On ${c.date("saleDate", "date of sale")}, ${partyIntro(c, "s", "seller name")} (the “Seller”), sells and transfers to ${partyIntro(c, "b", "buyer name")} (the “Buyer”), the following property (the “Property”) for the total price of ${c.money("price", "price")}, paid by ${payment}. The Seller acknowledges receipt of payment in full.`,
      },
      { type: "heading", text: vehicle ? "Vehicle" : "Property" },
    ];
    if (vehicle)
      blocks.push({
        type: "list",
        items: [
          `Year: ${c.v("year", "year")}`,
          `Make: ${c.v("make", "make")}`,
          `Model: ${c.v("model", "model")}`,
          `Color: ${c.v("color", "color")}`,
          `VIN: ${c.v("vin", "VIN")}`,
          `Odometer reading: ${c.v("odometer", "miles")} miles`,
        ],
      });
    else blocks.push({ type: "paragraph", text: c.v("description", "description of the item") });

    blocks.push(
      {
        type: "clause",
        title: "Ownership",
        paragraphs: [
          "The Seller states that the Seller is the lawful owner of the Property, has the right to sell it, and that the Property is free of all liens, loans and claims by others.",
        ],
      },
      {
        type: "clause",
        title: "Condition",
        paragraphs: [
          c.is("condition", "warranty")
            ? `The Seller warrants the following: ${c.v("warranty", "warranty")}. Except for this warranty, the Property is sold without any other warranty, express or implied.`
            : "The Property is sold “AS IS, WHERE IS”, with all faults. The Seller makes no warranties, express or implied, including any warranty of merchantability or fitness for a particular purpose. The Buyer has had the opportunity to inspect the Property and accepts its condition.",
        ],
      },
    );
    if (vehicle)
      blocks.push({
        type: "clause",
        title: "Odometer Disclosure",
        paragraphs: [
          `Federal and state law require the Seller to state the mileage when transferring ownership. The Seller certifies that, to the best of the Seller’s knowledge, the odometer reading of ${c.v("odometer", "miles")} miles reflects the actual mileage of the vehicle unless otherwise stated here: ____________________.`,
        ],
      });
    blocks.push(
      {
        type: "clause",
        title: "Taxes and Registration",
        paragraphs: [
          "The Buyer is responsible for any sales or use tax, registration, title transfer and other fees arising from this sale.",
        ],
      },
      {
        type: "clause",
        title: "Governing Law",
        paragraphs: [`This Bill of Sale is governed by the laws of the State of ${c.v("state", "state")}.`],
      },
      {
        type: "signatures",
        parties: [sigParty(c, "s", "SELLER", "seller name"), sigParty(c, "b", "BUYER", "buyer name")],
      },
    );
    if (c.is("notary", "yes")) blocks.push({ type: "notary", state: c.v("state", "state") });
    return blocks;
  },
  warnings(a) {
    if (a.itemKind !== "vehicle") return [];
    return [
      {
        level: "info" as const,
        text: `Selling a vehicle${a.state ? ` in ${a.state}` : ""}? You'll usually also need to sign over the title, and some states require their own DMV bill of sale form or a notarized signature. Check your state DMV's website before you sign.`,
      },
    ];
  },
};
