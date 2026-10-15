"use client";

import Link from "next/link";
import { ErrorBox, PageHeader, Spinner, StatCard, StatusBadge, Empty } from "@/components/admin/ui";
import { date, label, money } from "@/lib/format";
import type { Dashboard, LeadStatus } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const PIPELINE: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

export default function DashboardPage() {
  const { data, error, loading } = useApi<Dashboard>("crm/dashboard");

  if (error) return <ErrorBox message={error} />;
  if (loading || !data) return <Spinner />;

  const totalLeads = PIPELINE.reduce((n, s) => n + data.leads_by_status[s], 0);

  return (
    <>
      <PageHeader title="Dashboard" description="How the business is doing at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New leads this month" value={data.new_leads_this_month} />
        <StatCard label="Revenue this month" value={money(data.revenue_this_month)} hint="Completed jobs" />
        <StatCard label="Open job value" value={money(data.open_job_value)} hint="Scheduled & in progress" />
        <StatCard label="Win rate" value={data.win_rate == null ? "—" : `${data.win_rate}%`} hint={`${data.customers} customers`} />
      </div>

      <div className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Lead pipeline</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand-600 hover:underline">All leads →</Link>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {PIPELINE.map((s) => {
            const n = data.leads_by_status[s];
            return (
              <div key={s}>
                <div className="h-2 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${totalLeads ? Math.max(4, (n / totalLeads) * 100) : 0}%` }}
                  />
                </div>
                <p className="mt-2 text-xl font-semibold">{n}</p>
                <p className="text-xs text-muted">{label(s)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="border-b border-line px-5 py-4 font-semibold">Recent leads</h2>
          {data.recent_leads.length === 0 ? (
            <Empty>No leads yet. Quote requests from the website will appear here.</Empty>
          ) : (
            <ul className="divide-y divide-line">
              {data.recent_leads.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads/${l.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-cream">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{l.name}</p>
                      <p className="truncate text-xs text-muted">{l.service || "General enquiry"} · {date(l.created_at)}</p>
                    </div>
                    <StatusBadge status={l.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="border-b border-line px-5 py-4 font-semibold">Upcoming jobs (next 14 days)</h2>
          {data.upcoming_jobs.length === 0 ? (
            <Empty>Nothing scheduled in the next two weeks.</Empty>
          ) : (
            <ul className="divide-y divide-line">
              {data.upcoming_jobs.map((j) => (
                <li key={j.id}>
                  <Link href={`/admin/customers/${j.customer}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-cream">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{j.title}</p>
                      <p className="truncate text-xs text-muted">
                        {j.customer_name} · starts {date(j.start_date)}
                        {j.assigned_to && ` · ${j.assigned_to}`}
                      </p>
                    </div>
                    <StatusBadge status={j.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
