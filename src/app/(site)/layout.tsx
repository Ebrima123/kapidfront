import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { getSettings } from "@/lib/cms";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <Header companyName={settings.company_name} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
