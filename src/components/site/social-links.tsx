import type { SiteSettings } from "@/lib/types";

// lucide-react ships no brand logos, so these are minimal inline marks.
export const SOCIAL_ICONS = {
  facebook: (
    <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v1.9H8v3.2h2.6V21H14v-9.3h2.6l.4-3.2H14Z" />
  ),
  instagram: (
    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1c.1-2.7 1.4-4 4.1-4.1 1.1-.1 1.4-.1 4.2-.1Z" />
  ),
  tiktok: (
    <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" />
  ),
};

const NETWORKS = [
  { key: "facebook_url", label: "Facebook", icon: SOCIAL_ICONS.facebook },
  { key: "tiktok_url", label: "TikTok", icon: SOCIAL_ICONS.tiktok },
  { key: "instagram_url", label: "Instagram", icon: SOCIAL_ICONS.instagram },
] as const;

export function SocialLinks({ settings, className = "" }: { settings: SiteSettings; className?: string }) {
  const links = NETWORKS.filter((n) => settings[n.key]);
  if (links.length === 0) return null;
  return (
    <ul className={`flex gap-2 ${className}`}>
      {links.map((n) => (
        <li key={n.key}>
          <a
            href={settings[n.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${settings.company_name} on ${n.label}`}
            className="grid size-10 place-items-center rounded-full border border-current/20 transition-colors hover:bg-accent-500 hover:text-white hover:border-accent-500"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              {n.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
