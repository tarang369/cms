"use client";

import { useMemo, useState } from "react";
import EntryCard from "@/components/EntryCard";
import FiltersBar from "@/components/FiltersBar";
import { collectTags, entryMatchesSearch, sortEntries } from "@/lib/catalog";

const sortOptions = [
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
  { value: "newest", label: "Newest" },
];

export default function CategoryEntriesClient({ entries = [], categoryTitle }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("a-z");
  const [activeTag, setActiveTag] = useState("all");

  const availableTags = useMemo(() => collectTags(entries), [entries]);

  const filteredEntries = useMemo(() => {
    const filtered = (entries || []).filter((entry) => {
      const matchesSearch = entryMatchesSearch(entry, searchTerm);
      const matchesTag =
        activeTag === "all" || (entry?.tags || []).includes(activeTag);

      return matchesSearch && matchesTag;
    });

    return sortEntries(filtered, sortValue);
  }, [activeTag, entries, searchTerm, sortValue]);

  return (
    <div className="space-y-6">
      <FiltersBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchPlaceholder={`Search in ${categoryTitle || "this category"}`}
        sortValue={sortValue}
        onSortValueChange={setSortValue}
        sortOptions={sortOptions}
        activeTag={activeTag}
        onActiveTagChange={setActiveTag}
        tagOptions={availableTags}
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

