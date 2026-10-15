"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PaintRoller, Phone } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Our work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavLinks({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  return NAV.map((item) => {
    const active = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={
          mobile
            ? `relative shrink-0 py-3 text-[15px] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 ${
                active ? "text-white after:bg-accent-500" : "text-white/75 after:bg-transparent hover:text-white"
              }`
            : `relative px-3 py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-[23px] after:h-0.5 after:transition-colors ${
                active
                  ? "text-brand-900 after:bg-accent-600"
                  : "text-ink/75 after:bg-transparent hover:text-brand-900 hover:after:bg-line"
              }`
        }
      >
        {item.label}
      </Link>
    );
  });
}

function ActiveNavLinks(props: { mobile?: boolean }) {
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
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[72px]">
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
      </div>

      {/* Phones: the links sit in their own row under the logo instead of a collapsible menu */}
      <nav aria-label="Main" className="bg-brand-900 md:hidden">
        <div className="container-x flex justify-between gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Suspense fallback={<NavLinks pathname="" mobile />}>
            <ActiveNavLinks mobile />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}

/** Always-visible contact actions on small screens: call, WhatsApp and the quote form. */
export function MobileQuoteBar({ phone, whatsappHref }: { phone?: string; whatsappHref?: string | null }) {
  // Not shown on the contact page, which is the quote form itself.
  const onContactPage = usePathname().startsWith("/contact");
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

  if (onContactPage) return null;

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
