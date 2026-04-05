import ImagePlaceholder from "@/components/ImagePlaceholder";
import Image from "next/image";
import Link from "next/link";

export default function SubcategoryTile({
    subcategory,
    href,
    itemLabel = "Subcategory",
}) {
    if (!subcategory) {
        return null;
    }

    const title = subcategory?.title || itemLabel;
    const className = href
        ? "group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        : "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm";
    const content = (
        <>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                {subcategory?.thumbnail?.url ? (
                    <Image
                        src={subcategory.thumbnail.url}
                        alt={subcategory.thumbnail.alt || `${title} thumbnail`}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className={`object-cover ${href ? "transition duration-500 group-hover:scale-105" : ""}`}
                    />
                ) : (
                    <ImagePlaceholder label={title} />
                )}
            </div>
            <div className="space-y-2 px-4 py-4">
                {/* <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {itemLabel}
                </p> */}
                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                <p className="text-sm text-zinc-600">
                    Explore {title} collections
                </p>
            </div>
        </>
    );

    if (!href) {
        return <div className={className}>{content}</div>;
    }

    return (
        <Link href={href} className={className}>
            {content}
        </Link>
    );
}
