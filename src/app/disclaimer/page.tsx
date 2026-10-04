import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Legal disclaimer", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return (
    <LegalPage current="/disclaimer" title="Legal disclaimer" intro={`${SITE.name} is a self-help tool, not a law firm.`}>
      <p>
        {SITE.name} provides general legal document templates that you complete yourself. We do not give legal advice,
        recommend which document or options are right for you, or review your answers. Nothing on this site is a substitute
        for the advice of a licensed attorney.
      </p>
      <h2>Laws differ</h2>
      <p>
        Our templates are written for general use in the United States. Laws vary between states and cities and change over
        time. Some situations need extra terms, disclosures or formalities (for example lead-paint disclosures for older
        rental homes, notarization or witnesses for a power of attorney, or rent-control rules). You are responsible for
        checking the requirements that apply to you.
      </p>
      <h2>When to talk to a lawyer</h2>
      <ul>
        <li>The deal is large, unusual or high-stakes.</li>
        <li>The other side has a lawyer, or is pushing back on the terms.</li>
        <li>There is already a dispute.</li>
        <li>You&apos;re not sure the document fits your situation.</li>
      </ul>
      <p>Many lawyers offer a fixed-fee review of a document you have already prepared, which is often much cheaper than having one drafted.</p>
    </LegalPage>
  );
}
