import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function SubcategoryTile({ subcategory }) {
  if (!subcategory) {
    return null;
  }

  const title = subcategory?.title || "Subcategory";

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {subcategory?.thumbnail?.url ? (
          <Image
            src={subcategory.thumbnail.url}
            alt={subcategory.thumbnail.alt || `${title} thumbnail`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label={title} />
        )}
      </div>
      <div className="px-4 py-4">
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
      </div>
    </div>
  );
}

