export default {
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "logo", title: "Logo", type: "image" },
    { name: "description", title: "Description", type: "text", rows: 4 },
    { name: "website", title: "Website", type: "url" },
    { name: "seo", title: "SEO", type: "seoFields" },
  ],
};