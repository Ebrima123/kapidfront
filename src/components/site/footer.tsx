import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { SocialLinks } from "./social-links";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto bg-brand-900 text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-white">{settings.company_name}</p>
          <p className="mt-2 text-sm italic">“{settings.tagline}”</p>
          {settings.service_area && <p className="mt-4 text-sm">Serving {settings.service_area}</p>}
          <SocialLinks settings={settings} className="mt-5" />
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Get in touch</p>
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-white">
              <Phone className="size-4" /> {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail className="size-4" /> {settings.email}
            </a>
          )}
          {settings.address && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4" /> {settings.address}
            </p>
          )}
          {settings.opening_hours && <p>{settings.opening_hours}</p>}
          <Link href="/contact#quote" className="btn btn-primary btn-sm mt-3">
            Get a free quote
          </Link>
        </div>
        <nav aria-label="Footer" className="space-y-2 text-sm">
          <p className="font-semibold text-white">Explore</p>
          <Link href="/services" className="block py-1 hover:text-white">Services</Link>
          <Link href="/projects" className="block py-1 hover:text-white">Our work</Link>
          <Link href="/about" className="block py-1 hover:text-white">About</Link>
          <Link href="/contact" className="block py-1 hover:text-white">Contact</Link>
        </nav>
      </div>
      <div className="border-t border-white/10 pt-5 pb-24 text-center text-xs text-white/60 md:pb-5">
        © {settings.company_name}. All rights reserved.
      </div>
    </footer>
  );
}
