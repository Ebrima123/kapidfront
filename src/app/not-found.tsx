import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div className="max-w-xl">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="heading-xl mt-6">This wall is still blank</h1>
        <p className="lede mt-5">We couldn&apos;t find the page you were looking for.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary btn-lg">
            Back to the homepage
          </Link>
          <Link href="/contact#quote" className="btn btn-outline btn-lg">
            Get a free quote
          </Link>
        </div>
      </div>
    </main>
  );
}
