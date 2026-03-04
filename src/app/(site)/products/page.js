import Breadcrumbs from "@/components/Breadcrumbs";
import ProductsExplorer from "@/components/ProductsExplorer";
import { buildSeoMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import {
  getAllEntriesQuery,
  getBrandsQuery,
  getCategoriesQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata() {
  const siteSettings = await client.fetch(getSiteSettingsQuery);

  return buildSeoMetadata({
    siteSettings,
    seo: siteSettings?.defaultSeo,
    title: "Products Catalog | Neptune Plywood Private Limited",
    description:
      "Browse all catalog entries across categories, apply filters, and enquire on WhatsApp.",
    path: "/products",
  });
}

export default async function ProductsPage() {
  const [entries = [], categories = [], brands = []] = await Promise.all([
    client.fetch(getAllEntriesQuery),
    client.fetch(getCategoriesQuery),
    client.fetch(getBrandsQuery),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
      />

      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Product Catalog
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Explore all catalog entries
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
          Browse products and catalogs from A-Z. Refine by category, brand, and
          search terms.
        </p>
      </div>

      <ProductsExplorer entries={entries} categories={categories} brands={brands} />
    </div>
  );
}

