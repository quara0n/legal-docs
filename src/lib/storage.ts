"use client";

import type { Answers } from "./doc";
import { SITE } from "./site";

// Everything the visitor types stays in their own browser. Nothing is stored
// on our servers: the PDF is generated on request and not kept.

const PREFIX = "fairform";

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(`${PREFIX}:${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(`${PREFIX}:${key}`);
    else window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
  } catch {
    /* private mode or storage full: the form still works, it just won't remember */
  }
}

export const loadDraft = (slug: string) => read<{ answers: Answers; step: number }>(`draft:${slug}`);
export const saveDraft = (slug: string, answers: Answers, step: number) => write(`draft:${slug}`, { answers, step });
export const clearDraft = (slug: string) => write(`draft:${slug}`, null);

export interface Purchase {
  sessionId: string;
  at: number;
}

export function loadPurchase(slug: string): Purchase | null {
  const p = read<Purchase>(`purchase:${slug}`);
  if (!p) return null;
  if (Date.now() - p.at > SITE.editDays * 86400_000) return null;
  return p;
}

export const savePurchase = (slug: string, sessionId: string) => {
  const existing = read<Purchase>(`purchase:${slug}`);
  if (existing?.sessionId === sessionId) return;
  write(`purchase:${slug}`, { sessionId, at: Date.now() });
};
