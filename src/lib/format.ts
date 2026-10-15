const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "GMD";

export function money(value: string | number | null | undefined): string {
  const n = typeof value === "string" ? parseFloat(value) : (value ?? 0);
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: CURRENCY }).format(
    Number.isFinite(n) ? n : 0,
  );
}

export function date(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function label(value: string): string {
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
