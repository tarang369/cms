"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function Gallery({ images = [], title = "Catalog item" }) {
  const validImages = useMemo(
    () =>
      Array.isArray(images)
        ? images.filter((image) => Boolean(image?.url))
        : [],
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (!validImages.length) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div className="aspect-[4/3] w-full">
          <ImagePlaceholder label={title} />
        </div>
      </div>
    );
  }

  const activeImage = validImages[activeIndex] || validImages[0];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={activeImage.url}
            alt={activeImage.alt || title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {validImages.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {validImages.map((image, index) => (
            <button
              key={image._key || image.url || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition ${
                index === activeIndex
                  ? "border-zinc-900 ring-2 ring-zinc-900/20"
                  : "border-zinc-200"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} thumbnail ${index + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

