export default {
    name: "grandchildCategory",
    title: "Grandchild Category",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title" },
            validation: (Rule) => Rule.required(),
        },
        {
            name: "subcategory",
            title: "Parent Subcategory",
            type: "reference",
            to: [{ type: "subcategory" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "thumbnail",
            title: "Thumbnail",
            type: "image",
            options: { hotspot: true },
            fields: [{ name: "alt", title: "Alt text", type: "string" }],
        },
        { name: "seo", title: "SEO", type: "seoFields" },
    ],
};
