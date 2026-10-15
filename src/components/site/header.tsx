"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, PaintRoller, Phone, X } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp";

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
            ? `flex items-center justify-between border-b border-line py-4 font-display text-2xl ${active ? "text-accent-700" : "text-brand-900"}`
            : `relative px-3 py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-[23px] after:h-0.5 after:transition-colors ${
                active
                  ? "text-brand-900 after:bg-accent-600"
                  : "text-ink/75 after:bg-transparent hover:text-brand-900 hover:after:bg-line"
              }`
        }
      >
        {item.label}
        {mobile && <ArrowRight className="size-5 text-muted" aria-hidden />}
      </Link>
    );
  });
}

function ActiveNavLinks(props: { onNavigate?: () => void; mobile?: boolean }) {
  return <NavLinks pathname={usePathname()} {...props} />;
}

/** Wordmark: "KAPID" in spaced serif caps, the rest of the name as a small line beneath. */
export function Logo({ name, inverted = false }: { name: string; inverted?: boolean }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span className="flex items-center gap-3">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-[5px] ${inverted ? "bg-accent-600 text-white" : "bg-brand-900 text-white"}`}
      >
        <PaintRoller className="size-[18px]" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[22px] font-semibold tracking-[0.14em] uppercase ${inverted ? "text-white" : "text-brand-900"}`}
        >
          {first}
        </span>
        {rest.length > 0 && (
          <span className={`mt-1 text-[10px] font-semibold tracking-[0.24em] uppercase ${inverted ? "text-white/60" : "text-muted"}`}>
            {rest.join(" ")}
          </span>
        )}
      </span>
    </span>
  );
}

export function Header({ companyName, phone }: { companyName: string; phone?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-paper"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          close();
          menuButton.current?.focus();
        }
      }}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${companyName}, home`} className="rounded-[5px]">
          <Logo name={companyName} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {/* Active-link highlight needs the URL, which streams in after the static shell */}
          <Suspense fallback={<NavLinks pathname="" />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {phone && (
            <a href={`tel:${phone}`} className="hidden items-center gap-2 text-sm font-semibold text-brand-900 lg:flex">
              <Phone className="size-4 text-accent-600" aria-hidden /> {phone}
            </a>
          )}
          <Link href="/contact#quote" className="btn btn-primary">
            Get a free quote
          </Link>
        </div>

        <button
          ref={menuButton}
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-[5px] text-brand-900 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-line bg-paper md:hidden">
          <div className="container-x flex flex-col pb-6">
            <Suspense fallback={<NavLinks pathname="" onNavigate={close} mobile />}>
              <ActiveNavLinks onNavigate={close} mobile />
            </Suspense>
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-2 py-4 font-semibold text-brand-900">
                <Phone className="size-4 text-accent-600" aria-hidden /> Call {phone}
              </a>
            )}
            <Link href="/contact#quote" onClick={close} className="btn btn-primary btn-lg mt-5">
              Get a free quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

/** Always-visible contact actions on small screens: call, WhatsApp and the quote form. */
export function MobileQuoteBar({ phone, whatsappHref }: { phone?: string; whatsappHref?: string | null }) {
  // Hide once the footer's "Get in touch" section is on screen: it offers the same actions.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => {
      const target = document.getElementById("footer-contact");
      setHidden(Boolean(target && target.getBoundingClientRect().top < window.innerHeight));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      inert={hidden}
      aria-hidden={hidden || undefined}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex gap-2">
        {phone &&
          (whatsappHref ? (
            // With WhatsApp also shown, the call button collapses to an icon to keep three actions on one row.
            <a href={`tel:${phone}`} className="btn btn-outline size-11 shrink-0 p-0" aria-label={`Call ${phone}`}>
              <Phone className="size-4" aria-hidden />
            </a>
          ) : (
            <a href={`tel:${phone}`} className="btn btn-outline flex-1">
              <Phone className="size-4" aria-hidden /> Call
            </a>
          ))}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn flex-1 bg-whatsapp-600 px-3 whitespace-nowrap text-white hover:bg-whatsapp-700"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <Link href="/contact#quote" className={`btn btn-primary px-3 whitespace-nowrap ${whatsappHref ? "flex-1" : "flex-[2]"}`}>
          {/* Shorter label when three actions share the bar on narrow phones */}
          {whatsappHref ? "Free quote" : "Get a free quote"}
        </Link>
      </div>
    </div>
  );
}
