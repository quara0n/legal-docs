"use client";

import { t } from "@/i18n";
import type { Field as FieldDef } from "@/lib/doc";
import { MARKET } from "@/lib/market";
import { Icon } from "./Icon";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink sm:text-[15px] shadow-[0_1px_0_rgba(0,0,0,0.02)] outline-none transition placeholder:text-[#a8a59d] hover:border-[#d6d0c2] focus:border-brand focus:ring-4 focus:ring-brand/12 aria-[invalid=true]:border-[#e5484d] aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-[#e5484d]/10";

interface Props {
  field: FieldDef;
  value: string;
  error?: string;
  regions: string[];
  onChange: (v: string) => void;
  onFocus: () => void;
  onEnter: () => void;
  autoFocus?: boolean;
}

export function Field({ field, value, error, regions, onChange, onFocus, onEnter, autoFocus }: Props) {
  const id = `f-${field.id}`;
  const describedBy = [field.help ? `${id}-help` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: field.id,
    onFocus,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    autoFocus,
  };
  const enter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    }
  };

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          {...common}
          rows={4}
          className={`${inputCls} resize-y leading-relaxed`}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "choice":
      control = (
        <div role="radiogroup" aria-labelledby={`${id}-label`} className={`grid gap-3 ${field.options!.length === 2 ? "sm:grid-cols-2" : field.options!.length === 3 ? "sm:grid-cols-3" : ""}`}>
          {field.options!.map((o, i) => {
            const checked = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={checked}
                autoFocus={autoFocus && (checked || (!value && i === 0))}
                onFocus={onFocus}
                onClick={() => {
                  onChange(o.value);
                  onFocus();
                }}
                className={`group relative rounded-xl border p-4 text-left transition ${
                  checked ? "border-brand bg-brand-soft/60 ring-4 ring-brand/10" : "border-line bg-white hover:border-[#cfcabd]"
                }`}
              >
                <span
                  className={`absolute top-4 right-4 grid size-5 place-items-center rounded-full border transition ${
                    checked ? "border-brand bg-brand text-white" : "border-[#cfcabd] bg-white text-transparent"
                  }`}
                >
                  <Icon name="check" className="size-3" strokeWidth={3} />
                </span>
                <span className="block pr-7 font-medium">{o.label}</span>
                {o.description && <span className="mt-1 block pr-6 text-sm leading-snug text-muted">{o.description}</span>}
              </button>
            );
          })}
        </div>
      );
      break;
    case "multi": {
      const set = new Set(value.split(",").filter(Boolean));
      const toggle = (v: string) => {
        if (set.has(v)) set.delete(v);
        else set.add(v);
        onChange(field.options!.map((o) => o.value).filter((x) => set.has(x)).join(","));
        onFocus();
      };
      control = (
        <div className="space-y-2">
          <div className="flex gap-3 text-sm">
            <button type="button" className="font-medium text-brand hover:underline" onClick={() => onChange(field.options!.map((o) => o.value).join(","))}>
              {t.field.selectAll}
            </button>
            <span className="text-line">|</span>
            <button type="button" className="font-medium text-brand hover:underline" onClick={() => onChange("")}>
              {t.field.clear}
            </button>
          </div>
          <div className="grid gap-2">
            {field.options!.map((o) => {
              const checked = set.has(o.value);
              return (
                <label
                  key={o.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-[14.5px] transition ${
                    checked ? "border-brand/50 bg-brand-soft/50" : "border-line bg-white hover:border-[#cfcabd]"
                  }`}
                >
                  <input type="checkbox" className="mt-0.5 size-4 accent-[var(--color-brand)]" checked={checked} onChange={() => toggle(o.value)} onFocus={onFocus} />
                  <span>{o.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );
      break;
    }
    case "select":
    case "region": {
      const options = field.type === "region" ? regions.map((r) => ({ value: r, label: r })) : field.options!;
      control = (
        <div className="relative">
          <select {...common} className={`${inputCls} appearance-none pr-10`} value={value} onChange={(e) => onChange(e.target.value)}>
            {field.type === "region" && <option value="">{t.field.choose}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      );
      break;
    }
    case "money":
      control = (
        <div className="relative">
          <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${MARKET === "no" ? "right-4" : "left-3.5"}`}>{MARKET === "no" ? "kr" : "$"}</span>
          <input
            {...common}
            inputMode="decimal"
            className={`${inputCls} ${MARKET === "no" ? "pr-11" : "pl-7"}`}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(MARKET === "no" ? /[^0-9., ]/g : /[^0-9.,]/g, ""))}
            onKeyDown={enter}
          />
        </div>
      );
      break;
    default:
      control = (
        <input
          {...common}
          type={field.type === "date" ? "date" : field.type === "email" ? "email" : "text"}
          inputMode={field.type === "number" ? "numeric" : undefined}
          className={inputCls}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(field.type === "number" ? e.target.value.replace(/[^0-9]/g, "") : e.target.value)}
          onKeyDown={enter}
        />
      );
  }

  return (
    <div key={error ? "err" : "ok"} className={`${field.half ? "sm:col-span-1" : "sm:col-span-2"} ${error ? "animate-shake" : ""}`}>
      <label id={`${id}-label`} htmlFor={field.type === "choice" || field.type === "multi" ? undefined : id} className="mb-2 block text-[14px] font-medium text-ink">
        {field.label}
        {field.required && <span className="ml-0.5 text-brand" aria-hidden="true">*</span>}
      </label>
      {control}
      {field.help && !error && (
        <p id={`${id}-help`} className="mt-1.5 text-[13px] text-muted">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#b42318]">
          <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5h1.5v4.75h-1.5V4.5zm.75 7.25a.9.9 0 110-1.8.9.9 0 010 1.8z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
