import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryEntriesClient from "@/components/CategoryEntriesClient";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { getRouteParam } from "@/lib/getRouteParam";
import { buildSeoMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import {
    getEntriesByGrandchildCategorySlugsQuery,
    getGrandchildCategoryBySlugsQuery,
    getSiteSettingsQuery,
} from "@/sanity/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const categorySlug = await getRouteParam(params, "categorySlug");
    const subcategorySlug = await getRouteParam(params, "subcategorySlug");
    const grandchildSlug = await getRouteParam(params, "grandchildSlug");

    if (!categorySlug || !subcategorySlug || !grandchildSlug) {
        return {};
    }

    const [siteSettings, grandchildCategory] = await Promise.all([
        client.fetch(getSiteSettingsQuery),
        client.fetch(getGrandchildCategoryBySlugsQuery, {
            categorySlug,
            subcategorySlug,
            grandchildSlug,
        }),
    ]);

    if (!grandchildCategory) {
        return {};
    }

    return buildSeoMetadata({
        siteSettings,
        seo: grandchildCategory?.seo,
        title: `${grandchildCategory.title} Catalog | Neptune Plywood Private Limited`,
    description: `Browse ${grandchildCategory.title} catalog entries and enquire instantly on WhatsApp.`,
        path: `/categories/${categorySlug}/${subcategorySlug}/${grandchildSlug}`,
        image: grandchildCategory?.thumbnail?.url,
    });
}

export default async function GrandchildCategoryDetailPage({ params }) {
    const categorySlug = await getRouteParam(params, "categorySlug");
    const subcategorySlug = await getRouteParam(params, "subcategorySlug");
    const grandchildSlug = await getRouteParam(params, "grandchildSlug");

    if (!categorySlug || !subcategorySlug || !grandchildSlug) {
        notFound();
    }

    const [grandchildCategory, entries = []] = await Promise.all([
        client.fetch(getGrandchildCategoryBySlugsQuery, {
            categorySlug,
            subcategorySlug,
            grandchildSlug,
        }),
        client.fetch(getEntriesByGrandchildCategorySlugsQuery, {
            categorySlug,
            subcategorySlug,
            grandchildSlug,
        }),
    ]);

    if (!grandchildCategory) {
        notFound();
    }

    const subcategory = grandchildCategory?.subcategory;
    const category = subcategory?.category;
    const grandchildDescription = subcategory?.title
        ? `Browse the ${grandchildCategory.title} collection under ${subcategory.title} from Neptune Plywood Private Limited.`
        : `Browse the ${grandchildCategory.title} collection from Neptune Plywood Private Limited.`;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
            <Breadcrumbs
                items={[
                    { label: "Home", href: "/" },
                    { label: "Categories", href: "/categories" },
                    category?.slug
                        ? {
                              label: category.title,
                              href: `/categories/${category.slug}`,
                          }
                        : null,
                    subcategory?.slug
                        ? {
                              label: subcategory.title,
                              href: `/categories/${category?.slug}/${subcategory.slug}`,
                          }
                        : null,
                    {
                        label:
                            grandchildCategory.title || "Grandchild Category",
                    },
                ].filter(Boolean)}
            />

            <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="relative aspect-21/8 w-full overflow-hidden">
                    {grandchildCategory?.thumbnail?.url ? (
                        <Image
                            src={grandchildCategory.thumbnail.url}
                            alt={
                                grandchildCategory.thumbnail.alt ||
                                grandchildCategory.title
                            }
                            fill
                            sizes="(min-width: 1280px) 1280px, 100vw"
                            className="object-cover"
                        />
                    ) : (
                        <ImagePlaceholder label={grandchildCategory.title} />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            {grandchildCategory.title}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-200 sm:text-base">
                            {grandchildDescription}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Catalog Entries
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                        Explore {grandchildCategory.title} entries
                    </h2>
                </div>

                <CategoryEntriesClient
                    entries={entries}
                    categoryTitle={grandchildCategory.title}
                />
            </section>
        </div>
    );
}
