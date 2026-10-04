// Renders every template with sample answers to ./out for a visual check.
import { mkdirSync, writeFileSync } from "node:fs";
import { getTemplates } from "../src/content";
import { withDefaults } from "../src/lib/doc";
import { renderPdf } from "../src/lib/pdf";

const sample: Record<string, string> = {
  aName: "Northwind Labs LLC", aType: "company", aAddress: "500 Market St, San Francisco, CA 94105", aSigner: "Priya Patel", aSignerTitle: "CEO",
  bName: "Daniel Cho", bAddress: "88 Pine Ave, Oakland, CA 94607", purpose: "evaluating a potential software development partnership",
  effectiveDate: "2026-10-04", state: "California",
  llName: "Maple Street Properties LLC", llType: "company", llAddress: "12 Maple St, Austin, TX 78701", llSigner: "Tom Reed", llSignerTitle: "Manager",
  tenants: "John Doe\nMary Doe", propertyAddress: "45 Elm St, Apt 3B, Austin, TX 78702", startDate: "2026-11-01", endDate: "2027-10-31",
  rent: "1850", deposit: "1850", lateFee: "50", parking: "one assigned space (#12)",
  make: "Toyota", model: "Camry", year: "2018", color: "Silver", vin: "4T1B11HK5JU123456", odometer: "84200",
  sName: "Alex Rivera", sAddress: "9 Oak Rd, Denver, CO 80203", price: "7500", saleDate: "2026-10-04", notary: "yes",
  clName: "Bluebird Bakery Inc.", clType: "company", clSigner: "Sara Lund", clSignerTitle: "Owner", prName: "Jamie Fox", prEmail: "jamie@example.com",
  services: "Design and build a 5-page marketing website, including two rounds of revisions.", amount: "4000", deposit2: "",
  pName: "Margaret Ellis", pAddress: "300 Lake Dr, Madison, WI 53703", aRelation: "nephew", hasAlt: "yes", altName: "Ruth Ellis",
};

(async () => {
  mkdirSync("out", { recursive: true });
  for (const t of getTemplates()) {
    const a = withDefaults(t, { ...sample, ...(t.slug === "general-power-of-attorney" ? { aName: "Daniel Ellis", aAddress: "17 Birch Ln, Madison, WI 53704", state: "Wisconsin" } : {}) });
    const bytes = await renderPdf(t.render(a), { title: t.name });
    writeFileSync(`out/${t.slug}.pdf`, bytes);
    console.log(t.slug, bytes.length);
  }
})();
