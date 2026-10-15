import { Suspense } from "react";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/site/quote-form";
import { PageHero } from "@/components/site/sections";
import { SocialLinks } from "@/components/site/social-links";
import { getServices, getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact & free quote",
  description: "Request a free, itemised painting quote from Kapid Painting Company in The Gambia.",
};

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const details = [
    { icon: Phone, value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, value: settings.address },
    { icon: Clock, value: settings.opening_hours },
  ].filter((d) => d.value);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get your free quote"
        intro="Tell us a little about the job and we'll get back to you with a free, itemised quote."
      />
      <section id="quote" className="container-x grid scroll-mt-24 gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_2fr]">
        <aside className="order-2 space-y-8 lg:order-1">
          <div>
            <h2 className="font-display text-xl font-semibold">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm text-ink/85">
              {["We review the details you send.", "We get back to you with a free, itemised quote.", "You choose a start date that suits you."].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          {details.length > 0 && (
            <ul className="space-y-4">
              {details.map(({ icon: Icon, value, href }) => (
                <li key={value} className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {href ? (
                    <a href={href} className="pt-2 font-medium hover:text-brand-600">{value}</a>
                  ) : (
                    <span className="pt-2 font-medium">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {settings.service_area && (
            <p className="text-sm text-muted">Proudly serving {settings.service_area}.</p>
          )}
          {(settings.facebook_url || settings.tiktok_url || settings.instagram_url) && (
            <div>
              <p className="label">See our latest work</p>
              <SocialLinks settings={settings} className="text-brand-700" />
            </div>
          )}
        </aside>
        <div className="card order-1 p-4 sm:p-8 lg:order-2">
          <Suspense>
            <QuoteForm services={services.map((s) => s.title)} phone={settings.phone} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
