"use client";

import { useMemo, useState } from "react";
import EntryCard from "@/components/EntryCard";
import FiltersBar from "@/components/FiltersBar";
import { entryMatchesSearch, sortEntries } from "@/lib/catalog";

const sortOptions = [
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
  { value: "newest", label: "Newest" },
];

export default function ProductsExplorer({
  entries = [],
  categories = [],
  brands = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("a-z");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const categoryOptions = useMemo(() => {
    const options = categories
      .filter((category) => category?.slug)
      .map((category) => ({
        value: category.slug,
        label: category.title || "Category",
      }));

    return [{ value: "all", label: "All categories" }, ...options];
  }, [categories]);

  const availableBrandOptions = useMemo(() => {
    const options = brands
      .filter((brand) => brand?.slug)
      .map((brand) => ({
        value: brand.slug,
        label: brand.title || "Brand",
      }));

    return [{ value: "all", label: "All brands" }, ...options];
  }, [brands]);

  const filteredEntries = useMemo(() => {
    const filtered = (entries || []).filter((entry) => {
      const matchesSearch = entryMatchesSearch(entry, searchTerm);
      const matchesCategory =
        selectedCategory === "all" || entry?.category?.slug === selectedCategory;
      const matchesBrand =
        selectedBrand === "all" || entry?.brand?.slug === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });

    return sortEntries(filtered, sortValue);
  }, [entries, searchTerm, selectedCategory, selectedBrand, sortValue]);

  return (
    <div className="space-y-6">
      <FiltersBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchPlaceholder="Search products, catalog entries or tags"
        sortValue={sortValue}
        onSortValueChange={setSortValue}
        sortOptions={sortOptions}
        categoryValue={selectedCategory}
        onCategoryValueChange={setSelectedCategory}
        categoryOptions={categoryOptions}
        brandValue={selectedBrand}
        onBrandValueChange={setSelectedBrand}
        brandOptions={
          availableBrandOptions.length > 1 ? availableBrandOptions : []
        }
      />

      {filteredEntries.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry._id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
          No catalog entries match your filters right now.
        </div>
      )}
    </div>
  );
}

