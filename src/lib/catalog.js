export function normalizeSearchText(value) {
  return (value || "").trim().toLowerCase();
}

export function entryMatchesSearch(entry, searchTerm) {
  const normalizedSearch = normalizeSearchText(searchTerm);

  if (!normalizedSearch) {
    return true;
  }

  const title = normalizeSearchText(entry?.title);
  const summary = normalizeSearchText(entry?.summary);
  const tags = Array.isArray(entry?.tags)
    ? entry.tags.map((tag) => normalizeSearchText(tag)).join(" ")
    : "";

  return (
    title.includes(normalizedSearch) ||
    summary.includes(normalizedSearch) ||
    tags.includes(normalizedSearch)
  );
}

export function sortEntries(entries, sortValue) {
  const list = Array.isArray(entries) ? [...entries] : [];

  if (sortValue === "z-a") {
    return list.sort((a, b) =>
      (b?.title || "").localeCompare(a?.title || "", undefined, {
        sensitivity: "base",
      }),
    );
  }

  if (sortValue === "newest") {
    return list.sort(
      (a, b) => new Date(b?._createdAt || 0) - new Date(a?._createdAt || 0),
    );
  }

  return list.sort((a, b) =>
    (a?.title || "").localeCompare(b?.title || "", undefined, {
      sensitivity: "base",
    }),
  );
}

export function collectTags(entries) {
  const tags = new Set();

  (entries || []).forEach((entry) => {
    (entry?.tags || []).forEach((tag) => {
      if (tag) {
        tags.add(tag);
      }
    });
  });

  return Array.from(tags).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

