"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { label } from "@/lib/format";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-brand-50 text-brand-600",
  contacted: "bg-amber-50 text-amber-700",
  quoted: "bg-violet-50 text-violet-700",
  won: "bg-emerald-50 text-emerald-700",
  lost: "bg-zinc-100 text-zinc-600",
  scheduled: "bg-brand-50 text-brand-600",
  in_progress: "bg-amber-50 text-amber-700",
  on_hold: "bg-zinc-100 text-zinc-600",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  draft: "bg-zinc-100 text-zinc-600",
  sent: "bg-brand-50 text-brand-600",
  accepted: "bg-emerald-50 text-emerald-700",
  declined: "bg-red-50 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${
        STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-600"
      }`}
    >
      {label(status)}
    </span>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-12 text-muted ${className}`}>
      <Loader2 className="size-6 animate-spin" aria-label="Loading" />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      {message}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-12 text-center text-sm text-muted">{children}</div>;
}

export function Modal({
  title,
  open,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={`m-auto w-[calc(100%-2rem)] ${wide ? "max-w-3xl" : "max-w-xl"} rounded-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/40`}
    >
      {open && (
        <>
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-sand" aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
        </>
      )}
    </dialog>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
