import Image from "next/image";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function CategoryCard({ category }) {
  if (!category?.slug) {
    return null;
  }

  const title = category?.title || "Category";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {category?.thumbnail?.url ? (
          <Image
            src={category.thumbnail.url}
            alt={category.thumbnail.alt || `${title} thumbnail`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={title} />
        )}
      </div>
      <div className="space-y-2 px-6 py-5">
        <p className="text-xl font-semibold tracking-tight text-zinc-900">
          {title}
        </p>
        <p className="text-sm text-zinc-600">Explore {title} collection</p>
      </div>
    </Link>
  );
}

