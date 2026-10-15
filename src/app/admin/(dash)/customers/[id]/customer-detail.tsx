"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Mail, MapPin, Pencil, Phone, Plus } from "lucide-react";
import { CUSTOMER_FIELDS, JOB_FIELDS } from "@/components/admin/crm-fields";
import { NotesPanel } from "@/components/admin/notes-panel";
import { ResourceForm, toPayload } from "@/components/admin/resource-form";
import { Empty, ErrorBox, Modal, PageHeader, Spinner, StatusBadge } from "@/components/admin/ui";
import { api } from "@/lib/api-client";
import { date, label, money } from "@/lib/format";
import type { Customer, Estimate, Job, Paginated } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function CustomerDetail({ id }: { id: string }) {
  const { data: customer, error, setData } = useApi<Customer>(`crm/customers/${id}`);
  const jobs = useApi<Paginated<Job>>("crm/jobs", { customer: id, page_size: 100 });
  const estimates = useApi<Paginated<Estimate>>("crm/estimates", { customer: id, page_size: 100 });
  const [editing, setEditing] = useState(false);
  const [job, setJob] = useState<Job | "new" | null>(null);

  if (error) return <ErrorBox message={error} />;
  if (!customer) return <Spinner />;

  const jobFields = JOB_FIELDS.filter((f) => f.name !== "customer");

  return (
    <>
      <Link href="/admin/customers" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Customers
      </Link>
      <PageHeader
        title={customer.full_name}
        description={customer.company || `Customer since ${date(customer.created_at)}`}
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              <Pencil className="size-4" /> Edit
            </button>
            <Link className="btn btn-ghost" href={`/admin/estimates/new?customer=${customer.id}`}>
              <FileText className="size-4" /> New estimate
            </Link>
            <button className="btn btn-dark" onClick={() => setJob("new")}>
              <Plus className="size-4" /> New job
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <section className="card space-y-2 p-5 text-sm">
            {customer.email && (
              <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-brand-600 hover:underline">
                <Mail className="size-4" /> {customer.email}
              </a>
            )}
            {customer.phone && (
              <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-brand-600 hover:underline">
                <Phone className="size-4" /> {customer.phone}
              </a>
            )}
            {(customer.address || customer.city) && (
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-muted" />
                {[customer.address, customer.city, customer.postcode].filter(Boolean).join(", ")}
              </p>
            )}
            <p className="pt-2 text-xs text-muted">Source: {label(customer.source)}</p>
          </section>
          <NotesPanel owner={{ customer: customer.id }} />
        </div>

        <div className="space-y-6">
          <section className="card">
            <h2 className="border-b border-line px-5 py-4 font-semibold">Jobs</h2>
            {jobs.data?.results.length === 0 && <Empty>No jobs yet.</Empty>}
            <ul className="divide-y divide-line">
              {jobs.data?.results.map((j) => (
                <li key={j.id}>
                  <button onClick={() => setJob(j)} className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-cream">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{j.title}</p>
                      <p className="text-xs text-muted">
                        {date(j.start_date)} · {money(j.price)}
                        {j.assigned_to && ` · ${j.assigned_to}`}
                      </p>
                    </div>
                    <StatusBadge status={j.status} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="border-b border-line px-5 py-4 font-semibold">Estimates</h2>
            {estimates.data?.results.length === 0 && <Empty>No estimates yet.</Empty>}
            <ul className="divide-y divide-line">
              {estimates.data?.results.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/estimates/${e.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-cream">
                    <div>
                      <p className="font-medium">{e.number} {e.title && `· ${e.title}`}</p>
                      <p className="text-xs text-muted">{date(e.issue_date)} · {money(e.total)}</p>
                    </div>
                    <StatusBadge status={e.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <Modal title="Edit customer" open={editing} onClose={() => setEditing(false)} wide>
        <ResourceForm
          fields={CUSTOMER_FIELDS}
          initial={customer}
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            setData(await api<Customer>(`crm/customers/${id}`, { method: "PATCH", ...toPayload(CUSTOMER_FIELDS, values) }));
            setEditing(false);
          }}
        />
      </Modal>

      <Modal title={job === "new" ? "New job" : "Edit job"} open={job !== null} onClose={() => setJob(null)} wide>
        <ResourceForm
          key={job === "new" ? "new" : (job?.id ?? "none")}
          fields={jobFields}
          initial={
            job === "new" || job === null
              ? { status: "scheduled", address: [customer.address, customer.city].filter(Boolean).join(", ") }
              : job
          }
          onCancel={() => setJob(null)}
          onSubmit={async (values) => {
            const payload = toPayload(jobFields, values);
            if (job === "new") {
              await api("crm/jobs", { method: "POST", json: { ...payload.json, customer: customer.id } });
            } else if (job) {
              await api(`crm/jobs/${job.id}`, { method: "PATCH", ...payload });
            }
            setJob(null);
            jobs.reload();
          }}
        />
      </Modal>
    </>
  );
}
