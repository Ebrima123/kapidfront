import { Footer } from "@/components/site/footer";
import { Header, MobileQuoteBar } from "@/components/site/header";
import { getSettings } from "@/lib/cms";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header companyName={settings.company_name} phone={settings.phone} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <MobileQuoteBar phone={settings.phone} />
    </>
  );
}
