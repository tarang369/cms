export default {
    name: "category",
    title: "Category",
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
            name: "mode",
            title: "Category Structure Mode",
            type: "string",
            options: {
                list: [
                    {
                        title: "Direct (entries directly under category)",
                        value: "direct",
                    },
                    {
                        title: "Subcategory (entries under subcategories)",
                        value: "subcategory",
                    },
                    { title: "Mixed (allow both)", value: "mixed" },
                ],
                layout: "radio",
            },
            initialValue: "direct",
            validation: (Rule) => Rule.required(),
        },

        { name: "seo", title: "SEO", type: "seoFields" },
    ],
};
