import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryEntriesClient from "@/components/CategoryEntriesClient";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SubcategoryTile from "@/components/SubcategoryTile";
import { getRouteParam } from "@/lib/getRouteParam";
import { buildSeoMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import {
  getCategoryBySlugQuery,
  getEntriesByCategorySlugQuery,
  getSiteSettingsQuery,
  getSubcategoriesByCategorySlugQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const categorySlug = await getRouteParam(params, "categorySlug");
  if (!categorySlug) {
    return {};
  }

  const [siteSettings, category] = await Promise.all([
    client.fetch(getSiteSettingsQuery),
    client.fetch(getCategoryBySlugQuery, { slug: categorySlug }),
  ]);

  if (!category) {
    return {};
  }

  return buildSeoMetadata({
    siteSettings,
    seo: category?.seo,
    title: `${category.title} Catalog | Neptune Plywood Private Limited`,
    description: `Browse ${category.title} catalog entries and enquire instantly on WhatsApp.`,
    path: `/categories/${categorySlug}`,
    image: category?.thumbnail?.url,
  });
}

export default async function CategoryDetailPage({ params }) {
  const categorySlug = await getRouteParam(params, "categorySlug");
  if (!categorySlug) {
    notFound();
  }

  const [category, subcategories = [], entries = []] = await Promise.all([
    client.fetch(getCategoryBySlugQuery, { slug: categorySlug }),
    client.fetch(getSubcategoriesByCategorySlugQuery, { slug: categorySlug }),
    client.fetch(getEntriesByCategorySlugQuery, { slug: categorySlug }),
  ]);

  if (!category) {
    notFound();
  }

  const categoryDescription = `Browse the ${category.title} collection from Neptune Plywood Private Limited.`;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.title || "Category" },
        ]}
      />

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative aspect-[21/8] w-full overflow-hidden">
          {category?.thumbnail?.url ? (
            <Image
              src={category.thumbnail.url}
              alt={category.thumbnail.alt || category.title}
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder label={category.title} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {category.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-200 sm:text-base">
              {categoryDescription}
            </p>
          </div>
        </div>
      </section>

      {subcategories.length > 0 ? (
        <section className="mt-10 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Subcategories
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {subcategories.map((subcategory) => (
              <SubcategoryTile key={subcategory._id} subcategory={subcategory} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Catalog Entries
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            Explore {category.title} entries
          </h2>
        </div>

        <CategoryEntriesClient entries={entries} categoryTitle={category.title} />
      </section>
    </div>
  );
}

