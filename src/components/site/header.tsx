"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Menu, PaintRoller, X } from "lucide-react";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavLinks({ pathname }: { pathname: string }) {
  return NAV.map((item) => {
    const active = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          active ? "bg-sand text-ink" : "text-muted hover:text-ink"
        }`}
      >
        {item.label}
      </Link>
    );
  });
}

function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

export function Header({ companyName }: { companyName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-accent-500 text-white">
            <PaintRoller className="size-4" />
          </span>
          {companyName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {/* Active-link highlight needs the URL, which streams in after the static shell */}
          <Suspense fallback={<NavLinks pathname="" />}>
            <ActiveNavLinks />
          </Suspense>
          <Link href="/contact#quote" className="btn btn-primary ml-2">
            Free quote
          </Link>
        </nav>

        <button
          className="rounded-lg p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream md:hidden">
          <div className="container-x flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-medium hover:bg-sand"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact#quote" onClick={() => setOpen(false)} className="btn btn-primary mt-2">
              Free quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
