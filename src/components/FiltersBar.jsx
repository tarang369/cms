"use client";

export default function FiltersBar({
  searchTerm,
  onSearchTermChange,
  searchPlaceholder = "Search catalog items",
  sortValue,
  onSortValueChange,
  sortOptions = [],
  categoryValue,
  onCategoryValueChange,
  categoryOptions = [],
  brandValue,
  onBrandValueChange,
  brandOptions = [],
  activeTag,
  onActiveTagChange,
  tagOptions = [],
}) {
  const hasCategorySelect = categoryOptions.length > 0;
  const hasBrandSelect = brandOptions.length > 0;
  const hasSortSelect = sortOptions.length > 0;
  const hasTags = tagOptions.length > 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <label
              htmlFor="search"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
            >
              Search
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          {hasCategorySelect ? (
            <div className="lg:col-span-2">
              <label
                htmlFor="category-filter"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={categoryValue}
                onChange={(event) =>
                  onCategoryValueChange?.(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {hasBrandSelect ? (
            <div className="lg:col-span-2">
              <label
                htmlFor="brand-filter"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
              >
                Brand
              </label>
              <select
                id="brand-filter"
                value={brandValue}
                onChange={(event) => onBrandValueChange?.(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              >
                {brandOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {hasSortSelect ? (
            <div className="lg:col-span-3">
              <label
                htmlFor="sort-filter"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500"
              >
                Sort
              </label>
              <select
                id="sort-filter"
                value={sortValue}
                onChange={(event) => onSortValueChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </div>

      {hasTags ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onActiveTagChange?.("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              activeTag === "all"
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
          >
            All tags
          </button>
          {tagOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onActiveTagChange?.(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                activeTag === tag
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

