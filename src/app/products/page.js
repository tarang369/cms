import Layout from "@/components/Layout";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductFilters from "@/components/ProductFilters";
import { client } from "@/sanity/lib/client";
import { getAllEntriesQuery, getCategoriesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "Products | Acme Catalog",
  description:
    "Browse all catalog entries across categories, filter by category, and search by title.",
};

export default async function ProductsPage() {
  const [entries = [], categories = []] = await Promise.all([
    client.fetch(getAllEntriesQuery),
    client.fetch(getCategoriesQuery),
  ]);

  return (
    <Layout>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products" },
            ]}
          />

          <div className="mb-6 space-y-2 sm:mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              View all catalog entries across every category. Use the filters
              to narrow down by category or search by title.
            </p>
          </div>

          <ProductFilters entries={entries} categories={categories} />
        </div>
      </section>
    </Layout>
  );
}

