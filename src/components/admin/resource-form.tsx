"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { ImageInput } from "./image-input";
import { ErrorBox } from "./ui";

export type Option = { value: string; label: string };

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "number" | "money" | "date" | "select" | "checkbox" | "image" | "relation";
  options?: Option[];
  /** For type "relation": endpoint to load choices from, and how to label each row. */
  relation?: { endpoint: string; label: (row: Record<string, unknown>) => string };
  required?: boolean;
  full?: boolean;
  help?: string;
  placeholder?: string;
};

export type Values = Record<string, unknown>;

const NULLABLE = new Set(["number", "money", "date", "relation"]);

/** Build a request body: multipart when a new file was picked, JSON otherwise. */
export function toPayload(fields: FieldDef[], values: Values): { json?: Values; form?: FormData } {
  const hasFile = fields.some((f) => f.type === "image" && values[f.name] instanceof File);
  if (hasFile) {
    const form = new FormData();
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === "image" && !(v instanceof File)) continue;
      if (v === undefined) continue;
      form.append(f.name, v instanceof File ? v : v === null ? "" : String(v));
    }
    return { form };
  }
  const json: Values = {};
  for (const f of fields) {
    if (f.type === "image") continue;
    const v = values[f.name];
    if (v === undefined) continue;
    json[f.name] = NULLABLE.has(f.type ?? "text") && v === "" ? null : v;
  }
  return { json };
}

function RelationSelect({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: string) => void }) {
  const [options, setOptions] = useState<Option[]>([]);
  useEffect(() => {
    api<{ results: Record<string, unknown>[] }>(field.relation!.endpoint, { query: { page_size: 200 } })
      .then((d) => setOptions(d.results.map((r) => ({ value: String(r.id), label: field.relation!.label(r) }))))
      .catch(() => setOptions([]));
  }, [field.relation]);
  return (
    <select
      id={field.name}
      className="input"
      value={value == null ? "" : String(value)}
      required={field.required}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">— Select —</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const common = { id: field.name, name: field.name, required: field.required, placeholder: field.placeholder };
  const str = value == null ? "" : String(value);
  switch (field.type) {
    case "textarea":
      return <textarea {...common} rows={5} className="input" value={str} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      return (
        <select {...common} className="input" value={str} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    case "relation":
      return <RelationSelect field={field} value={value} onChange={onChange} />;
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-brand-600"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.help ?? "Yes"}
        </label>
      );
    case "image":
      return <ImageInput id={field.name} label={field.label} value={value} onChange={onChange} />;
    case "number":
    case "money":
      return (
        <input
          {...common}
          type="number"
          step={field.type === "money" ? "0.01" : "1"}
          className="input"
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return (
        <input
          {...common}
          type={field.type ?? "text"}
          className="input"
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export function ResourceForm({
  fields,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  fields: FieldDef[];
  initial: Values;
  /** May return the saved record; its values then replace the form's (e.g. uploaded image URLs). */
  onSubmit: (values: Values) => Promise<void | Values>;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError(null);
    try {
      const saved = await onSubmit(values);
      if (saved && typeof saved === "object") {
        const names = new Set(fields.map((f) => f.name));
        setValues((v) => ({ ...v, ...Object.fromEntries(Object.entries(saved).filter(([k]) => names.has(k))) }));
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        const known = new Set(fields.map((f) => f.name));
        const f = err.fields;
        setErrors(f);
        const other = Object.entries(f).filter(([k]) => !known.has(k));
        if (other.length) setFormError(other.map(([, v]) => v).join(" "));
      } else {
        setFormError((err as Error).message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
          <label className="label" htmlFor={f.name}>
            {f.label}
            {f.required && " *"}
          </label>
          <FieldInput field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
          {f.help && f.type !== "checkbox" && <p className="mt-1 text-xs text-muted">{f.help}</p>}
          {errors[f.name] && <p className="mt-1 text-xs text-red-600">{errors[f.name]}</p>}
        </div>
      ))}
      {formError && (
        <div className="sm:col-span-2">
          <ErrorBox message={formError} />
        </div>
      )}
      <div className="flex justify-end gap-2 sm:col-span-2">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="btn btn-dark" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
