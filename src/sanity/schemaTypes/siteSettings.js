export default {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "siteName", title: "Site Name", type: "string" },
    { name: "siteUrl", title: "Site URL", type: "url" },

    {
      name: "defaultSeo",
      title: "Default SEO",
      type: "seoFields",
    },

    {
      name: "organization",
      title: "Organization",
      type: "object",
      fields: [
        { name: "name", title: "Name", type: "string" },
        { name: "logo", title: "Logo", type: "image" },
        { name: "phone", title: "Phone", type: "string" },
        { name: "whatsappNumber", title: "WhatsApp Number", type: "string" },
        { name: "address", title: "Address", type: "text", rows: 3 },
      ],
    },

    {
      name: "social",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    },
  ],

  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
};
