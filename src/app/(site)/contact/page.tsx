import { Suspense } from "react";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/site/quote-form";
import { SocialLinks } from "@/components/site/social-links";
import { WhatsAppIcon } from "@/components/site/whatsapp";
import { getServices, getSettings } from "@/lib/cms";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact & free quote",
  description: "Request a free, itemised painting quote from Kapid Painting Company in The Gambia.",
};

const NEXT_STEPS = [
  "We review the details you send.",
  "We get back to you with a free, itemised quote.",
  "You choose a start date that suits you.",
];

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const area = settings.service_area || "The Gambia";
  const details = [
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Address", value: settings.address },
    { icon: Clock, label: "Hours", value: settings.opening_hours },
  ].filter((d) => d.value);
  const whatsapp = whatsappHref(settings.whatsapp_number);
  const hasSocial = Boolean(settings.facebook_url || settings.tiktok_url || settings.instagram_url);

  return (
    <>
      <section className="bg-limewash-paper">
        <div className="container-x pt-12 pb-10 sm:pt-16 sm:pb-12">
          <p className="eyebrow">Free quote · {area}</p>
          <h1 className="heading-xl mt-6 max-w-3xl">Tell us about your project</h1>
          <p className="lede mt-5 max-w-2xl">
            Fill in the form and we&apos;ll get back to you with a free, itemised quote. Only your name and email are
            required.
          </p>
        </div>
        <div className="swatch-stripe" data-reveal="wipe" style={{ "--reveal-delay": "250ms" } as React.CSSProperties} aria-hidden />
      </section>

      <section
        id="quote"
        className="container-x grid scroll-mt-24 gap-12 py-10 sm:py-14 lg:grid-cols-[1.7fr_1fr] lg:gap-16"
      >
        <div className="card p-4 sm:p-8 lg:p-10">
          <Suspense>
            <QuoteForm services={services.map((s) => s.title)} phone={settings.phone} />
          </Suspense>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          {whatsapp && (
            <section aria-labelledby="whatsapp-heading" className="rounded-md border border-whatsapp-600/30 bg-paper p-6">
              <h2 id="whatsapp-heading" className="heading-md">
                Prefer WhatsApp?
              </h2>
              <p className="mt-2 leading-relaxed text-muted">
                Send us a message with a few details or photos of the job.
              </p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg mt-5 w-full bg-whatsapp-600 text-white hover:bg-whatsapp-700"
              >
                <WhatsAppIcon className="size-5" /> Chat on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </section>
          )}

          <section aria-labelledby="next-steps">
            <h2 id="next-steps" className="heading-md">
              What happens next
            </h2>
            <ol className="mt-5 border-t border-brand-900">
              {NEXT_STEPS.map((s, i) => (
                <li key={s} className="flex gap-4 border-b border-line py-4">
                  <span className="index-no" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink/85">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {details.length > 0 && (
            <section aria-labelledby="contact-details">
              <h2 id="contact-details" className="heading-md">
                Contact details
              </h2>
              <dl className="mt-5 space-y-4">
                {details.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="mt-1 size-4 shrink-0 text-accent-600" aria-hidden />
                    <div>
                      <dt className="sr-only">{label}</dt>
                      <dd className="font-medium text-brand-900">
                        {href ? (
                          <a href={href} className="hover:text-accent-700">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section aria-labelledby="where-we-work" className="rounded-md bg-sand p-6">
            <h2 id="where-we-work" className="font-sans text-xs font-semibold tracking-[0.16em] text-brand-600 uppercase">
              Where we work
            </h2>
            <p className="mt-2 font-display text-xl text-brand-900">Homes, businesses and new builds across {area}.</p>
            {hasSocial && (
              <>
                <p className="mt-5 text-sm text-muted">See our latest work:</p>
                <SocialLinks settings={settings} className="mt-2 text-brand-900" />
              </>
            )}
          </section>
        </aside>
      </section>
    </>
  );
}
