"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Note } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { Empty, ErrorBox } from "./ui";

/** Activity log for a customer, lead or job. */
export function NotesPanel({ owner }: { owner: { customer?: number; lead?: number; job?: number } }) {
  const { data, error, reload } = useApi<Note[]>("crm/notes", owner);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    try {
      await api("crm/notes", { method: "POST", json: { ...owner, body } });
      setBody("");
      reload();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this note?")) return;
    await api(`crm/notes/${id}`, { method: "DELETE" });
    reload();
  }

  return (
    <section className="card">
      <h2 className="border-b border-line px-5 py-4 font-semibold">Notes & activity</h2>
      <form onSubmit={add} className="space-y-2 border-b border-line p-4">
        <textarea
          className="input"
          rows={3}
          placeholder="Log a call, site visit, colour choice…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex justify-end">
          <button className="btn btn-dark btn-sm" disabled={saving || !body.trim()}>
            {saving && <Loader2 className="size-3 animate-spin" />} Add note
          </button>
        </div>
      </form>
      {error && <div className="p-4"><ErrorBox message={error} /></div>}
      {data && data.length === 0 && <Empty>No notes yet.</Empty>}
      <ul className="divide-y divide-line">
        {data?.map((n) => (
          <li key={n.id} className="group px-5 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm whitespace-pre-line">{n.body}</p>
              <button
                onClick={() => remove(n.id)}
                className="rounded p-1 text-muted opacity-0 group-hover:opacity-100 hover:text-red-600"
                aria-label="Delete note"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">
              {n.author_name || "System"} · {new Date(n.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
