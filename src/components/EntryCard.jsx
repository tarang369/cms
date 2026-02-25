import Image from "next/image";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";

function getPrimaryImage(entry) {
  if (!Array.isArray(entry?.gallery)) {
    return null;
  }

  return entry.gallery.find((image) => image?.url) || null;
}

export default function EntryCard({ entry }) {
  if (!entry?.slug) {
    return null;
  }

  const primaryImage = getPrimaryImage(entry);
  const title = entry?.title || "Catalog item";
  const summary =
    entry?.summary ||
    "Explore this catalog entry and enquire directly on WhatsApp.";

  return (
    <Link
      href={`/products/${entry.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {primaryImage?.url ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={title} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        {entry?.category?.title ? (
          <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">
            {entry.category.title}
          </span>
        ) : null}

        <h3 className="line-clamp-2 text-base font-semibold text-zinc-900">
          {title}
        </h3>

        <p className="line-clamp-2 text-sm text-zinc-600">{summary}</p>

        <span className="mt-auto text-sm font-medium text-zinc-900">
          View details
        </span>
      </div>
    </Link>
  );
}

