import { Suspense } from "react";
import { Spinner } from "@/components/admin/ui";
import { CustomerDetail } from "./customer-detail";

export default function CustomerPage({ params }: PageProps<"/admin/customers/[id]">) {
  return (
    <Suspense fallback={<Spinner />}>
      <Resolve params={params} />
    </Suspense>
  );
}

async function Resolve({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerDetail id={id} />;
}
