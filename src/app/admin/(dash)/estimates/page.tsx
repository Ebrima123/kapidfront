"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ESTIMATE_STATUSES } from "@/components/admin/crm-fields";
import { Empty, ErrorBox, PageHeader, Spinner, StatusBadge } from "@/components/admin/ui";
import { date, money } from "@/lib/format";
import type { Estimate, Paginated } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export default function EstimatesPage() {
  const [status, setStatus] = useState("");
  const { data, error, loading } = useApi<Paginated<Estimate>>("crm/estimates", { status, page_size: 100 });

  return (
    <>
      <PageHeader
        title="Estimates"
        description="Itemised quotes for customers and leads."
        actions={
          <Link href="/admin/estimates/new" className="btn btn-dark">
            <Plus className="size-4" /> New estimate
          </Link>
        }
      />
      <div className="card overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-line p-3">
          {[{ value: "", label: "All" }, ...ESTIMATE_STATUSES].map((o) => (
            <button
              key={o.value}
              className={`btn btn-sm ${status === o.value ? "btn-dark" : "btn-ghost"}`}
              onClick={() => setStatus(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
        {error ? (
          <div className="p-4"><ErrorBox message={error} /></div>
        ) : loading && !data ? (
          <Spinner />
        ) : !data?.results.length ? (
          <Empty>No estimates yet.</Empty>
        ) : (
          <ul className="divide-y divide-line">
            {data.results.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/estimates/${e.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-cream">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {e.number}
                      {e.title && <span className="font-normal text-muted"> · {e.title}</span>}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {e.customer_name || e.lead_name || "No client"} · {date(e.issue_date ?? e.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{money(e.total)}</span>
                    <StatusBadge status={e.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
