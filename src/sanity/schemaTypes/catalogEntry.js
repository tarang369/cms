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
            options: {
                filter: ({ document }) => {
                    const categoryRef = document?.category?._ref;

                    if (!categoryRef) {
                        return {};
                    }

                    return {
                        filter: "category._ref == $categoryId",
                        params: { categoryId: categoryRef },
                    };
                },
            },
        },

        {
            name: "grandchildCategory",
            title: "Grandchild Category (optional)",
            type: "reference",
            to: [{ type: "grandchildCategory" }],
            description:
                "Set this only if the selected subcategory uses grandchild categories.",
            hidden: ({ document }) => !document?.subcategory?._ref,
            options: {
                filter: ({ document }) => {
                    const subcategoryRef = document?.subcategory?._ref;

                    if (!subcategoryRef) {
                        return {};
                    }

                    return {
                        filter: "subcategory._ref == $subcategoryId",
                        params: { subcategoryId: subcategoryRef },
                    };
                },
            },
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
            title: "Product Images",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        { name: "alt", title: "Alt text", type: "string" },
                    ],
                },
            ],
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
                    name: "code",
                    title: "Product or Brand Code",
                    type: "string",
                },
                {
                    name: "messageTemplate",
                    title: "Additional WhatsApp Note",
                    type: "text",
                    rows: 3,
                    description:
                        "Optional. This no longer replaces the default WhatsApp enquiry format. If provided, the last meaningful line is appended as an extra note after the standard product details. Supports {{title}}, {{category}}, {{brand}}, {{code}}, {{slug}}, {{url}}, {{consent}}, and {{consentValue}} placeholders.",
                },
            ],
            description:
                "Uses the site's generic WhatsApp number. Set only the product code and an optional extra note here.",
        },

        { name: "seo", title: "SEO", type: "seoFields" },
    ],

    validation: (Rule) =>
        Rule.custom(async (doc, context) => {
            // Enforce category mode rules
            const categoryRef = doc?.category?._ref;
            const subcategoryRef = doc?.subcategory?._ref;
            const grandchildCategoryRef = doc?.grandchildCategory?._ref;
            if (!categoryRef) return true;

            const client = context.getClient({ apiVersion: "2025-01-01" });
            const [category, subcategory, grandchildCategory] = await Promise.all([
                client.fetch(
                    `*[_type=="category" && _id==$id][0]{
                        "mode": coalesce(mode, "direct")
                    }`,
                    { id: categoryRef },
                ),
                subcategoryRef
                    ? client.fetch(
                          `*[_type=="subcategory" && _id==$id][0]{
                              "mode": coalesce(mode, "direct"),
                              "categoryId": category._ref
                          }`,
                          { id: subcategoryRef },
                      )
                    : null,
                grandchildCategoryRef
                    ? client.fetch(
                          `*[_type=="grandchildCategory" && _id==$id][0]{
                              "subcategoryId": subcategory._ref
                          }`,
                          { id: grandchildCategoryRef },
                      )
                    : null,
            ]);

            if (!category?.mode) return true;

            if (category.mode === "direct" && (subcategoryRef || grandchildCategoryRef)) {
                return "This category is Direct. Do not set a subcategory or grandchild category for entries under it.";
            }

            if (category.mode === "subcategory" && !subcategoryRef) {
                return "This category requires a subcategory. Please select one.";
            }

            if (subcategoryRef && subcategory?.categoryId !== categoryRef) {
                return "The selected subcategory does not belong to the chosen category.";
            }

            if (!subcategoryRef && grandchildCategoryRef) {
                return "Select a subcategory before setting a grandchild category.";
            }

            if (
                grandchildCategoryRef &&
                grandchildCategory?.subcategoryId !== subcategoryRef
            ) {
                return "The selected grandchild category does not belong to the chosen subcategory.";
            }

            if (subcategory?.mode === "direct" && grandchildCategoryRef) {
                return "This subcategory is Direct. Do not set a grandchild category for entries under it.";
            }

            if (
                subcategory?.mode === "grandchildCategory" &&
                !grandchildCategoryRef
            ) {
                return "This subcategory requires a grandchild category. Please select one.";
            }

            return true;
        }),
};
