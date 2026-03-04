import Image from "next/image";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import EntryCard from "@/components/EntryCard";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { buildSeoMetadata, getSiteName } from "@/lib/metadata";
import { createWhatsAppHref, normalizePhone } from "@/lib/whatsapp";
import { client } from "@/sanity/lib/client";
import {
  getBrandsQuery,
  getCategoriesQuery,
  getFeaturedEntriesQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

async function getHomeData() {
  const [categories = [], featuredEntries = [], siteSettings, brands = []] =
    await Promise.all([
      client.fetch(getCategoriesQuery),
      client.fetch(getFeaturedEntriesQuery),
      client.fetch(getSiteSettingsQuery),
      client.fetch(getBrandsQuery),
    ]);

  return {
    categories,
    featuredEntries,
    siteSettings,
    brands,
  };
}

export async function generateMetadata() {
  const siteSettings = await client.fetch(getSiteSettingsQuery);
  const siteName = getSiteName(siteSettings);

  return buildSeoMetadata({
    siteSettings,
    seo: siteSettings?.defaultSeo,
    title: `${siteName} | Premium Catalog`,
    description:
      "Browse premium plywood, laminates, hardware and furniture catalogs and enquire instantly on WhatsApp.",
    path: "/",
  });
}

export default async function HomePage() {
  const { categories, featuredEntries, siteSettings, brands } =
    await getHomeData();

  const companyName = getSiteName(siteSettings);
  const topCategories = categories.slice(0, 4);
  const heroCategory = categories.find((category) => category?.thumbnail?.url);
  const whatsappPhone = siteSettings?.organization?.whatsappNumber;
  const phone = siteSettings?.organization?.phone || "+91 00000 00000";
  const email = "sales@neptuneplywood.com";

  const whatsappHref = createWhatsAppHref({
    phone: whatsappPhone,
    message:
      "Hi, I would like to enquire about Neptune Plywood Private Limited catalogs.",
  });

  return (
    <div className="pb-8">
      <section className="border-b border-zinc-200">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
              Neptune Plywood Private Limited
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
              Premium plywood, laminates, hardware and furniture solutions
            </h1>
            <p className="max-w-xl text-base text-zinc-600 sm:text-lg">
              Browse our catalogs and enquire instantly on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Enquire on WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-600"
                >
                  WhatsApp unavailable
                </button>
              )}
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {heroCategory?.thumbnail?.url ? (
                <Image
                  src={heroCategory.thumbnail.url}
                  alt={heroCategory.thumbnail.alt || heroCategory.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder label={companyName} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                  Featured Category
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {heroCategory?.title || "Premium catalog collection"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Categories
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              Browse by category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-zinc-700 transition hover:text-zinc-950"
          >
            View all
          </Link>
        </div>
        {topCategories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {topCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
            Categories will appear here once they are added in Sanity.
          </div>
        )}
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                New arrivals
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-zinc-700 transition hover:text-zinc-950"
            >
              View all products
            </Link>
          </div>

          {featuredEntries.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredEntries.map((entry) => (
                <EntryCard key={entry._id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-sm text-zinc-600">
              Featured catalog entries will appear here once added.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Why choose us
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Quality materials",
              text: "Curated plywood, laminates and fittings for long-term durability.",
            },
            {
              title: "Wide catalog",
              text: "Organized categories and subcategories built for quick discovery.",
            },
            {
              title: "Fast enquiry",
              text: "Send product enquiries on WhatsApp with prefilled context.",
            },
            {
              title: "Trusted brands",
              text: "Reliable product partners and catalog options for B2B needs.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <p className="text-base font-semibold text-zinc-900">{item.title}</p>
              <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {brands.length > 0 ? (
        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Brands
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  Trusted partner brands
                </h2>
              </div>
              <Link
                href="/brands"
                className="text-sm font-semibold text-zinc-700 transition hover:text-zinc-950"
              >
                View all brands
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {brands.slice(0, 8).map((brand) => (
                <div
                  key={brand._id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                      {brand?.logo?.url ? (
                        <Image
                          src={brand.logo.url}
                          alt={brand.logo.alt || brand.title}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-500">
                          BR
                        </div>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm font-semibold text-zinc-900">
                      {brand.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-zinc-900 p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
                Contact
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Need help selecting the right catalog?
              </h2>
              <p className="mt-3 text-sm text-zinc-300 sm:text-base">
                Send your enquiry and our team will respond with the most
                relevant catalog options.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p>Phone: {phone}</p>
              <p>WhatsApp: {normalizePhone(whatsappPhone) || "Not set"}</p>
              <p>Email: {email}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                Enquire on WhatsApp
              </a>
            ) : null}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-zinc-300"
            >
              View contact page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

