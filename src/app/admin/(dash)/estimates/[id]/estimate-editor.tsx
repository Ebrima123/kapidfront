"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Printer, Trash2, X } from "lucide-react";
import { CUSTOMER_RELATION, ESTIMATE_STATUSES } from "@/components/admin/crm-fields";
import { FieldInput, type FieldDef } from "@/components/admin/resource-form";
import { ErrorBox, PageHeader, Spinner } from "@/components/admin/ui";
import { api, ApiError } from "@/lib/api-client";
import { date, money } from "@/lib/format";
import type { Estimate, EstimateItem, SiteSettings } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type Draft = Omit<Estimate, "id" | "number" | "subtotal" | "tax" | "total" | "customer_name" | "lead_name" | "created_at">;

const HEADER_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", placeholder: "e.g. Full interior repaint" },
  { name: "status", label: "Status", type: "select", options: ESTIMATE_STATUSES },
  { name: "customer", label: "Customer", type: "relation", relation: CUSTOMER_RELATION },
  {
    name: "lead",
    label: "Lead",
    type: "relation",
    relation: { endpoint: "crm/leads", label: (r) => `${r.name as string} (${r.email as string})` },
  },
  { name: "issue_date", label: "Issue date", type: "date" },
  { name: "valid_until", label: "Valid until", type: "date" },
  { name: "tax_rate", label: "Tax rate (%)", type: "money" },
];

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const num = (v: string | number | null | undefined) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function toDraft(e: Estimate): Draft {
  return {
    title: e.title,
    status: e.status,
    customer: e.customer,
    lead: e.lead,
    job: e.job,
    issue_date: e.issue_date,
    valid_until: e.valid_until,
    tax_rate: e.tax_rate,
    notes: e.notes,
    items: e.items,
  };
}

