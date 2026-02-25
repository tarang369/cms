import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import { buildSeoMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { getCategoriesQuery, getSiteSettingsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata() {
  const siteSettings = await client.fetch(getSiteSettingsQuery);

  return buildSeoMetadata({
    siteSettings,
    seo: siteSettings?.defaultSeo,
    title: "Categories | Neptune Plywood Private Limited",
    description:
      "Explore catalog categories for plywood, laminates, hardware and furniture solutions.",
    path: "/categories",
  });
}

export default async function CategoriesPage() {
  const categories = (await client.fetch(getCategoriesQuery)) || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />

      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Catalog Categories
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Browse categories
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
          Explore category-wise catalog collections and move directly to detailed
          product pages.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
          No categories found yet. Add categories in Sanity to populate this
          page.
        </div>
      )}
    </div>
  );
}

