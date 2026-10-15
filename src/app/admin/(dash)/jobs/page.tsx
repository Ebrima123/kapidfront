"use client";

import Link from "next/link";
import { JOB_FIELDS, JOB_STATUSES } from "@/components/admin/crm-fields";
import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";
import { date, money } from "@/lib/format";

export default function JobsPage() {
  return (
    <ResourceManager
      title="Jobs"
      singular="Job"
      description="Scheduled and completed painting work."
      endpoint="crm/jobs"
      fields={JOB_FIELDS}
      defaults={{ status: "scheduled" }}
      filter={{ param: "status", options: JOB_STATUSES }}
      columns={[
        { key: "title", label: "Job", render: (r) => <span className="font-medium">{r.title as string}</span> },
        {
          key: "customer_name",
          label: "Customer",
          className: "hidden md:table-cell",
          render: (r) => (
            <Link
              href={`/admin/customers/${r.customer}`}
              className="text-brand-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {r.customer_name as string}
            </Link>
          ),
        },
        { key: "start_date", label: "Start", render: (r) => date(r.start_date as string | null), className: "hidden sm:table-cell" },
        { key: "price", label: "Price", render: (r) => money(r.price as string) },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status as string} /> },
      ]}
    />
  );
}
