import type { Answers } from "./doc";
import { MARKET } from "./market";

// Example answers used for marketing previews.
export const NDA_SAMPLE: Answers = {
  ndaType: "mutual",
  aType: "company",
  aName: "Northwind Labs LLC",
  aAddress: "500 Market St, San Francisco, CA",
  aSigner: "Priya Patel",
  aSignerTitle: "CEO",
  bType: "individual",
  bName: "Daniel Cho",
  bAddress: "88 Pine Ave, Oakland, CA",
  purpose: "evaluating a potential product partnership",
  effectiveDate: "2026-10-04",
  term: "3",
  state: "California",
};

export const LEASE_SAMPLE_NB: Answers = {
  utType: "individual",
  utName: "Kari Hansen",
  utAddress: "Bjerregaards gate 12, 0172 Oslo",
  ltName: "Ola Nordmann",
  ltBirth: "1994-03-12",
  address: "Storgata 1 H0201, 0155 Oslo",
  propType: "leilighet",
  term: "tidsubestemt",
  start: "2026-11-01",
  rent: "12000",
  dueDay: "1",
  security: "depositum",
  deposit: "36000",
};

// The landing page hero: which document, sample answers and highlighted field.
export const HERO =
  MARKET === "no"
    ? { slug: "husleiekontrakt", answers: LEASE_SAMPLE_NB, active: "ltName" }
    : { slug: "non-disclosure-agreement", answers: NDA_SAMPLE, active: "bName" };
