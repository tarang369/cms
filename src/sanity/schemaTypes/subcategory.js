export default {
    name: "subcategory",
    title: "Subcategory",
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
            name: "category",
            title: "Parent Category",
            type: "reference",
            to: [{ type: "category" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "mode",
            title: "Subcategory Structure Mode",
            type: "string",
            options: {
                list: [
                    {
                        title: "Direct (entries directly under subcategory)",
                        value: "direct",
                    },
                    {
                        title:
                            "Grandchild Category (entries under grandchild categories)",
                        value: "grandchildCategory",
                    },
                    { title: "Mixed (allow both)", value: "mixed" },
                ],
                layout: "radio",
            },
            initialValue: "direct",
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
