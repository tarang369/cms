import {
  buildWhatsAppMessage,
  createWhatsAppHref,
  normalizePhone,
} from "@/lib/whatsapp";

export default function WhatsAppCTA({
  phone,
  fallbackPhone,
  title,
  category,
  code,
  messageTemplate,
  className = "",
}) {
  const message = buildWhatsAppMessage({
    title,
    category,
    code,
    messageTemplate,
  });

  const whatsappHref = createWhatsAppHref({
    phone,
    fallbackPhone,
    message,
  });

  const resolvedPhone = normalizePhone(phone || fallbackPhone);

  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        WhatsApp Enquiry
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">{message}</p>

      <div className="mt-4 space-y-2">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Enquire on WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-600"
          >
            WhatsApp unavailable
          </button>
        )}

        <p className="text-xs text-zinc-500">
          Contact number: {resolvedPhone || "Please update in Site Settings"}
        </p>
      </div>
    </div>
  );
}

