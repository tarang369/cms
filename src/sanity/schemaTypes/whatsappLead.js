const whatsappLead = {
  name: "whatsappLead",
  title: "WhatsApp Lead",
  type: "document",
  fields: [
    {
      name: "receivedAt",
      title: "Received At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    },
    {
      name: "provider",
      title: "Provider",
      type: "string",
      options: {
        list: [{ title: "Meta Cloud API", value: "metaCloudApi" }],
      },
      initialValue: "metaCloudApi",
      readOnly: true,
    },
    {
      name: "source",
      title: "Lead Source",
      type: "string",
      initialValue: "product_whatsapp_cta",
      readOnly: true,
    },
    {
      name: "messageId",
      title: "Message ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    },
    {
      name: "messageType",
      title: "Message Type",
      type: "string",
      readOnly: true,
    },
    {
      name: "profileName",
      title: "Profile Name",
      type: "string",
    },
    {
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
    },
    {
      name: "waId",
      title: "WhatsApp ID",
      type: "string",
      readOnly: true,
    },
    {
      name: "messageBody",
      title: "Message Body",
      type: "text",
      rows: 8,
      readOnly: true,
    },
    {
      name: "catalogEntry",
      title: "Catalog Entry",
      type: "reference",
      to: [{ type: "catalogEntry" }],
      readOnly: true,
    },
    {
      name: "productSnapshot",
      title: "Product Snapshot",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string", readOnly: true },
        { name: "category", title: "Category", type: "string", readOnly: true },
        { name: "brand", title: "Brand", type: "string", readOnly: true },
        { name: "code", title: "Code", type: "string", readOnly: true },
        {
          name: "slug",
          title: "Website Reference",
          type: "string",
          readOnly: true,
        },
        { name: "url", title: "Page URL", type: "url", readOnly: true },
      ],
    },
    {
      name: "consent",
      title: "Consent Tracking",
      type: "object",
      fields: [
        {
          name: "customerInitiated",
            title: "Customer Initiated Enquiry",
          type: "boolean",
          initialValue: true,
          readOnly: true,
        },
        {
          name: "replyBasis",
          title: "Reply Basis",
          type: "string",
          initialValue: "customer_initiated_message",
          readOnly: true,
        },
        {
          name: "futureOutreachStatus",
          title: "Future Outreach Consent",
          type: "string",
          options: {
            list: [
              { title: "Granted", value: "granted" },
              { title: "Declined", value: "declined" },
              { title: "Not Provided", value: "not_provided" },
            ],
          },
          initialValue: "not_provided",
          readOnly: true,
        },
        {
          name: "futureOutreachText",
          title: "Captured Consent Text",
          type: "string",
          readOnly: true,
        },
        {
          name: "capturedAt",
          title: "Captured At",
          type: "datetime",
          readOnly: true,
        },
      ],
    },
    {
      name: "rawPayload",
      title: "Raw Webhook Payload",
      type: "text",
      rows: 12,
      readOnly: true,
    },
  ],

  orderings: [
    {
      title: "Newest first",
      name: "receivedAtDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      profileName: "profileName",
      phoneNumber: "phoneNumber",
      productTitle: "productSnapshot.title",
      consentStatus: "consent.futureOutreachStatus",
    },
    prepare({ profileName, phoneNumber, productTitle, consentStatus }) {
      return {
        title: profileName || phoneNumber || "WhatsApp lead",
        subtitle: [
          productTitle,
          consentStatus && `Future outreach: ${consentStatus}`,
        ]
          .filter(Boolean)
          .join(" | "),
      };
    },
  },
};

export default whatsappLead;
