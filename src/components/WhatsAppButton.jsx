function buildMessage({ title, category, code, messageTemplate }) {
  const safeTitle = title || "";
  const safeCategory = category || "";
  const safeCode = code || "";

  if (messageTemplate && messageTemplate.trim().length > 0) {
    return messageTemplate
      .replace(/{{\s*title\s*}}/g, safeTitle)
      .replace(/{{\s*category\s*}}/g, safeCategory)
      .replace(/{{\s*code\s*}}/g, safeCode);
  }

  return `Hi, I want details for ${safeTitle || "this item"}.`;
}

export default function WhatsAppButton({
  phone,
  fallbackPhone,
  title,
  category,
  code,
  messageTemplate,
  className = "",
}) {
  const rawPhone = phone || fallbackPhone;
  const normalizedPhone = rawPhone ? rawPhone.replace(/[^\d]/g, "") : null;

  const message = buildMessage({ title, category, code, messageTemplate });
  const href =
    normalizedPhone && message
      ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
      : null;

  const baseClasses =
    "inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  if (!href) {
    return (
      <button
        type="button"
        disabled
        className={`${baseClasses} cursor-not-allowed opacity-60 ${className}`}
      >
        WhatsApp unavailable
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${className}`}
    >
      <span className="mr-1.5 text-xs">WhatsApp</span>
      <span className="text-[11px] font-normal opacity-90">
        Enquire on WhatsApp
      </span>
    </a>
  );
}

