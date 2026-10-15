import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import Image from "next/image";
import { whatsappHref } from "@/lib/whatsapp";
import { SocialLinks } from "./social-links";
import { WhatsAppIcon } from "./whatsapp";

const LINKS = [
  ["/services", "Services"],
  ["/projects", "Our work"],
  ["/about", "About us"],
  ["/contact", "Request a quote"],
] as const;

export function Footer({ settings }: { settings: SiteSettings }) {
  const area = settings.service_area || "The Gambia";
  const contact = [
    settings.phone && { icon: Phone, text: settings.phone, href: `tel:${settings.phone}` },
    settings.email && { icon: Mail, text: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: MapPin, text: settings.address },
  ].filter(Boolean) as { icon: typeof Phone; text: string; href?: string }[];

  return (
    <footer className="bg-moulding mt-auto bg-brand-950 text-[15px] text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          {/* The full logo, in white for the navy footer */}
          <Image
            src="/brand/kapid-logo-white.png"
            alt="Kapid – Addijaton’s Artisan Paint & Interior Designs"
            width={827}
            height={600}
            className="h-32 w-auto"
          />
          <p className="mt-6 max-w-sm leading-relaxed">
            Interior and exterior painting and decorative finishes for homes, businesses and new builds across {area}.
          </p>
          {settings.tagline && (
            <p className="mt-5 font-display text-xl text-white italic">“{settings.tagline.replace(/[.!]+$/, "")}.”</p>
          )}
          <SocialLinks settings={settings} className="mt-6 text-white/80" />
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-white uppercase">Explore</h2>
          <ul className="mt-5 space-y-1">
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-1.5 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* The phone bottom bar hides once this section is on screen (see MobileQuoteBar). */}
        <div id="footer-contact" className="md:col-span-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-white uppercase">Get in touch</h2>
          {contact.length > 0 && (
            <ul className="mt-5 space-y-3">
              {contact.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-1 size-4 shrink-0 text-accent-400" aria-hidden />
                  {href ? (
                    <a href={href} className="hover:text-white">
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
              {settings.opening_hours && <li className="pl-7">{settings.opening_hours}</li>}
            </ul>
          )}
          <p className="mt-5 leading-relaxed">Tell us about your project and we&apos;ll send you a free, itemised quote.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact#quote" className="btn btn-primary">
              Get a free quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            {whatsappHref(settings.whatsapp_number) && (
              <a
                href={whatsappHref(settings.whatsapp_number)!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-whatsapp-600 text-white hover:bg-whatsapp-700"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp us<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-white/60 sm:flex-row sm:justify-between">
          <p>© {settings.company_name}. All rights reserved.</p>
          <p>Painting &amp; decorating · {area}</p>
        </div>
      </div>
    </footer>
  );
}
