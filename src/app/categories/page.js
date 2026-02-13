import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import { client } from "@/sanity/lib/client";
import { getCategoriesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata = {
  title: "Categories | Acme Catalog",
  description: "Browse all catalog categories and drill into detailed entries.",
};

export default async function CategoriesPage() {
  const categories = (await client.fetch(getCategoriesQuery)) || [];

  return (
    <Layout>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-6 space-y-2 sm:mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Categories
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Explore catalog entries grouped by category. Click any category
              to see all related items.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-sm text-slate-500">
              No categories found in your Sanity dataset.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}

