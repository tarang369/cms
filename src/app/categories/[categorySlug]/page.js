import Breadcrumbs from "@/components/Breadcrumbs";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { client } from "@/sanity/lib/client";
import {
    getCategoryBySlugQuery,
    getEntriesByCategorySlugQuery,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getParam(params, key) {
    const resolved = await params;

    if (!resolved) return null;

    // If resolved is a string like "{\"slug\":\"test\"}" or "{\"categorySlug\":\"furniture\"}"
    if (typeof resolved === "string") {
        try {
            const parsed = JSON.parse(resolved);
            return parsed?.[key] || null;
        } catch {
            return null;
        }
    }

    return resolved?.[key] || null;
}

export async function generateMetadata({ params }) {
    const categorySlug = await getParam(params, "categorySlug");
    if (!categorySlug) return {};

    const category = await client.fetch(getCategoryBySlugQuery, {
        slug: categorySlug,
    });

    if (!category) return {};

    const title =
        category.seo?.metaTitle ||
        `${category.title} | Categories | Acme Catalog`;
    const description =
        category.seo?.metaDescription ||
        category.description ||
        `Browse catalog entries in the ${category.title} category.`;

    return { title, description };
}

export default async function CategoryDetailPage({ params }) {
    const categorySlug = await getParam(params, "categorySlug");
    if (!categorySlug) notFound();

    const [category, entries] = await Promise.all([
        client.fetch(getCategoryBySlugQuery, { slug: categorySlug }),
        client.fetch(getEntriesByCategorySlugQuery, { slug: categorySlug }),
    ]);

    if (!category) notFound();

    return (
        <Layout>
            <section className="bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Categories", href: "/categories" },
                            { label: category.title || "Category" },
                        ]}
                    />

                    <div className="mb-6 space-y-2 sm:mb-8">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                            {category.title || "Category"}
                        </h1>
                        {category.description && (
                            <p className="max-w-2xl text-sm text-slate-600">
                                {category.description}
                            </p>
                        )}
                    </div>

                    {entries.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No catalog entries found for this category yet.
                        </p>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {entries.map((entry) => (
                                <ProductCard
                                    key={entry._id}
                                    entry={entry}
                                    showCategory={false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
