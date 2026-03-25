import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryEntriesClient from "@/components/CategoryEntriesClient";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SubcategoryTile from "@/components/SubcategoryTile";
import { getRouteParam } from "@/lib/getRouteParam";
import { buildSeoMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import {
    getEntriesBySubcategorySlugsQuery,
    getGrandchildCategoriesBySubcategorySlugsQuery,
    getSiteSettingsQuery,
    getSubcategoryByCategoryAndSlugQuery,
} from "@/sanity/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const categorySlug = await getRouteParam(params, "categorySlug");
    const subcategorySlug = await getRouteParam(params, "subcategorySlug");

    if (!categorySlug || !subcategorySlug) {
        return {};
    }

    const [siteSettings, subcategory] = await Promise.all([
        client.fetch(getSiteSettingsQuery),
        client.fetch(getSubcategoryByCategoryAndSlugQuery, {
            categorySlug,
            subcategorySlug,
        }),
    ]);

    if (!subcategory) {
        return {};
    }

    return buildSeoMetadata({
        siteSettings,
        seo: subcategory?.seo,
        title: `${subcategory.title} Catalog | Neptune Plywood Private Limited`,
        description: `Browse ${subcategory.title} catalog entries and enquire instantly on WhatsApp.`,
        path: `/categories/${categorySlug}/${subcategorySlug}`,
        image: subcategory?.thumbnail?.url,
    });
}

export default async function SubcategoryDetailPage({ params }) {
    const categorySlug = await getRouteParam(params, "categorySlug");
    const subcategorySlug = await getRouteParam(params, "subcategorySlug");

    if (!categorySlug || !subcategorySlug) {
        notFound();
    }

    const [subcategory, grandchildCategories = [], entries = []] =
        await Promise.all([
            client.fetch(getSubcategoryByCategoryAndSlugQuery, {
                categorySlug,
                subcategorySlug,
            }),
            client.fetch(getGrandchildCategoriesBySubcategorySlugsQuery, {
                categorySlug,
                subcategorySlug,
            }),
            client.fetch(getEntriesBySubcategorySlugsQuery, {
                categorySlug,
                subcategorySlug,
            }),
        ]);

    if (!subcategory) {
        notFound();
    }

    const category = subcategory?.category;
    const subcategoryDescription = category?.title
        ? `Browse the ${subcategory.title} collection under ${category.title} from Neptune Plywood Private Limited.`
        : `Browse the ${subcategory.title} collection from Neptune Plywood Private Limited.`;

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
                    { label: subcategory.title || "Subcategory" },
                ].filter(Boolean)}
            />

            <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="relative aspect-21/8 w-full overflow-hidden">
                    {subcategory?.thumbnail?.url ? (
                        <Image
                            src={subcategory.thumbnail.url}
                            alt={subcategory.thumbnail.alt || subcategory.title}
                            fill
                            sizes="(min-width: 1280px) 1280px, 100vw"
                            quality={90}
                            className="object-cover"
                        />
                    ) : (
                        <ImagePlaceholder label={subcategory.title} />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            {subcategory.title}s
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-200 sm:text-base">
                            {subcategoryDescription}
                        </p>
                    </div>
                </div>
            </section>

            {grandchildCategories.length > 0 ? (
                <section className="mt-10 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Collection
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {grandchildCategories.map((grandchildCategory) => (
                            <SubcategoryTile
                                key={grandchildCategory._id}
                                subcategory={grandchildCategory}
                                href={`/categories/${categorySlug}/${subcategorySlug}/${grandchildCategory.slug}`}
                                itemLabel="Grandchild"
                            />
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
                        Explore {subcategory.title} entries
                    </h2>
                </div>

                <CategoryEntriesClient
                    entries={entries}
                    categoryTitle={subcategory.title}
                />
            </section>
        </div>
    );
}
