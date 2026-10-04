import Link from "next/link";
import { SITE } from "@/lib/site";

// Every piece of interface text for the US (English) site. The Norwegian site
// has the same shape in nb.tsx.
export const en = {
  meta: {
    title: `${SITE.name}: Legal documents, one honest price`,
    description:
      "Create NDAs, leases, bills of sale, contracts and powers of attorney in minutes. Preview free, pay once per document. No subscription, no account.",
    ogAlt: "Legal documents at one honest price",
    ogEyebrow: "No subscription. No account.",
    ogTitle: "Legal documents at one honest price.",
    ogFooter: "Preview free · Pay once · Keep forever",
    docOgAlt: "Document template",
    docOgEyebrow: (price: string) => `${price} once · no subscription`,
    docOgTitle: (name: string) => `${name} template`,
    docOgFooter: (min: number) => `Ready in about ${min} minutes · free preview`,
    docsTitle: "Legal document templates",
    docsDescription: "NDA, residential lease, bill of sale, freelance contract and power of attorney templates. Preview free, pay once per document.",
    createTitle: (name: string) => `Create your ${name}`,
    readyTitle: "Your document is ready",
  },

  nav: {
    documents: "Documents",
    pricing: "Pricing",
    faq: "FAQ",
    create: "Create a document",
  },

  footer: {
    blurb: "Simple legal documents at one honest price. Pay once per document, keep it forever. No subscription, no account, no surprises.",
    documents: "Documents",
    pricing: "Pricing",
    terms: "Terms of service",
    privacy: "Privacy policy",
    refunds: "Refund policy",
    disclaimer: "Not legal advice",
    contact: "Contact",
    legal: `${SITE.name} is not a law firm and does not provide legal advice. Our templates are general documents that you complete yourself, and they are not a substitute for the advice of an attorney. For advice about your situation, talk to a licensed attorney in your state.`,
  },

  legalNav: {
    label: "Legal pages",
    terms: "Terms of service",
    privacy: "Privacy policy",
    refunds: "Refund policy",
    disclaimer: "Legal disclaimer",
    updated: (d: string) => `Last updated ${d}`,
  },

  categories: { Business: "Business", "Real estate": "Real estate", Personal: "Personal" } as Record<string, string>,

  card: {
    once: (min: number) => ` once · ~${min} min`,
    start: "Start",
  },

  home: {
    badge: "No subscription. No account. No surprises.",
    h1: (
      <>
        Legal documents at one <em className="text-brand">honest</em> price.
      </>
    ),
    lead: (min: string) =>
      `Answer a few simple questions and watch your NDA, lease or contract write itself. Read every word for free. Pay once, from ${min}, only when you want to download it.`,
    cta: "Create a document",
    how: "How it works",
    bullets: ["Free full preview", "Pay once, keep forever", "Ready in about 5 minutes"],
    heroStep: "Step 3 of 7",
    heroQuestion: "Who is the second party?",
    heroAnswer: "Daniel Cho",
    continue: "Continue",
    trustLabel: "Why people trust us",
    trust: [
      { icon: "lock", title: "Private by design", text: "Answers stay in your browser" },
      { icon: "shield", title: "Secure checkout", text: "Payments handled by Stripe" },
      { icon: "refresh", title: `${SITE.refundDays}-day refund`, text: "No forms, no questions" },
      { icon: "file", title: "Yours forever", text: "Clean PDF, no watermark" },
    ],
    pickTitle: "Pick your document",
    pickLead: "The price you see is the price you pay. Nothing more.",
    allDocs: "All documents →",
    moreTitle: "More on the way",
    moreText: "Eviction notices, last wills and more. Missing something? Tell us.",
    moreLink: "Request a document →",
    moreSubject: "Document request",
    howEyebrow: "How it works",
    howTitle: "From blank page to signed in four steps",
    howLead: "You always see where you are, what's next, and what it costs.",
    pricingEyebrow: "Pricing",
    pricingTitle: "You need one document, not a subscription.",
    pricingLead:
      "Many legal-form sites hide the price until the end, then sign you up for a trial that quietly renews every month. We think that's backwards. Here is every price we charge:",
    compareThem: "Typical legal-form sites",
    compare: [
      { label: "Price", them: "Trial that turns into $30–$40 every month", us: "$9–$19 once per document" },
      { label: "See the document before paying", them: "Often only after you sign up", us: "Yes, every word, live as you type" },
      { label: "Account required", them: "Yes", us: "No" },
      { label: "Something to cancel", them: "Yes, or you keep getting charged", us: "Nothing, ever" },
      { label: "Keep your document", them: "Access can end when you cancel", us: "The PDF is yours forever" },
    ],
    faqTitle: "Questions, answered",
    faqLead: (
      <>
        Something else? Email{" "}
        <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-brand underline">
          {SITE.supportEmail}
        </a>
        . A real person replies.
      </>
    ),
    faq: [
      {
        q: "Is it really a one-time payment?",
        a: "Yes. You pay once for the document you download. There is no trial, nothing renews, and there is no subscription to cancel. We don't even ask you to create an account.",
      },
      {
        q: "Can I see the document before I pay?",
        a: "Yes. The full document builds itself live as you answer, and you can read every word before paying. You only pay when you want the clean, print-ready PDF.",
      },
      {
        q: "What if I need to change something later?",
        a: `Edit your answers and download again for free for ${SITE.editDays} days after purchase, from the same browser. The PDF itself is yours forever.`,
      },
      {
        q: "Where are my answers stored?",
        a: "Only in your own browser. We don't keep a copy on our servers. Your PDF is generated when you download it and is not stored.",
      },
      {
        q: "Are these documents legally binding?",
        a: "Contracts like these are generally binding when the parties sign them, but laws differ by state and situation. Our templates are self-help documents, not legal advice. For anything complex or high-stakes, have an attorney review it.",
      },
      {
        q: "What if I'm not happy?",
        a: `Email ${SITE.supportEmail} within ${SITE.refundDays} days and we'll refund you. No forms, no questions.`,
      },
    ],
    finalTitle: "Your document, done in five minutes.",
    finalLead: "Start now. You won't be asked for a card or an email until you choose to download.",
  },

  showcase: {
    label: "How it works",
    stages: [
      { icon: "file", short: "Choose", title: "Pick your document", text: "Choose from leases, NDAs, contracts and more. The price is on the card before you start." },
      { icon: "edit", short: "Answer", title: "Answer plain-English questions", text: "One simple question at a time, with help text where you need it. No legal jargon, no 40-field forms." },
      { icon: "eye", short: "Preview", title: "Watch it write itself", text: "Every answer appears in the document instantly, highlighted, so you always know exactly what you're signing." },
      { icon: "download", short: "Download", title: "Pay once, download, sign", text: "Happy with it? Pay once and get a clean, print-ready PDF. No subscription, nothing to cancel." },
    ],
    stepOf: (i: number) => `Step ${i} of 4`,
    docs: [
      ["shield", "Non-Disclosure Agreement", "$9"],
      ["home", "Residential Lease", "$19"],
      ["receipt", "Bill of Sale", "$9"],
    ],
    question: "Who is receiving it?",
    fieldLabel: "Full legal name",
    answer: "Daniel Cho",
    docTitle: "Non-Disclosure Agreement",
    docText: (name: React.ReactNode, purpose: React.ReactNode) => (
      <>
        This Agreement is made between <strong>Northwind Labs LLC</strong> and {name} for the purpose of {purpose}.
      </>
    ),
    purpose: "[purpose]",
    oneTime: "One-time payment",
    from: (p: string) => `from ${p}`,
    payDownload: "Pay and download",
    file: "nda.pdf",
    fileReady: "Ready to print and sign",
  },

  docs: {
    title: "Documents",
    lead: "Choose a document to start. You'll see it take shape as you answer, and pay only if you download.",
  },

  doc: {
    breadcrumb: "Documents",
    h1: (name: string) => `${name} template`,
    oneTime: "one-time",
    takes: (min: number) => `Takes about ${min} minutes`,
    start: (short: string) => `Start my ${short}`,
    perks: ["Free preview, pay to download", "No subscription or account", `Free edits for ${SITE.editDays} days`, "Print-ready PDF"],
    previewNote: "The highlighted parts are filled in from your answers.",
    when: (short: string) => `When to use a ${short}`,
    included: "What's included",
    howTitle: (short: string) => `How to make your ${short}`,
    howLead: (n: number, min: number) => `${n} short steps, about ${min} minutes. You can go back and change anything until you download.`,
    stepFallback: (label: string) => `Answer a few quick questions about the ${label.toLowerCase()}.`,
    reviewTitle: "Review",
    reviewText: "Read the whole document, with every answer highlighted. Change anything with one click.",
    downloadTitle: "Download and sign",
    downloadText: (price: string) => `Pay ${price} once and get a print-ready PDF. Everyone signs and keeps a copy.`,
    faqTitle: "Frequently asked questions",
    createFor: (short: string, price: string) => `Create my ${short} for ${price}`,
    notAdvice: "Not legal advice. Laws vary by state.",
    others: "Other documents",
    howToName: (name: string) => `How to make a ${name}`,
  },

  wizard: {
    autosaved: "Autosaved in this browser",
    oneTimeBadge: "one-time · pay only to download",
    close: "Close editor",
    questions: "Questions",
    progress: "Progress",
    step: (n: number) => `Step ${n}`,
    of: (n: number) => `of ${n}`,
    stepAria: (i: number, label: string, done: boolean) => `Step ${i}: ${label}${done ? " (done)" : ""}`,
    back: "Back",
    orPress: "or press",
    review: "Review",
    reviewDoc: "Review document",
    continue: "Continue",
    reviewTitle: "Review and download",
    required: "This one is needed for your document.",
    checkoutUnavailable: "Checkout is unavailable right now.",
    wrong: "Something went wrong.",
    confirmReset: "Clear all answers and start over?",
    payOnce: (price: string) => `Pay once · ${price}`,
    downloadSign: "Download & sign",
    pdfReady: "Print-ready PDF",
    staysOnDevice: "Your answers stay on this device until you download.",
    startOver: "Start over",
    preview: "Document preview",
    livePreview: "Live preview",
    filled: (a: number, b: number) => `${a} of ${b} details filled`,
    watermarkNote: "The watermark is only on the preview. Your PDF is clean, with page numbers and signature lines.",
    previewBtn: "Preview",
    closePreview: "Close preview",
    backToQuestions: "Back to questions",
    selected: (n: number) => `${n} selected`,
    reviewLead: "Check your answers against the preview. You can still change anything.",
    missing: "A few answers are still missing:",
    owned: "You already own this document",
    ownedText: `Edits and re-downloads are free for ${SITE.editDays} days after purchase.`,
    downloadUpdated: "Download updated PDF",
    yourDoc: "Your document",
    perks: [
      "Print-ready PDF, no watermark, no branding",
      `Free edits and re-downloads for ${SITE.editDays} days`,
      "No subscription, nothing renews, no account needed",
      `Not happy? Full refund within ${SITE.refundDays} days, just email us`,
    ],
    agree: (
      <>
        I understand {SITE.name} is not a law firm, this is a self-help template and not legal advice, and I&apos;m responsible
        for checking it fits my situation and state. I agree to the{" "}
        <Link href="/terms" target="_blank" className="font-medium text-brand underline">
          terms
        </Link>
        .
      </>
    ),
    opening: "Opening secure checkout…",
    pay: (price: string) => `Pay ${price} and download`,
    secure: "Secure payment by Stripe. Card, Apple Pay and Google Pay.",
    yourAnswers: "Your answers",
    notAnswered: "Not answered yet",
    edit: "Edit",
    disclaimer: `${SITE.name} provides self-help templates, not legal advice, and is not a substitute for the advice of an attorney. Laws differ by state. For complex situations, have an attorney review your document.`,
  },

  rail: {
    label: "Your path to a finished document",
    yourPath: "Your path",
    filledIn: (pct: number) => `${pct}% filled in`,
    here: "You are here",
    once: (price: string) => `${price} once, at the very end`,
    noAccount: "No account, no card and no email until you choose to download.",
  },

  field: {
    choose: "Choose…",
    selectAll: "Select all",
    clear: "Clear",
  },

  download: {
    couldNot: "We couldn't create your PDF.",
    wrong: "Something went wrong.",
    missingRef: "This link is missing its purchase reference.",
    snag: "We hit a snag",
    charged: (
      <>
        If you were charged, email{" "}
        <a className="font-medium text-brand underline" href={`mailto:${SITE.supportEmail}`}>
          {SITE.supportEmail}
        </a>{" "}
        and we will sort it out the same day.
      </>
    ),
    tryAgain: "Try again",
    received: "Payment received",
    noAnswers: `Your answers are saved only in the browser you filled them in, and we can't find them here. Open this page in that browser, or fill in the form again: your purchase covers it for ${SITE.editDays} days.`,
    fillIn: "Fill in the form",
    progressLabel: "Your progress",
    progress: ["Answered", "Reviewed", "Paid", "Ready"],
    ready: (short: string) => `Your ${short} is ready`,
    thanks: "Thanks for your purchase. It's yours to keep, with no subscription and nothing to cancel.",
    downloadPdf: "Download PDF",
    preparing: "Preparing your PDF…",
    editAnswers: "Edit answers",
    nextTitle: "What to do next",
    next: [
      "Read it through once more and make sure every name and number is right.",
      "Print it, or sign it electronically. Every party signs and keeps a copy.",
      "If it has a notary section, sign that part in front of a notary.",
      `Need a change? Edit and download again free for ${SITE.editDays} days, from this browser.`,
    ],
  },

  notFound: {
    title: "Page not found",
    text: "That page doesn't exist. Maybe you were looking for a document?",
    browse: "Browse documents",
  },

  error: {
    eyebrow: "Something went wrong",
    title: "That didn't work",
    text: (
      <>
        Your answers are still saved in this browser. Try again, and if it keeps happening email{" "}
        <a className="font-medium text-brand underline" href={`mailto:${SITE.supportEmail}`}>
          {SITE.supportEmail}
        </a>
        .
      </>
    ),
    tryAgain: "Try again",
    home: "Home",
  },

  api: {
    unknownDoc: "Unknown document.",
    productDescription: `One-time purchase. PDF download, free edits for ${SITE.editDays} days. No subscription.`,
    checkoutNote: "Self-help legal template. Not a law firm, not legal advice. One-time payment, no subscription.",
    pdfNote:
      "This document was prepared from a self-help template. It is not legal advice and was not reviewed by an attorney. Laws vary by state; you are responsible for making sure it fits your situation.",
    missingRef: "Missing purchase reference.",
    demoDisabled: "Demo purchases are disabled.",
    otherDoc: "This purchase is for a different document.",
    notConfigured: "Payments are not configured.",
    notFound: "We couldn't find that purchase.",
    notPaid: "Payment has not completed yet.",
    editsEnded: `Free edits ended ${SITE.editDays} days after purchase. Your earlier download is still yours to keep.`,
  },

  pdf: {
    page: (i: number, n: number) => `Page ${i} of ${n}`,
    initials: "Initials: ______",
  },
};

export type Dict = typeof en;
