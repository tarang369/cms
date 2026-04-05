const CONSENT_LINE_LABEL = "Future WhatsApp updates consent";
const PRODUCT_LABEL = "Product";
const CATEGORY_LABEL = "Category";
const BRAND_LABEL = "Brand";
const CODE_LABEL = "Code";
const SLUG_LABEL = "Website reference";
const URL_LABEL = "Page";
const SOURCE_LABEL = "Source";

export function normalizePhone(phone) {
  if (!phone) {
    return "";
  }

  return String(phone).replace(/[^\d]/g, "");
}

function replaceTemplateTokens(template, replacements) {
  return Object.entries(replacements).reduce((message, [token, value]) => {
    const safeValue = value || "";

    return message.replace(
      new RegExp(`{{\\s*${token}\\s*}}`, "gi"),
      safeValue,
    );
  }, template);
}

function buildDefaultWhatsAppMessage({
  title,
  category,
  brand,
  productUrl,
  consentLine,
}) {
  const lines = [
    "Hello, I would like to inquire about the following product.",
    "",
    `${PRODUCT_LABEL}: ${title || "this catalog item"}`,
    category ? `${CATEGORY_LABEL}: ${category}` : null,
    brand ? `${BRAND_LABEL}: ${brand}` : null,
    "Quantity: (Please mention quantity)",
    productUrl ? `${URL_LABEL}: ${productUrl}` : null,
    "",
    "Please share the relevant details for this product.",
    "",
    "Thank you.",
    "",
    consentLine,
  ];

  return lines.filter(Boolean).join("\n").trim();
}

export function buildWhatsAppMessage({
  title,
  category,
  brand,
  code,
  slug,
  productUrl,
  messageTemplate,
  consentValue = "No",
}) {
  const safeTitle = title || "this catalog item";
  const safeCategory = category || "";
  const safeBrand = brand || "";
  const safeCode = code || "";
  const safeSlug = slug || "";
  const safeProductUrl = productUrl || "";
  const safeConsentValue = consentValue || "No";
  const consentLine = `${CONSENT_LINE_LABEL}: ${safeConsentValue}`;
  const productSummaryLines = [
    `${PRODUCT_LABEL}: ${safeTitle}`,
    safeCategory ? `${CATEGORY_LABEL}: ${safeCategory}` : null,
    safeBrand ? `${BRAND_LABEL}: ${safeBrand}` : null,
    "Quantity: (Please mention quantity)",
    safeProductUrl ? `${URL_LABEL}: ${safeProductUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (messageTemplate?.trim()) {
    const resolvedTemplate = replaceTemplateTokens(messageTemplate, {
      title: safeTitle,
      category: safeCategory,
      brand: safeBrand,
      code: safeCode,
      slug: safeSlug,
      url: safeProductUrl,
      consent: consentLine,
      consentValue: safeConsentValue,
    }).trim();

    const includesProductTitle =
      resolvedTemplate.toLowerCase().includes(safeTitle.toLowerCase()) ||
      resolvedTemplate.toLowerCase().includes(PRODUCT_LABEL.toLowerCase());

    if (includesProductTitle) {
      return resolvedTemplate;
    }

    return [
      "Hello, I would like to inquire about the following product.",
      "",
      productSummaryLines,
      "",
      resolvedTemplate,
    ]
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return buildDefaultWhatsAppMessage({
    title: safeTitle,
    category: safeCategory,
    brand: safeBrand,
    code: safeCode,
    slug: safeSlug,
    productUrl: safeProductUrl,
    consentLine,
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractLabeledLine(message, label) {
  if (!message || !label) {
    return "";
  }

  const match = message.match(
    new RegExp(`^${escapeRegExp(label)}\\s*:\\s*(.+)$`, "im"),
  );

  return match?.[1]?.trim() || "";
}

export function extractProductSlugFromUrl(productUrl) {
  if (!productUrl) {
    return "";
  }

  try {
    const pathname = new URL(productUrl, "https://placeholder.local").pathname;
    const segments = pathname.split("/").filter(Boolean);
    const productsIndex = segments.lastIndexOf("products");

    if (productsIndex >= 0 && segments[productsIndex + 1]) {
      return segments[productsIndex + 1];
    }

    return segments.at(-1) || "";
  } catch {
    return "";
  }
}

export function extractProductSnapshotFromMessage(message) {
  const productUrl = extractLabeledLine(message, URL_LABEL);
  const slugFromMessage = extractLabeledLine(message, SLUG_LABEL);

  return {
    title: extractLabeledLine(message, PRODUCT_LABEL),
    category: extractLabeledLine(message, CATEGORY_LABEL),
    brand: extractLabeledLine(message, BRAND_LABEL),
    code: extractLabeledLine(message, CODE_LABEL),
    slug: slugFromMessage || extractProductSlugFromUrl(productUrl),
    url: productUrl,
    source: extractLabeledLine(message, SOURCE_LABEL),
  };
}

export function parseFutureOutreachConsent(message) {
  const rawValue = extractLabeledLine(message, CONSENT_LINE_LABEL);
  const normalizedValue = rawValue.trim().toLowerCase();

  if (!normalizedValue) {
    return {
      status: "not_provided",
      text: "",
    };
  }

  if (/^(yes|y|true|granted|allow|allowed|opt[\s-]?in)\b/.test(normalizedValue)) {
    return {
      status: "granted",
      text: rawValue,
    };
  }

  if (
    /^(no|n|false|declined|deny|denied|do not|don't|not now|nope)\b/.test(
      normalizedValue,
    )
  ) {
    return {
      status: "declined",
      text: rawValue,
    };
  }

  return {
    status: "not_provided",
    text: rawValue,
  };
}

export function createWhatsAppHref({
  phone,
  fallbackPhone,
  title,
  category,
  brand,
  code,
  slug,
  productUrl,
  messageTemplate,
  message,
}) {
  const normalizedPhone = normalizePhone(phone || fallbackPhone);
  const resolvedMessage =
    message ||
    buildWhatsAppMessage({
      title,
      category,
      brand,
      code,
      slug,
      productUrl,
      messageTemplate,
    });

  if (!normalizedPhone || !resolvedMessage) {
    return null;
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
    resolvedMessage,
  )}`;
}
