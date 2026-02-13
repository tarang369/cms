import Link from "next/link";
import Image from "next/image";

function getPrimaryImage(entry) {
  const images = entry?.gallery || [];
  if (!Array.isArray(images) || images.length === 0) return null;
  return images[0];
}

export default function ProductCard({ entry, showCategory = true }) {
  if (!entry) return null;

  const href = `/products/${entry.slug}`;
  const image = getPrimaryImage(entry);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/70 hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full bg-slate-100">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || entry.title || "Product image"}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-sm font-semibold text-slate-900">
            {entry.title || "Untitled entry"}
          </p>
          {entry.entryKind && (
            <span className="inline-flex shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
              {entry.entryKind}
            </span>
          )}
        </div>
        {showCategory && entry.category?.title && (
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {entry.category.title}
          </p>
        )}
        {entry.summary && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {entry.summary}
          </p>
        )}
        <span className="mt-3 inline-flex text-xs font-medium text-emerald-700 group-hover:text-emerald-800">
          View details
        </span>
      </div>
    </Link>
  );
}

