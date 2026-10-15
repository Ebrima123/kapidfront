import { Suspense } from "react";
import { Spinner } from "@/components/admin/ui";
import { LeadDetail } from "./lead-detail";

export default function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  return (
    <Suspense fallback={<Spinner />}>
      <Resolve params={params} />
    </Suspense>
  );
}

async function Resolve({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadDetail id={id} />;
}
