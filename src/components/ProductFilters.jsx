'use client';

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductFilters({ entries = [], categories = [] }) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [search, setSearch] = useState("");

  const filteredEntries = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesCategory =
        selectedCategorySlug === "all" ||
        entry?.category?.slug === selectedCategorySlug;

      const matchesSearch =
        !searchLower ||
        (entry.title || "").toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [entries, search, selectedCategorySlug]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-xs font-medium text-slate-600"
            >
              Search
            </label>
            <input
              id="search"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title…"
              className="mt-1 w-full rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="w-full sm:w-56">
            <label
              htmlFor="category"
              className="block text-xs font-medium text-slate-600"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={selectedCategorySlug}
              onChange={(event) => setSelectedCategorySlug(event.target.value)}
              className="mt-1 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-sm text-slate-500">
          No products match your filters. Try adjusting the search or
          category.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <ProductCard key={entry._id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

