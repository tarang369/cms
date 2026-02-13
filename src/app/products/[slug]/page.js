import Breadcrumbs from "@/components/Breadcrumbs";
import Layout from "@/components/Layout";
import ProductGallery from "@/components/ProductGallery";
import WhatsAppButton from "@/components/WhatsAppButton";
import { client } from "@/sanity/lib/client";
import {
    getEntryBySlugQuery,
    getSiteSettingsQuery,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getSlugFromParams(params) {
    const resolved = await params; // handles promise-like params
    if (!resolved) return null;

    if (typeof resolved === "string") {
        try {
            const parsed = JSON.parse(resolved);
            return parsed?.slug || null;
        } catch {
            return null;
        }
    }

    return resolved?.slug || null;
}

export async function generateMetadata({ params }) {
    const slug = await getSlugFromParams(params);
    if (!slug) return {};

    const [entry, siteSettings] = await Promise.all([
        client.fetch(getEntryBySlugQuery, { slug }),
        client.fetch(getSiteSettingsQuery),
    ]);

    if (!entry) return {};

    const baseTitle = entry.title || "Catalog entry";
    const categoryTitle = entry.category?.title;

    const title =
        entry.seo?.metaTitle ||
        (categoryTitle ? `${baseTitle} | ${categoryTitle}` : baseTitle);

    const description =
        entry.seo?.metaDescription ||
        entry.summary ||
        `Learn more about ${baseTitle}.`;

    const ogImage =
        entry.seo?.ogImage?.asset?.url ||
        (entry.gallery && entry.gallery[0]?.url) ||
        undefined;

    const siteUrl = siteSettings?.siteUrl;
    const canonical =
        siteUrl && entry.slug
            ? new URL(`/products/${entry.slug}`, siteUrl).toString()
            : undefined;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
        alternates: canonical ? { canonical } : undefined,
    };
}

export default async function ProductDetailPage({ params }) {
    const slug = await getSlugFromParams(params);
    if (!slug) notFound();

    const [entry, siteSettings] = await Promise.all([
        client.fetch(getEntryBySlugQuery, { slug }),
        client.fetch(getSiteSettingsQuery),
    ]);

    if (!entry) notFound();

    const category = entry.category;
    const subcategory = entry.subcategory;
    const brand = entry.brand;
    const tags = Array.isArray(entry.tags) ? entry.tags : [];
    const pdfUrl = entry.catalogPdf?.url;

    const fallbackPhone =
        siteSettings?.organization?.whatsappNumber ||
        siteSettings?.whatsappNumber;

    return (
        <Layout>
            <section className="bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Categories", href: "/categories" },
                            category?.slug
                                ? {
                                      label: category.title || "Category",
                                      href: `/categories/${category.slug}`,
                                  }
                                : { label: "Category" },
                            { label: entry.title || "Product" },
                        ]}
                    />

                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                        <div className="space-y-6">
                            <ProductGallery images={entry.gallery} />

                            {pdfUrl && (
                                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                Catalog PDF
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Preview the catalog or open it
                                                in a new tab.
                                            </p>
                                        </div>
                                        <a
                                            href={pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                                        >
                                            Open PDF
                                        </a>
                                    </div>
                                    <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200 bg-white lg:h-80">
                                        <iframe
                                            src={pdfUrl}
                                            title={entry.title || "Catalog PDF"}
                                            className="h-full w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                {entry.entryKind && (
                                    <p className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                                        {entry.entryKind}
                                    </p>
                                )}
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                                    {entry.title || "Product"}
                                </h1>
                            </div>

                            <div className="space-y-1 text-sm text-slate-600">
                                {category?.title && (
                                    <p>
                                        <span className="font-medium text-slate-800">
                                            Category:
                                        </span>{" "}
                                        {category.title}
                                    </p>
                                )}
                                {subcategory?.title && (
                                    <p>
                                        <span className="font-medium text-slate-800">
                                            Subcategory:
                                        </span>{" "}
                                        {subcategory.title}
                                    </p>
                                )}
                                {brand?.title && (
                                    <p>
                                        <span className="font-medium text-slate-800">
                                            Brand:
                                        </span>{" "}
                                        {brand.title}
                                    </p>
                                )}
                            </div>

                            {entry.summary && (
                                <p className="text-sm leading-relaxed text-slate-700">
                                    {entry.summary}
                                </p>
                            )}

                            {tags.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                                        Tags
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={`${tag}-${index}`}
                                                className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <WhatsAppButton
                                    phone={entry.whatsapp?.phone}
                                    fallbackPhone={fallbackPhone}
                                    title={entry.title}
                                    category={category?.title}
                                    code={entry.whatsapp?.code}
                                    messageTemplate={
                                        entry.whatsapp?.messageTemplate
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
