"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ResourceForm, toPayload, type FieldDef } from "@/components/admin/resource-form";
import { ErrorBox, PageHeader, Spinner } from "@/components/admin/ui";
import { api } from "@/lib/api-client";
import type { SiteSettings } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const GROUPS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Brand & homepage",
    fields: [
      { name: "company_name", label: "Company name", required: true },
      { name: "tagline", label: "Tagline" },
      { name: "hero_title", label: "Homepage headline", full: true },
      { name: "hero_subtitle", label: "Homepage intro", type: "textarea" },
      { name: "hero_image", label: "Homepage image", type: "image", full: true },
      { name: "years_experience", label: "Years of experience", type: "number" },
      { name: "projects_completed", label: "Projects completed", type: "number" },
    ],
  },
  {
    title: "About page",
    fields: [
      { name: "about_title", label: "Heading", full: true },
      { name: "about_body", label: "Body text", type: "textarea" },
      { name: "about_image", label: "Image", type: "image", full: true },
    ],
  },
  {
    title: "Contact details",
    fields: [
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" },
      { name: "address", label: "Address", full: true },
      { name: "service_area", label: "Service area", placeholder: "e.g. the city and surrounding areas" },
      { name: "opening_hours", label: "Opening hours", placeholder: "Mon–Sat, 8am–6pm" },
      { name: "facebook_url", label: "Facebook URL", type: "url" },
      { name: "instagram_url", label: "Instagram URL", type: "url" },
    ],
  },
];

export default function SiteSettingsPage() {
  const { data, error, setData } = useApi<SiteSettings>("cms/settings");
  const [saved, setSaved] = useState<string | null>(null);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <Spinner />;

  return (
    <>
      <PageHeader title="Site settings" description="Headlines, about text and contact details shown across the website." />
      <div className="space-y-6">
        {GROUPS.map((g) => (
          <section key={g.title} className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">{g.title}</h2>
              {saved === g.title && (
                <span className="flex items-center gap-1 text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" /> Saved
                </span>
              )}
            </div>
            <ResourceForm
              fields={g.fields}
              initial={data}
              onSubmit={async (values) => {
                setData(await api<SiteSettings>("cms/settings", { method: "PATCH", ...toPayload(g.fields, values) }));
                setSaved(g.title);
                setTimeout(() => setSaved(null), 2500);
              }}
            />
          </section>
        ))}
      </div>
    </>
  );
}
