import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import EntryCard from "@/components/EntryCard";
import Gallery from "@/components/Gallery";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { getRouteParam } from "@/lib/getRouteParam";
import { buildSeoMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import {
  getEntryBySlugQuery,
  getRelatedEntriesQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const slug = await getRouteParam(params, "slug");
  if (!slug) {
    return {};
  }

  const [siteSettings, entry] = await Promise.all([
    client.fetch(getSiteSettingsQuery),
    client.fetch(getEntryBySlugQuery, { slug }),
  ]);

  if (!entry) {
    return {};
  }

  return buildSeoMetadata({
    siteSettings,
    seo: entry?.seo,
    title: `${entry.title} | Neptune Plywood Private Limited`,
    description:
      entry?.summary ||
      `View complete details for ${entry.title} and send an enquiry on WhatsApp.`,
    path: `/products/${slug}`,
    image: entry?.seo?.ogImage?.asset?.url || entry?.gallery?.[0]?.url,
  });
}

export default async function ProductDetailPage({ params }) {
  const slug = await getRouteParam(params, "slug");
  if (!slug) {
    notFound();
  }

  const [entry, siteSettings] = await Promise.all([
    client.fetch(getEntryBySlugQuery, { slug }),
    client.fetch(getSiteSettingsQuery),
  ]);

  if (!entry) {
    notFound();
  }

  const relatedEntries =
    entry?.category?._id
      ? await client.fetch(getRelatedEntriesQuery, {
          entryId: entry._id,
          categoryId: entry.category._id,
          subcategoryId: entry?.subcategory?._id || "",
        })
      : [];

  const summaryText =
    entry?.summary ||
    `${entry?.title} is part of Neptune Plywood Private Limited's premium catalog. Share your requirement on WhatsApp to receive details quickly.`;

  const categoryTitle = entry?.category?.title || "Catalog";
  const subcategoryTitle = entry?.subcategory?.title;
  const fallbackPhone =
    siteSettings?.organization?.whatsappNumber ||
    siteSettings?.organization?.phone ||
    "";
  const tags = Array.isArray(entry?.tags) ? entry.tags.filter(Boolean) : [];
  const pdfUrl = entry?.catalogPdf?.url || entry?.catalogPdfUrl;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          entry?.category?.slug
            ? {
                label: entry.category.title,
                href: `/categories/${entry.category.slug}`,
              }
            : null,
          { label: entry.title },
        ].filter(Boolean)}
      />

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-8">
          <Gallery images={entry.gallery} title={entry.title} />

          {pdfUrl ? (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Catalog PDF
                  </h2>
                  <p className="text-sm text-zinc-600">
                    Open or download the latest catalog document.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Open PDF
                  </a>
                  <a
                    href={pdfUrl}
                    download
                    className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
                  >
                    Download
                  </a>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
                <iframe
                  src={pdfUrl}
                  title={`${entry.title} PDF preview`}
                  className="h-[360px] w-full"
                />
              </div>
            </section>
          ) : null}

          {relatedEntries.length > 0 ? (
            <section className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Related
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  Related items
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {relatedEntries.map((relatedEntry) => (
                  <EntryCard key={relatedEntry._id} entry={relatedEntry} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Catalog Item
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              {entry.title}
            </h1>
            <p className="mt-3 text-sm text-zinc-600">
              {entry?.category?.slug ? (
                <Link
                  href={`/categories/${entry.category.slug}`}
                  className="font-medium text-zinc-900"
                >
                  {categoryTitle}
                </Link>
              ) : (
                <span className="font-medium text-zinc-900">{categoryTitle}</span>
              )}
              {subcategoryTitle ? ` / ${subcategoryTitle}` : ""}
            </p>
            <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
              {summaryText}
            </div>

            {tags.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Tags
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <WhatsAppCTA
            phone={entry?.whatsapp?.phone}
            fallbackPhone={fallbackPhone}
            title={entry?.title}
            category={entry?.category?.title}
            code={entry?.whatsapp?.code}
            messageTemplate={entry?.whatsapp?.messageTemplate}
          />

          {entry?.brand ? (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Brand
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                  {entry?.brand?.logo?.url ? (
                    <Image
                      src={entry.brand.logo.url}
                      alt={entry.brand.logo.alt || entry.brand.title}
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
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {entry.brand.title}
                  </p>
                  {entry?.brand?.website ? (
                    <a
                      href={entry.brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-600 underline"
                    >
                      Visit website
                    </a>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
