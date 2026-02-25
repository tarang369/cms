export function normalizePhone(phone) {
  if (!phone) {
    return "";
  }

  return String(phone).replace(/[^\d]/g, "");
}

export function buildWhatsAppMessage({
  title,
  category,
  code,
  messageTemplate,
}) {
  const safeTitle = title || "this catalog item";
  const safeCategory = category || "";
  const safeCode = code || "";

  if (messageTemplate?.trim()) {
    return messageTemplate
      .replace(/{{\s*title\s*}}/gi, safeTitle)
      .replace(/{{\s*category\s*}}/gi, safeCategory)
      .replace(/{{\s*code\s*}}/gi, safeCode)
      .trim();
  }

  const parts = [`Hi, I would like details about ${safeTitle}.`];

  if (safeCategory) {
    parts.push(`Category: ${safeCategory}.`);
  }

  if (safeCode) {
    parts.push(`Code: ${safeCode}.`);
  }

  return parts.join(" ");
}

export function createWhatsAppHref({
  phone,
  fallbackPhone,
  title,
  category,
  code,
  messageTemplate,
  message,
}) {
  const normalizedPhone = normalizePhone(phone || fallbackPhone);
  const resolvedMessage =
    message ||
    buildWhatsAppMessage({
      title,
      category,
      code,
      messageTemplate,
    });

  if (!normalizedPhone || !resolvedMessage) {
    return null;
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
    resolvedMessage,
  )}`;
}

