"use client";

import { LEAD_FIELDS, LEAD_STATUSES } from "@/components/admin/crm-fields";
import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";
import { date } from "@/lib/format";

export default function LeadsPage() {
  return (
    <ResourceManager
      title="Leads"
      singular="Lead"
      description="Quote requests from the website and enquiries you log yourself."
      endpoint="crm/leads"
      fields={LEAD_FIELDS}
      defaults={{ status: "new", source: "phone", property_type: "residential" }}
      filter={{ param: "status", options: LEAD_STATUSES }}
      rowHref={(r) => `/admin/leads/${r.id}`}
      columns={[
        {
          key: "name",
          label: "Name",
          render: (r) => (
            <>
              <p className="font-medium">{r.name as string}</p>
              <p className="text-xs text-muted">{r.email as string}</p>
            </>
          ),
        },
        { key: "service", label: "Service", className: "hidden md:table-cell" },
        { key: "created_at", label: "Received", render: (r) => date(r.created_at as string), className: "hidden sm:table-cell" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status as string} /> },
      ]}
    />
  );
}
