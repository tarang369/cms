import { buildSeoMetadata, getSiteName } from "@/lib/metadata";
import { createWhatsAppHref, normalizePhone } from "@/lib/whatsapp";
import { client } from "@/sanity/lib/client";
import { getSiteSettingsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata() {
  const siteSettings = await client.fetch(getSiteSettingsQuery);

  return buildSeoMetadata({
    siteSettings,
    seo: siteSettings?.defaultSeo,
    title: "Contact | Neptune Plywood Private Limited",
    description:
      "Get in touch with Neptune Plywood Private Limited for catalog enquiries on WhatsApp.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const siteSettings = await client.fetch(getSiteSettingsQuery);
  const companyName = getSiteName(siteSettings);

  const phone = siteSettings?.organization?.phone || "+91 00000 00000";
  const whatsappPhone = siteSettings?.organization?.whatsappNumber || phone;
  const address =
    siteSettings?.organization?.address ||
    "Address details will be updated soon.";
  const email = "sales@neptuneplywood.com";

  const whatsappHref = createWhatsAppHref({
    phone: whatsappPhone,
    message: `Hi, I would like to enquire about ${companyName} catalogs.`,
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Contact
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Connect with Neptune Plywood Private Limited
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
          Share your requirement and we will guide you to the right catalog and
          product options.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Contact details
          </h2>
          <div className="space-y-3 text-sm text-zinc-700">
            <p>
              <span className="font-semibold text-zinc-900">Phone:</span> {phone}
            </p>
            <p>
              <span className="font-semibold text-zinc-900">WhatsApp:</span>{" "}
              {normalizePhone(whatsappPhone) || "Not set"}
            </p>
            <p>
              <span className="font-semibold text-zinc-900">Email:</span> {email}
            </p>
            <p>
              <span className="font-semibold text-zinc-900">Address:</span>{" "}
              {address}
            </p>
          </div>

          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Enquire on WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex rounded-xl bg-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-600"
            >
              WhatsApp unavailable
            </button>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Send a quick message
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            This is a front-end form UI. Submissions are not connected to a
            backend yet.
          </p>

          <form className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Your phone number"
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us what you are looking for."
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <button
              type="button"
              className="inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Send enquiry (UI only)
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

