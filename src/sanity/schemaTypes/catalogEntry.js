export default {
    name: "catalogEntry",
    title: "Catalog Entry",
    type: "document",
    fields: [
        {
            name: "entryKind",
            title: "Entry Kind",
            type: "string",
            options: {
                list: [
                    { title: "Product (normal detail page)", value: "product" },
                    {
                        title: "PDF Catalog (brand catalog style)",
                        value: "pdfCatalog",
                    },
                ],
                layout: "radio",
            },
            initialValue: "product",
            validation: (Rule) => Rule.required(),
        },

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
            title: "Category",
            type: "reference",
            to: [{ type: "category" }],
            validation: (Rule) => Rule.required(),
        },

        {
            name: "subcategory",
            title: "Subcategory (optional)",
            type: "reference",
            to: [{ type: "subcategory" }],
            description: "Set this only if the category uses subcategories.",
        },

        {
            name: "brand",
            title: "Brand (optional)",
            type: "reference",
            to: [{ type: "brand" }],
            hidden: ({ document }) => document?.entryKind !== "pdfCatalog",
        },

        {
            name: "summary",
            title: "Summary",
            type: "text",
            rows: 3,
        },

        {
            name: "gallery",
            title: "Image Gallery",
            type: "array",
            of: [{ type: "image" }],
        },

        {
            name: "catalogPdf",
            title: "Catalog PDF",
            type: "file",
            options: { accept: "application/pdf" },
            // hidden: ({ document }) => document?.entryKind !== "pdfCatalog",
        },

        {
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        },

        {
            name: "whatsapp",
            title: "WhatsApp CTA",
            type: "object",
            fields: [
                {
                    name: "phone",
                    title: "Phone (with country code)",
                    type: "string",
                },
                {
                    name: "code",
                    title: "Product or Brand Code",
                    type: "string",
                },
                {
                    name: "messageTemplate",
                    title: "Message Template",
                    type: "text",
                    rows: 3,
                },
            ],
        },

        { name: "seo", title: "SEO", type: "seoFields" },
    ],

    validation: (Rule) =>
        Rule.custom(async (doc, context) => {
            // Enforce category mode rules
            const categoryRef = doc?.category?._ref;
            if (!categoryRef) return true;

            const client = context.getClient({ apiVersion: "2025-01-01" });
            const category = await client.fetch(
                `*[_type=="category" && _id==$id][0]{mode}`,
                { id: categoryRef },
            );

            if (!category?.mode) return true;

            if (category.mode === "direct" && doc.subcategory?._ref) {
                return "This category is Direct. Do not set a subcategory for entries under it.";
            }

            if (category.mode === "subcategory" && !doc.subcategory?._ref) {
                return "This category requires a subcategory. Please select one.";
            }

            return true;
        }),
};
