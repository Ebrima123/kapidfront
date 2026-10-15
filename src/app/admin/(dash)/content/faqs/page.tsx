"use client";

import { ResourceManager } from "@/components/admin/resource-manager";

export default function FaqsAdminPage() {
  return (
    <ResourceManager
      title="FAQs"
      singular="FAQ"
      description="Questions and answers shown on the homepage."
      endpoint="cms/faqs"
      defaults={{ is_published: true, order: 0 }}
      fields={[
        { name: "question", label: "Question", required: true, full: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "order", label: "Order", type: "number" },
        { name: "is_published", label: "Visibility", type: "checkbox", help: "Published on the website" },
      ]}
      columns={[
        { key: "question", label: "Question", render: (r) => <span className="font-medium">{r.question as string}</span> },
        { key: "order", label: "Order", className: "hidden sm:table-cell" },
        { key: "is_published", label: "Status", render: (r) => (r.is_published ? "Published" : "Hidden") },
      ]}
    />
  );
}
