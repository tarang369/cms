const seoFieldsProjection = `
  seo{
    metaTitle,
    metaDescription,
    canonicalUrl,
    noIndex,
    keywords,
    ogImage{
      asset->{url}
    }
  }
`;

const categoryProjection = `
  _id,
  title,
  mode,
  "slug": slug.current,
  "thumbnail": {
    "url": thumbnail.asset->url,
    "alt": coalesce(thumbnail.alt, title)
  },
  ${seoFieldsProjection}
`;

const subcategoryProjection = `
  _id,
  title,
  mode,
  "slug": slug.current,
  "thumbnail": {
    "url": thumbnail.asset->url,
    "alt": coalesce(thumbnail.alt, title)
  },
  "category": category->{
    _id,
    title,
    "slug": slug.current
  },
  ${seoFieldsProjection}
`;

const grandchildCategoryProjection = `
  _id,
  title,
  "slug": slug.current,
  "thumbnail": {
    "url": thumbnail.asset->url,
    "alt": coalesce(thumbnail.alt, title)
  },
  "subcategory": subcategory->{
    _id,
    title,
    "slug": slug.current,
    "category": category->{
      _id,
      title,
      "slug": slug.current
    }
  },
  ${seoFieldsProjection}
`;

const brandProjection = `
  _id,
  title,
  "slug": slug.current,
  description,
  website,
  "logo": {
    "url": logo.asset->url,
    "alt": coalesce(title, "Brand logo")
  },
  ${seoFieldsProjection}
`;

const entryListProjection = `
  _id,
  _createdAt,
  entryKind,
  title,
  "slug": slug.current,
  summary,
  tags,
  "gallery": gallery[]{
    _key,
    alt,
    "url": asset->url
  },
  "catalogPdfUrl": catalogPdf.asset->url,
  whatsapp,
  "category": category->{
    _id,
    title,
    "slug": slug.current
  },
  "subcategory": subcategory->{
    _id,
    title,
    "slug": slug.current
  },
  "grandchildCategory": grandchildCategory->{
    _id,
    title,
    "slug": slug.current
  },
  "brand": brand->{
    _id,
    title,
    "slug": slug.current,
    website,
    "logo": {
      "url": logo.asset->url,
      "alt": coalesce(title, "Brand logo")
    }
  }
`;

export const getSiteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    siteName,
    siteUrl,
    defaultSeo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      noIndex,
      keywords,
      ogImage{
        asset->{url}
      }
    },
    organization{
      name,
      phone,
      whatsappNumber,
      address,
      "logo": {
        "url": logo.asset->url,
        "alt": coalesce(name, "Organization logo")
      }
    },
    social[]{
      label,
      url
    }
  }
`;

export const getCategoriesQuery = `
  *[_type == "category"] | order(title asc) {
    ${categoryProjection}
  }
`;

export const getCategoryBySlugQuery = `
  *[_type == "category" && slug.current == $slug][0]{
    ${categoryProjection}
  }
`;

export const getSubcategoriesByCategorySlugQuery = `
  *[
    _type == "subcategory" &&
    defined(category->slug.current) &&
    category->slug.current == $slug
  ] | order(title asc) {
    ${subcategoryProjection}
  }
`;

export const getSubcategoryByCategoryAndSlugQuery = `
  *[
    _type == "subcategory" &&
    defined(category->slug.current) &&
    category->slug.current == $categorySlug &&
    slug.current == $subcategorySlug
  ][0]{
    ${subcategoryProjection}
  }
`;

export const getGrandchildCategoriesBySubcategorySlugsQuery = `
  *[
    _type == "grandchildCategory" &&
    defined(subcategory->slug.current) &&
    defined(subcategory->category->slug.current) &&
    subcategory->category->slug.current == $categorySlug &&
    subcategory->slug.current == $subcategorySlug
  ] | order(title asc) {
    ${grandchildCategoryProjection}
  }
`;

export const getGrandchildCategoryBySlugsQuery = `
  *[
    _type == "grandchildCategory" &&
    defined(subcategory->slug.current) &&
    defined(subcategory->category->slug.current) &&
    subcategory->category->slug.current == $categorySlug &&
    subcategory->slug.current == $subcategorySlug &&
    slug.current == $grandchildSlug
  ][0]{
    ${grandchildCategoryProjection}
  }
`;

export const getFeaturedEntriesQuery = `
  *[_type == "catalogEntry"] | order(_createdAt desc)[0...8] {
    ${entryListProjection}
  }
`;

export const getEntriesByCategorySlugQuery = `
  *[
    _type == "catalogEntry" &&
    defined(category->slug.current) &&
    category->slug.current == $slug
  ] | order(title asc) {
    ${entryListProjection}
  }
`;

export const getEntriesBySubcategorySlugsQuery = `
  *[
    _type == "catalogEntry" &&
    defined(category->slug.current) &&
    category->slug.current == $categorySlug &&
    defined(subcategory->slug.current) &&
    subcategory->slug.current == $subcategorySlug
  ] | order(title asc) {
    ${entryListProjection}
  }
`;

export const getEntriesByGrandchildCategorySlugsQuery = `
  *[
    _type == "catalogEntry" &&
    defined(category->slug.current) &&
    category->slug.current == $categorySlug &&
    defined(subcategory->slug.current) &&
    subcategory->slug.current == $subcategorySlug &&
    defined(grandchildCategory->slug.current) &&
    grandchildCategory->slug.current == $grandchildSlug
  ] | order(title asc) {
    ${entryListProjection}
  }
`;

export const getAllEntriesQuery = `
  *[_type == "catalogEntry"] | order(title asc) {
    ${entryListProjection}
  }
`;

export const getEntryBySlugQuery = `
  *[_type == "catalogEntry" && slug.current == $slug][0]{
    ${entryListProjection},
    "catalogPdf": catalogPdf{
      "url": asset->url
    },
    ${seoFieldsProjection},
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      "thumbnail": {
        "url": thumbnail.asset->url,
        "alt": coalesce(thumbnail.alt, title)
      }
    },
    "subcategory": subcategory->{
      _id,
      title,
      "slug": slug.current,
      "category": category->{
        _id,
        title,
        "slug": slug.current
      }
    },
    "grandchildCategory": grandchildCategory->{
      _id,
      title,
      "slug": slug.current,
      "subcategory": subcategory->{
        _id,
        title,
        "slug": slug.current
      }
    },
    "brand": brand->{
      _id,
      title,
      description,
      website,
      "slug": slug.current,
      "logo": {
        "url": logo.asset->url,
        "alt": coalesce(title, "Brand logo")
      }
    }
  }
`;

export const getRelatedEntriesQuery = `
  *[
    _type == "catalogEntry" &&
    _id != $entryId &&
    category._ref == $categoryId
  ]
  | order(
      select(
        grandchildCategory._ref == $grandchildCategoryId => 2,
        subcategory._ref == $subcategoryId => 1,
        0
      ) desc,
      _createdAt desc
    )[0...6] {
    ${entryListProjection}
  }
`;

export const getBrandsQuery = `
  *[_type == "brand"] | order(title asc) {
    ${brandProjection}
  }
`;
