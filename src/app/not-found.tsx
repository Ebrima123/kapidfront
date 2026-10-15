import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">This wall is still blank</h1>
        <p className="mt-3 text-muted">We couldn&apos;t find the page you were looking for.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/contact#quote" className="btn btn-outline">
            Get a free quote
          </Link>
        </div>
      </div>
    </main>
  );
}
