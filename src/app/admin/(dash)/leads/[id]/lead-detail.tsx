"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Mail, Pencil, Phone, UserPlus } from "lucide-react";
import { LEAD_FIELDS, LEAD_STATUSES } from "@/components/admin/crm-fields";
import { NotesPanel } from "@/components/admin/notes-panel";
import { ResourceForm, toPayload } from "@/components/admin/resource-form";
import { ErrorBox, Modal, PageHeader, Spinner, StatusBadge } from "@/components/admin/ui";
import { api } from "@/lib/api-client";
import { date, label, money } from "@/lib/format";
import type { Customer, Lead } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function LeadDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: lead, error, setData } = useApi<Lead>(`crm/leads/${id}`);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (error) return <ErrorBox message={error} />;
  if (!lead) return <Spinner />;

  async function setStatus(status: string) {
    setData(await api<Lead>(`crm/leads/${id}`, { method: "PATCH", json: { status } }));
  }

  async function convert() {
    setBusy(true);
    try {
      const customer = await api<Customer>(`crm/leads/${id}/convert`, { method: "POST" });
      router.push(`/admin/customers/${customer.id}`);
    } finally {
      setBusy(false);
    }
  }

  const facts: [string, React.ReactNode][] = [
    ["Service", lead.service || "—"],
    ["Property", label(lead.property_type)],
    ["Preferred start", date(lead.preferred_date)],
    ["Estimated value", lead.estimated_value ? money(lead.estimated_value) : "—"],
    ["Source", label(lead.source)],
    ["Received", date(lead.created_at)],
    ["Address", lead.address || "—"],
  ];

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Leads
      </Link>
      <PageHeader
        title={lead.name}
        description={`Lead #${lead.id}`}
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              <Pencil className="size-4" /> Edit
            </button>
            <Link className="btn btn-ghost" href={`/admin/estimates/new?lead=${lead.id}${lead.customer ? `&customer=${lead.customer}` : ""}`}>
              <FileText className="size-4" /> New estimate
            </Link>
            {lead.customer ? (
              <Link className="btn btn-dark" href={`/admin/customers/${lead.customer}`}>
                View customer
              </Link>
            ) : (
              <button className="btn btn-dark" onClick={convert} disabled={busy}>
                <UserPlus className="size-4" /> Convert to customer
              </button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <section className="card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">Status</span>
              <StatusBadge status={lead.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s.value}
                  className={`btn btn-sm ${lead.status === s.value ? "btn-dark" : "btn-ghost"}`}
                  onClick={() => setStatus(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          <section className="card p-5">
            <div className="space-y-2 text-sm">
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-brand-600 hover:underline">
                <Mail className="size-4" /> {lead.email}
              </a>
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-brand-600 hover:underline">
                  <Phone className="size-4" /> {lead.phone}
                </a>
              )}
            </div>
            <dl className="mt-4 divide-y divide-line text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            {lead.message && (
              <div className="mt-4 rounded-lg bg-cream p-3 text-sm whitespace-pre-line">{lead.message}</div>
            )}
          </section>
        </div>

        <NotesPanel owner={{ lead: lead.id }} />
      </div>

      <Modal title="Edit lead" open={editing} onClose={() => setEditing(false)} wide>
        <ResourceForm
          fields={LEAD_FIELDS}
          initial={lead}
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            setData(await api<Lead>(`crm/leads/${id}`, { method: "PATCH", ...toPayload(LEAD_FIELDS, values) }));
            setEditing(false);
          }}
        />
      </Modal>
    </>
  );
}
