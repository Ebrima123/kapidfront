import { SOCIAL_ICONS } from "./social-links";

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      {SOCIAL_ICONS.whatsapp}
    </svg>
  );
}

/**
 * Floating chat button for tablets and desktops. On phones the same action lives in
 * the sticky bottom bar instead, so the two never overlap.
 */
export function WhatsAppFloat({ href, companyName }: { href: string | null; companyName: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${companyName} on WhatsApp (opens in a new tab)`}
      className="group fixed right-6 bottom-6 z-40 hidden items-center gap-2.5 rounded-full bg-whatsapp-600 py-3 pr-5 pl-3.5 font-semibold text-white shadow-lg shadow-brand-950/25 transition-colors hover:bg-whatsapp-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:flex"
    >
      <WhatsAppIcon className="size-6" />
      <span className="text-sm">Chat on WhatsApp</span>
    </a>
  );
}
