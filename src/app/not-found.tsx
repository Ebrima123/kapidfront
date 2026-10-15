import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">This wall is still blank</h1>
        <p className="mt-3 text-muted">We couldn&apos;t find the page you were looking for.</p>
        <Link href="/" className="btn btn-primary mt-8">Back home</Link>
      </div>
    </main>
  );
}