export function EstimateEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const search = useSearchParams();
  const existing = useApi<Estimate>(isNew ? null : `crm/estimates/${id}`);
  const settings = useApi<SiteSettings>("cms/settings");
  const [draft, setDraft] = useState<Draft | null>(() =>
    isNew
      ? {
          title: "",
          status: "draft",
          customer: search.get("customer") ? Number(search.get("customer")) : null,
          lead: search.get("lead") ? Number(search.get("lead")) : null,
          job: null,
          issue_date: today(),
          valid_until: plusDays(30),
          tax_rate: "0",
          notes: "",
          items: [{ description: "", quantity: "1", unit_price: "0" }],
        }
      : null,
  );
  const [syncedFrom, setSyncedFrom] = useState<Estimate | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const number = existing.data?.number ?? "";

  // Reset the editable draft whenever a fresh copy arrives from the server.
  if (!isNew && existing.data && existing.data !== syncedFrom) {
    setSyncedFrom(existing.data);
    setDraft(toDraft(existing.data));
  }

  if (existing.error) return <ErrorBox message={existing.error} />;
  if (!draft) return <Spinner />;

  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const setItem = (i: number, patch: Partial<EstimateItem>) =>
    set({ items: draft.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });

  const subtotal = draft.items.reduce((s, it) => s + num(it.quantity) * num(it.unit_price), 0);
  const tax = (subtotal * num(draft.tax_rate)) / 100;

  async function save() {
    if (!draft) return;
    setSaving(true);
    setError(null);
    const body = {
      ...draft,
      customer: draft.customer || null,
      lead: draft.lead || null,
      issue_date: draft.issue_date || null,
      valid_until: draft.valid_until || null,
      items: draft.items
        .filter((it) => it.description.trim())
        .map((it, order) => ({ description: it.description, quantity: it.quantity || "0", unit_price: it.unit_price || "0", order })),
    };
    try {
      if (isNew) {
        const created = await api<Estimate>("crm/estimates", { method: "POST", json: body });
        router.replace(`/admin/estimates/${created.id}`);
      } else {
        const updated = await api<Estimate>(`crm/estimates/${id}`, { method: "PUT", json: body });
        existing.setData(updated);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save the estimate.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this estimate?")) return;
    await api(`crm/estimates/${id}`, { method: "DELETE" });
    router.replace("/admin/estimates");
  }

  const company = settings.data;

  return (
    <>
      <div className="no-print">
        <Link href="/admin/estimates" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> Estimates
        </Link>
        <PageHeader
          title={isNew ? "New estimate" : number}
          actions={
            <>
              {!isNew && (
                <>
                  <button className="btn btn-ghost" onClick={() => window.print()}>
                    <Printer className="size-4" /> Print / PDF
                  </button>
                  <button className="btn btn-ghost text-red-600" onClick={remove}>
                    <Trash2 className="size-4" /> Delete
                  </button>
                </>
              )}
              <button className="btn btn-dark" onClick={save} disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />} Save
              </button>
            </>
          }
        />
        {error && <div className="mb-4"><ErrorBox message={error} /></div>}

        <section className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {HEADER_FIELDS.map((f) => (
            <div key={f.name}>
              <label className="label" htmlFor={f.name}>{f.label}</label>
              <FieldInput
                field={f}
                value={draft[f.name as keyof Draft]}
                onChange={(v) => set({ [f.name]: f.type === "relation" ? (v ? Number(v) : null) : v } as Partial<Draft>)}
              />
            </div>
          ))}
        </section>

        <section className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-sand/50 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
                <th className="w-24 px-2 py-3 text-right font-semibold">Qty</th>
                <th className="w-32 px-2 py-3 text-right font-semibold">Unit price</th>
                <th className="w-28 px-4 py-3 text-right font-semibold">Total</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {draft.items.map((it, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <input
                      className="input"
                      value={it.description}
                      placeholder="e.g. Living room walls, 2 coats"
                      onChange={(e) => setItem(i, { description: e.target.value })}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input className="input text-right" type="number" step="0.01" value={it.quantity} onChange={(e) => setItem(i, { quantity: e.target.value })} />
                  </td>
                  <td className="px-2 py-2">
                    <input className="input text-right" type="number" step="0.01" value={it.unit_price} onChange={(e) => setItem(i, { unit_price: e.target.value })} />
                  </td>
                  <td className="px-4 py-2 text-right font-medium">{money(num(it.quantity) * num(it.unit_price))}</td>
                  <td className="pr-3">
                    <button
                      className="rounded p-1 text-muted hover:text-red-600"
                      aria-label="Remove line"
                      onClick={() => set({ items: draft.items.filter((_, j) => j !== i) })}
                    >
                      <X className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap items-start justify-between gap-6 border-t border-line p-4">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => set({ items: [...draft.items, { description: "", quantity: "1", unit_price: "0" }] })}
            >
              <Plus className="size-4" /> Add line
            </button>
            <dl className="w-full max-w-64 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Tax ({num(draft.tax_rate)}%)</dt><dd>{money(tax)}</dd></div>
              <div className="flex justify-between border-t border-line pt-1 text-base font-semibold"><dt>Total</dt><dd>{money(subtotal + tax)}</dd></div>
            </dl>
          </div>
        </section>

        <section className="card mt-6 p-5">
          <label className="label" htmlFor="notes">Notes & terms (shown on the estimate)</label>
          <textarea id="notes" className="input" rows={4} value={draft.notes} onChange={(e) => set({ notes: e.target.value })} />
        </section>
      </div>

      {/* Print-only document */}
      <article className="hidden text-sm print:block">
        <header className="flex justify-between border-b pb-6">
          <div>
            <p className="font-display text-2xl font-semibold">{company?.company_name ?? "Kapid Painting Company"}</p>
            <p>{company?.address}</p>
            <p>{[company?.phone, company?.email].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">Estimate {number}</p>
            <p>Issued {date(draft.issue_date)}</p>
            <p>Valid until {date(draft.valid_until)}</p>
          </div>
        </header>
        {draft.title && <h1 className="mt-6 text-lg font-semibold">{draft.title}</h1>}
        <table className="mt-6 w-full">
          <thead className="border-b text-left">
            <tr><th className="py-2">Description</th><th className="text-right">Qty</th><th className="text-right">Unit</th><th className="text-right">Total</th></tr>
          </thead>
          <tbody>
            {draft.items.filter((it) => it.description).map((it, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{it.description}</td>
                <td className="text-right">{it.quantity}</td>
                <td className="text-right">{money(it.unit_price)}</td>
                <td className="text-right">{money(num(it.quantity) * num(it.unit_price))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 ml-auto w-64 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between"><span>Tax ({num(draft.tax_rate)}%)</span><span>{money(tax)}</span></div>
          <div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>{money(subtotal + tax)}</span></div>
        </div>
        {draft.notes && <p className="mt-8 whitespace-pre-line">{draft.notes}</p>}
      </article>
    </>
  );
}
