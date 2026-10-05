"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { CONSENT_OPEN_EVENT, TRACKING_ON, loadClarity, loadConsent, saveConsent, type Consent } from "@/lib/tracking";

// Shown only when GA4, Google Ads or Clarity is configured. Declining is as easy as accepting.
export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!TRACKING_ON) return;
    const saved = loadConsent();
    if (saved === "granted") loadClarity();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- storage is only readable after mount
    if (!saved) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;
  const choose = (c: Consent) => {
    saveConsent(c);
    setOpen(false);
  };

  return (
    <div role="dialog" aria-live="polite" aria-label={t.cookies.more} className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-4 shadow-[0_20px_50px_-20px_rgba(20,23,31,0.45)] sm:p-5">
      <p className="text-sm leading-relaxed text-ink-soft">
        {t.cookies.text}{" "}
        <Link href="/privacy" className="font-medium text-brand underline">
          {t.cookies.more}
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={() => choose("denied")} className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-paper">
          {t.cookies.reject}
        </button>
        <button onClick={() => choose("granted")} className="rounded-full border border-ink bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-black">
          {t.cookies.accept}
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsButton() {
  if (!TRACKING_ON) return null;
  return (
    <button onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className="font-medium text-brand underline">
      {t.cookies.change}
    </button>
  );
}
