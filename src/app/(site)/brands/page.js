import Image from "next/image";
import { buildSeoMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { getBrandsQuery, getSiteSettingsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata() {
  const siteSettings = await client.fetch(getSiteSettingsQuery);

  return buildSeoMetadata({
    siteSettings,
    seo: siteSettings?.defaultSeo,
    title: "Brands | Neptune Plywood Private Limited",
    description:
      "Explore partner brands from Neptune Plywood Private Limited catalog collections.",
    path: "/brands",
  });
}

export default async function BrandsPage() {
  const brands = (await client.fetch(getBrandsQuery)) || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Brands
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Trusted partner brands
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
          Explore the brands featured across our catalogs.
        </p>
      </div>

      {brands.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => (
            <article
              key={brand._id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                  {brand?.logo?.url ? (
                    <Image
                      src={brand.logo.url}
                      alt={brand.logo.alt || brand.title}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-500">
                      BR
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                    {brand.title}
                  </h2>
                  {brand.description ? (
                    <p className="line-clamp-3 text-sm text-zinc-600">
                      {brand.description}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-600">
                      Premium catalog partner brand.
                    </p>
                  )}
                  {brand?.website ? (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex text-sm font-semibold text-zinc-800 underline"
                    >
                      Visit website
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
          No brands are available yet. Add brand documents in Sanity to populate
          this page.
        </div>
      )}
    </div>
  );
}

