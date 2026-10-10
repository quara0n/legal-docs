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
    // Top on phones so it never covers the wizard's bottom buttons; compact everywhere.
    <div role="dialog" aria-live="polite" aria-label={t.cookies.more} className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-xl flex-col gap-2.5 rounded-2xl border border-line bg-white p-3 shadow-[0_20px_50px_-20px_rgba(20,23,31,0.45)] sm:top-auto sm:bottom-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <p className="text-[13px] leading-snug text-ink-soft sm:flex-1">
        {t.cookies.text}{" "}
        <Link href="/privacy" className="font-medium text-brand underline">
          {t.cookies.more}
        </Link>
      </p>
      <div className="grid shrink-0 grid-cols-2 gap-2">
        <button onClick={() => choose("denied")} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-paper">
          {t.cookies.reject}
        </button>
        <button onClick={() => choose("granted")} className="rounded-full border border-ink bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black">
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
