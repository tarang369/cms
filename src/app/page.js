import Link from "next/link";
import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { client } from "@/sanity/lib/client";
import {
  getCategoriesQuery,
  getFeaturedEntriesQuery,
  getSiteSettingsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [categories = [], featuredEntries = [], siteSettings] =
    await Promise.all([
      client.fetch(getCategoriesQuery),
      client.fetch(getFeaturedEntriesQuery),
      client.fetch(getSiteSettingsQuery),
    ]);

  const topCategories = categories.slice(0, 4);
  const fallbackPhone =
    siteSettings?.organization?.whatsappNumber || siteSettings?.whatsappNumber;

  return (
    <Layout>
      <section className="border-b bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 lg:flex-row lg:items-center lg:py-16">
          <div className="flex-1 space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Catalog Solutions
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Discover and share your full product catalog.
            </h1>
            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              A clean, searchable catalog experience for your customers. Browse
              categories, view product details, and enquire instantly via
              WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
              >
                Browse catalog
              </Link>
              {fallbackPhone && (
                <WhatsAppButton
                  phone={fallbackPhone}
                  title="our catalog"
                  messageTemplate="Hi, I would like to know more about your catalog."
                  className="inline-flex"
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-slate-900">Catalog-first</p>
                  <p className="mt-1 text-slate-500">
                    Focused on discovery and enquiries, not checkout.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Powered by Sanity
                  </p>
                  <p className="mt-1 text-slate-500">
                    Manage products, PDFs, and categories in one CMS.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    WhatsApp enquiries
                  </p>
                  <p className="mt-1 text-slate-500">
                    Customers can contact you instantly with one tap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Browse by category
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Start by exploring a few key categories from your catalog.
              </p>
            </div>
            <Link
              href="/categories"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all categories
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
            {topCategories.length === 0 && (
              <p className="text-sm text-slate-500">
                No categories found. Create some in your Sanity Studio.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Featured products
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Recently added catalog entries, including products and PDF
                catalogs.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all products
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredEntries.map((entry) => (
              <ProductCard key={entry._id} entry={entry} />
            ))}
            {featuredEntries.length === 0 && (
              <p className="text-sm text-slate-500">
                No catalog entries found. Add{" "}
                <span className="font-medium">catalogEntry</span> documents in
                Sanity to populate this section.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="grid gap-6 md:grid-cols-[1.5fr_minmax(0,1fr)] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Ready to share your catalog?
              </h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Use this catalog experience as the front door to your products.
                Link directly from social, campaigns, or your website and route
                every enquiry straight into WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap justify-start gap-3 md:justify-end">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-50"
              >
                Explore catalog
              </Link>
              {fallbackPhone && (
                <WhatsAppButton
                  phone={fallbackPhone}
                  title="our catalog"
                  messageTemplate="Hi, I would like to discuss how we can work together."
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
