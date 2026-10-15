import { MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { whatsappHref } from "@/lib/whatsapp";
import { SocialLinks } from "./social-links";
import { WhatsAppIcon } from "./whatsapp";

/** Thin utility strip above the main header on larger screens. */
export function TopBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="hidden bg-brand-950 text-[13px] text-white/75 md:block">
      <div className="container-x flex h-10 items-center justify-between gap-6">
        <p className="flex items-center gap-2">
          <MapPin className="size-3.5 text-accent-400" aria-hidden />
          Painting &amp; decorating across {settings.service_area || "The Gambia"}
        </p>
        <div className="flex items-center gap-5">
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="hover:text-white">
              {settings.email}
            </a>
          )}
          {whatsappHref(settings.whatsapp_number) && (
            <a
              href={whatsappHref(settings.whatsapp_number)!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <WhatsAppIcon className="size-3.5" /> WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="hover:text-white">
              {settings.phone}
            </a>
          )}
          <SocialLinks settings={settings} size="sm" />
        </div>
      </div>
    </div>
  );
}
