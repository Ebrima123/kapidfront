import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { REVEAL_BOOT_SCRIPT } from "@/lib/reveal";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Editorial serif for headlines; Inter carries body copy and interface text.
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], axes: ["opsz"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: "Kapid Painting Company", locale: "en_GB", type: "website" },
  title: { default: "Kapid Painting Company", template: "%s | Kapid Painting Company" },
  description:
    "Kapid Painting Company: interior, exterior and new-build painting and decorating in The Gambia. Excellence isn't built in one coat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The public site's reveal script adds a class to <html> before hydration.
    <html lang="en" className={`${inter.variable} ${newsreader.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Hides scroll-reveal content before first paint; undone after 3s if the public site's observer never starts.
            A plain inline script on purpose: next/script's beforeInteractive waits for the Next.js runtime, which
            is after first paint, so content would show and then vanish. */}
        <script id="reveal-boot" dangerouslySetInnerHTML={{ __html: REVEAL_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
