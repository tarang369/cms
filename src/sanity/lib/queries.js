export const getCategoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    mode,
    description,
    "thumbnail": {
      "url": thumbnail.asset->url,
      "alt": thumbnail.alt
    },
    seo
  }
`;

export const getCategoryBySlugQuery = `
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    mode,
    description,
    "thumbnail": {
      "url": thumbnail.asset->url,
      "alt": thumbnail.alt
    },
    seo
  }
`;

export const getFeaturedEntriesQuery = `
  *[_type == "catalogEntry"] | order(_createdAt desc)[0...8] {
    _id,
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
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      "thumbnail": {
        "url": thumbnail.asset->url,
        "alt": thumbnail.alt
      }
    }
  }
`;

export const getEntriesByCategorySlugQuery = `
  *[_type == "catalogEntry" && defined(category->slug.current) && category->slug.current == $slug]
  | order(title asc) {
    _id,
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
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      "thumbnail": {
        "url": thumbnail.asset->url,
        "alt": thumbnail.alt
      }
    },
    "subcategory": subcategory->{
      _id,
      title,
      "slug": slug.current,
      "thumbnail": {
        "url": thumbnail.asset->url,
        "alt": thumbnail.alt
      }
    },
    "brand": brand->{
      _id,
      title,
      "slug": slug.current
    },
    whatsapp,
    seo{
      metaTitle,
      metaDescription,
      ogImage{
        asset->{ url }
      }
    },
    catalogPdf{
      "url": asset->url
    }
  }
`;

export const getAllEntriesQuery = `
  *[_type == "catalogEntry"] | order(title asc) {
    _id,
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
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      "thumbnail": {
        "url": thumbnail.asset->url,
        "alt": thumbnail.alt
      }
    }
  }
`;

export const getEntryBySlugQuery = `
  *[_type == "catalogEntry" && slug.current == $slug][0]{
    _id,
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
    "brand": brand->{
      _id,
      title,
      "slug": slug.current
    },
    whatsapp,
    seo{
      metaTitle,
      metaDescription,
      ogImage{
        asset->{
          url
        }
      }
    },
    catalogPdf{
      "url": asset->url
    }
  }
`;

export const getSiteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    siteUrl,
    organization{
      name,
      whatsappNumber
    },
    whatsappNumber,
    seo{
      metaTitle,
      metaDescription
    }
  }
`;
