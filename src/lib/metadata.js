const COMPANY_NAME = "Neptune Plywood Private Limited";
const DEFAULT_DESCRIPTION =
  "Premium plywood, laminates, hardware and furniture solutions for modern projects.";

function ensureArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function getSiteName(siteSettings) {
  return (
    siteSettings?.siteName ||
    siteSettings?.organization?.name ||
    COMPANY_NAME
  );
}

function buildCanonicalUrl(siteUrl, path) {
  if (!siteUrl || !path) {
    return undefined;
  }

  try {
    return new URL(path, siteUrl).toString();
  } catch {
    return undefined;
  }
}

export function buildSeoMetadata({
  siteSettings,
  seo,
  title,
  description,
  path,
  image,
}) {
  const defaultSeo = siteSettings?.defaultSeo || {};
  const siteName = getSiteName(siteSettings);

  const resolvedTitle =
    seo?.metaTitle ||
    title ||
    defaultSeo?.metaTitle ||
    `${siteName} Catalog`;

  const resolvedDescription =
    seo?.metaDescription ||
    description ||
    defaultSeo?.metaDescription ||
    DEFAULT_DESCRIPTION;

  const canonical =
    seo?.canonicalUrl || buildCanonicalUrl(siteSettings?.siteUrl, path);

  const ogImageUrl =
    seo?.ogImage?.asset?.url ||
    image ||
    defaultSeo?.ogImage?.asset?.url ||
    undefined;

  const keywords =
    ensureArray(seo?.keywords).length > 0
      ? ensureArray(seo?.keywords)
      : ensureArray(defaultSeo?.keywords);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      type: "website",
      url: canonical,
      siteName,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description: resolvedDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

