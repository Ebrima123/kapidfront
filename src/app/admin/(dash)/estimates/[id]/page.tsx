import { Suspense } from "react";
import { Spinner } from "@/components/admin/ui";
import { EstimateEditor } from "./estimate-editor";

export default function EstimatePage({ params }: PageProps<"/admin/estimates/[id]">) {
  return (
    <Suspense fallback={<Spinner />}>
      <Resolve params={params} />
    </Suspense>
  );
}

async function Resolve({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EstimateEditor id={id} />;
}
