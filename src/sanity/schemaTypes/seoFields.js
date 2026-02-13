export default {
    name: "seoFields",
    title: "SEO",
    type: "object",
    fields: [
        { name: "metaTitle", title: "Meta Title", type: "string" },
        {
            name: "metaDescription",
            title: "Meta Description",
            type: "text",
            rows: 3,
        },
        {
            name: "canonicalUrl",
            title: "Canonical URL",
            type: "url",
            description:
                "Optional. If empty, frontend can compute it from siteUrl + slug.",
        },
        { name: "ogImage", title: "Open Graph Image", type: "image" },
        {
            name: "noIndex",
            title: "No Index",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "keywords",
            title: "Keywords",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        },
        {
            name: "structuredDataOverride",
            title: "Structured Data Override (JSON)",
            type: "text",
            rows: 6,
            description:
                "Optional. Only if you want to override schema.org JSON-LD from CMS.",
        },
    ],
};
