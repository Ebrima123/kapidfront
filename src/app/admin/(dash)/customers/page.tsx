"use client";

import { CUSTOMER_FIELDS, SOURCES } from "@/components/admin/crm-fields";
import { ResourceManager } from "@/components/admin/resource-manager";
import { date } from "@/lib/format";

export default function CustomersPage() {
  return (
    <ResourceManager
      title="Customers"
      singular="Customer"
      endpoint="crm/customers"
      fields={CUSTOMER_FIELDS}
      defaults={{ source: "referral" }}
      filter={{ param: "source", options: SOURCES }}
      rowHref={(r) => `/admin/customers/${r.id}`}
      columns={[
        {
          key: "full_name",
          label: "Name",
          render: (r) => (
            <>
              <p className="font-medium">{r.full_name as string}</p>
              {Boolean(r.company) && <p className="text-xs text-muted">{r.company as string}</p>}
            </>
          ),
        },
        {
          key: "contact",
          label: "Contact",
          className: "hidden md:table-cell",
          render: (r) => (
            <>
              <p>{r.email as string}</p>
              <p className="text-xs text-muted">{r.phone as string}</p>
            </>
          ),
        },
        { key: "job_count", label: "Jobs" },
        { key: "created_at", label: "Since", render: (r) => date(r.created_at as string), className: "hidden sm:table-cell" },
      ]}
    />
  );
}
