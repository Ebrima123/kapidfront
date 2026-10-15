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
          <p className="mt-2 text-sm">{settings.tagline}</p>
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
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Explore</p>
          <Link href="/services" className="block hover:text-white">Services</Link>
          <Link href="/projects" className="block hover:text-white">Projects</Link>
          <Link href="/about" className="block hover:text-white">About</Link>
          <Link href="/contact" className="block hover:text-white">Request a quote</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {settings.company_name}. All rights reserved.
      </div>
    </footer>
  );
}
