import { Footer } from "@/components/site/footer";
import { Header, MobileQuoteBar } from "@/components/site/header";
import { TopBar } from "@/components/site/top-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { getSettings } from "@/lib/cms";
import { whatsappHref } from "@/lib/whatsapp";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  const whatsapp = whatsappHref(settings.whatsapp_number);
  return (
    <>
      <RevealObserver />
      <a
        href="#main"
        className="sr-only z-50 rounded-[5px] bg-paper px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <TopBar settings={settings} />
      <Header companyName={settings.company_name} phone={settings.phone} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <MobileQuoteBar phone={settings.phone} whatsappHref={whatsapp} />
      <WhatsAppFloat href={whatsapp} companyName={settings.company_name} />
    </>
  );
}
