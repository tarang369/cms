'use client';

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [] }) {
  const validImages = Array.isArray(images) ? images.filter((img) => img?.url) : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!validImages.length) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
        No images available
      </div>
    );
  }

  const activeImage = validImages[activeIndex] || validImages[0];

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setActiveIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="relative aspect-4/3 w-full">
          <Image
            src={activeImage.url}
            alt={activeImage.alt || "Product image"}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {validImages.map((image, index) => (
            <button
              key={image._key || image.url || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border ${
                index === activeIndex
                  ? "border-emerald-500 ring-2 ring-emerald-500/40"
                  : "border-slate-200"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || "Product thumbnail"}
                fill
                sizes="80px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

