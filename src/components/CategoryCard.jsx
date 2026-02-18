import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }) {
    if (!category) return null;

    const href = `/categories/${category.slug}`;

    const thumbUrl = category?.thumbnail?.url || null;
    const thumbAlt =
        category?.thumbnail?.alt ||
        (category?.title
            ? `${category.title} thumbnail`
            : "Category thumbnail");

    return (
        <Link
            href={href}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/70 hover:shadow-md"
        >
            <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/60">
                    {thumbUrl ? (
                        <Image
                            src={thumbUrl}
                            alt={thumbAlt}
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full" aria-hidden="true" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {category.title || "Untitled category"}
                    </p>

                    {category.mode && (
                        <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                            {category.mode}
                        </p>
                    )}

                    {category.description && (
                        <p className="mt-2 line-clamp-3 text-xs text-slate-500">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            <span className="mt-3 inline-flex items-center text-xs font-medium text-emerald-700 group-hover:text-emerald-800">
                View products
                <span className="ml-1 text-[10px]">↗</span>
            </span>
        </Link>
    );
}
