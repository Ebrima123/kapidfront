"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useApi } from "@/lib/use-api";
import { ResourceForm, toPayload, type FieldDef, type Values } from "./resource-form";
import { Empty, ErrorBox, Modal, PageHeader, Spinner } from "./ui";

type Row = Record<string, unknown> & { id: number };

export type Column = { key: string; label: string; render?: (row: Row) => React.ReactNode; className?: string };

type Props = {
  title: string;
  description?: string;
  singular: string;
  endpoint: string;
  columns: Column[];
  fields: FieldDef[];
  defaults?: Values;
  /** Server-side filter tabs, e.g. lead status. */
  filter?: { param: string; options: { value: string; label: string }[] };
  /** Navigate to a detail page on row click instead of opening the edit modal. */
  rowHref?: (row: Row) => string;
  /** Extra editor content for an existing row (e.g. a project's gallery). */
  renderExtra?: (row: Row) => React.ReactNode;
  paginated?: boolean;
};

export function ResourceManager({
  title,
  description,
  singular,
  endpoint,
  columns,
  fields,
  defaults = {},
  filter,
  rowHref,
  renderExtra,
  paginated = true,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);

  const { data, error, loading, reload } = useApi<{ count: number; results: Row[] } | Row[]>(endpoint, {
    search: query,
    page: paginated ? page : undefined,
    ...(filter ? { [filter.param]: filterValue } : {}),
  });
  const rows = Array.isArray(data) ? data : (data?.results ?? []);
  const count = Array.isArray(data) ? data.length : (data?.count ?? 0);
  const pages = Math.max(1, Math.ceil(count / 25));

  async function save(values: Values) {
    const payload = toPayload(fields, values);
    if (editing === "new") {
      const created = await api<Row>(endpoint, { method: "POST", ...payload });
      setEditing(renderExtra ? created : null);
    } else if (editing) {
      await api(`${endpoint}/${editing.id}`, { method: "PATCH", ...payload });
      setEditing(null);
    }
    reload();
  }

  async function remove(row: Row) {
    if (!confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return;
    await api(`${endpoint}/${row.id}`, { method: "DELETE" });
    reload();
  }

  const initial: Values =
    editing === "new"
      ? Object.fromEntries(fields.map((f) => [f.name, defaults[f.name] ?? (f.type === "checkbox" ? false : "")]))
      : editing
        ? { ...editing }
        : {};

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <button className="btn btn-dark" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> New {singular.toLowerCase()}
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
          <form
            className="relative min-w-48 flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(search);
            }}
          >
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              className="input pl-9"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => search !== query && (setPage(1), setQuery(search))}
            />
          </form>
          {filter && (
            <div className="flex flex-wrap gap-1">
              {[{ value: "", label: "All" }, ...filter.options].map((o) => (
                <button
                  key={o.value}
                  className={`btn btn-sm ${filterValue === o.value ? "btn-dark" : "btn-ghost"}`}
                  onClick={() => {
                    setPage(1);
                    setFilterValue(o.value);
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {error ? (
          <div className="p-4"><ErrorBox message={error} /></div>
        ) : loading && !data ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <Empty>No {title.toLowerCase()} found.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/50 text-xs tracking-wide text-muted uppercase">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className={`px-4 py-3 font-semibold ${c.className ?? ""}`}>{c.label}</th>
                  ))}
                  <th className="w-24 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer hover:bg-cream"
                    onClick={() => (rowHref ? router.push(rowHref(row)) : setEditing(row))}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                        {c.render ? c.render(row) : String(row[c.key] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-1.5 hover:bg-sand" aria-label="Edit" onClick={() => setEditing(row)}>
                          <Pencil className="size-4" />
                        </button>
                        <button
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                          onClick={() => remove(row)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {paginated && pages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-muted">
            <span>{count} total</span>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="size-4" />
              </button>
              Page {page} of {pages}
              <button className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        title={editing === "new" ? `New ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}
        open={editing !== null}
        onClose={() => setEditing(null)}
        wide={fields.length > 6}
      >
        <ResourceForm
          key={editing === "new" ? "new" : (editing?.id ?? "none")}
          fields={fields}
          initial={initial}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
        {editing && editing !== "new" && renderExtra && (
          <div className="mt-6 border-t border-line pt-6">{renderExtra(editing)}</div>
        )}
      </Modal>
    </>
  );
}
