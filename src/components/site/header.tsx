"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { Menu, PaintRoller, Phone, X } from "lucide-react";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Our work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavLinks({ pathname, onNavigate, mobile = false }: { pathname: string; onNavigate?: () => void; mobile?: boolean }) {
  return NAV.map((item) => {
    const active = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={
          mobile
            ? `rounded-lg px-3 py-3 font-medium ${active ? "bg-sand" : "hover:bg-sand"}`
            : `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "bg-sand text-ink" : "text-muted hover:text-ink"
              }`
        }
      >
        {item.label}
      </Link>
    );
  });
}

function ActiveNavLinks(props: { onNavigate?: () => void; mobile?: boolean }) {
  return <NavLinks pathname={usePathname()} {...props} />;
}

/** "Kapid Painting Company" → bold first word with the rest as a small line. */
function Logotype({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-xl font-semibold">{first}</span>
      {rest.length > 0 && (
        <span className="mt-0.5 text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">{rest.join(" ")}</span>
      )}
    </span>
  );
}

export function Header({ companyName, phone }: { companyName: string; phone?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          close();
          menuButton.current?.focus();
        }
      }}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${companyName}, home`}>
          <span className="grid size-9 place-items-center rounded-xl bg-accent-600 text-white">
            <PaintRoller className="size-4" aria-hidden />
          </span>
          <Logotype name={companyName} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {/* Active-link highlight needs the URL, which streams in after the static shell */}
          <Suspense fallback={<NavLinks pathname="" />}>
            <ActiveNavLinks />
          </Suspense>
          {phone && (
            <a href={`tel:${phone}`} className="ml-2 hidden items-center gap-1.5 text-sm font-semibold text-brand-700 lg:flex">
              <Phone className="size-4" aria-hidden /> {phone}
            </a>
          )}
          <Link href="/contact#quote" className="btn btn-primary ml-3">
            Get a free quote
          </Link>
        </nav>

        <button
          ref={menuButton}
          className="grid size-11 place-items-center rounded-lg md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-line bg-cream md:hidden">
          <div className="container-x flex flex-col py-3">
            <Suspense fallback={<NavLinks pathname="" onNavigate={close} mobile />}>
              <ActiveNavLinks onNavigate={close} mobile />
            </Suspense>
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-2 rounded-lg px-3 py-3 font-medium hover:bg-sand">
                <Phone className="size-4" aria-hidden /> Call {phone}
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

/** Always-visible quote action on small screens. */
export function MobileQuoteBar({ phone }: { phone?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 p-3 backdrop-blur md:hidden">
      <div className="flex gap-2">
        {phone && (
          <a href={`tel:${phone}`} className="btn btn-outline flex-1">
            <Phone className="size-4" aria-hidden /> Call
          </a>
        )}
        <Link href="/contact#quote" className="btn btn-primary flex-[2]">
          Get a free quote
        </Link>
      </div>
    </div>
  );
}
