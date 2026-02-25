import Link from "next/link";
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
    title: "About | Neptune Plywood Private Limited",
    description:
      "Learn about Neptune Plywood Private Limited, our catalog-first workflow, and product categories.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [siteSettings, categories = []] = await Promise.all([
    client.fetch(getSiteSettingsQuery),
    client.fetch(getCategoriesQuery),
  ]);

  const companyName =
    siteSettings?.organization?.name || "Neptune Plywood Private Limited";
  const highlights = categories.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          About us
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          {companyName}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base">
          We are focused on helping businesses discover premium plywood,
          laminates, hardware and furniture solutions through a clean
          catalog-first experience. Our process is designed for fast discovery
          and direct WhatsApp enquiry without checkout friction.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Our mission
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Deliver dependable, high-quality materials with a professional
            digital catalog that makes B2B enquiries simple and fast.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            What we offer
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            A broad catalog across key product categories with clear visuals,
            organized product details, PDF catalogs, and trusted brand support.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            How enquiry works
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Browse categories and products, open detailed pages, then send a
            prefilled WhatsApp enquiry instantly. No cart, no checkout, only
            direct catalog discussions.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Category highlights
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            Explore our catalog focus areas
          </h2>
        </div>

        {highlights.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
            Category highlights will appear once categories are added in Sanity.
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-zinc-900 p-8 text-white sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Ready to explore the full catalog?
        </h2>
        <p className="mt-2 text-sm text-zinc-300">
          Start browsing by category or jump straight into all products.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/categories"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Browse categories
          </Link>
          <Link
            href="/products"
            className="rounded-xl border border-zinc-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-zinc-300"
          >
            View products
          </Link>
        </div>
      </section>
    </div>
  );
}

