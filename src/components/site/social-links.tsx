import type { SiteSettings } from "@/lib/types";

// lucide-react ships no brand logos, so these are minimal inline marks.
export const SOCIAL_ICONS = {
  facebook: (
    <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v1.9H8v3.2h2.6V21H14v-9.3h2.6l.4-3.2H14Z" />
  ),
  instagram: (
    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1c.1-2.7 1.4-4 4.1-4.1 1.1-.1 1.4-.1 4.2-.1Z" />
  ),
  whatsapp: (
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.2Z" />
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

export function SocialLinks({
  settings,
  className = "",
  size = "md",
}: {
  settings: SiteSettings;
  className?: string;
  size?: "sm" | "md";
}) {
  const links = NETWORKS.filter((n) => settings[n.key]);
  if (links.length === 0) return null;
  return (
    <ul className={`flex ${size === "sm" ? "gap-1" : "gap-2"} ${className}`}>
      {links.map((n) => (
        <li key={n.key}>
          <a
            href={settings[n.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${settings.company_name} on ${n.label} (opens in a new tab)`}
            className={
              size === "sm"
                ? "grid size-8 place-items-center rounded transition-colors hover:text-white"
                : "grid size-10 place-items-center rounded-[5px] border border-current/25 transition-colors hover:border-accent-600 hover:bg-accent-600 hover:text-white"
            }
          >
            <svg viewBox="0 0 24 24" className={size === "sm" ? "size-3.5" : "size-4"} fill="currentColor" aria-hidden>
              {n.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
