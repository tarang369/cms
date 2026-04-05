import {
    buildWhatsAppMessage,
    createWhatsAppHref,
    normalizePhone,
} from "@/lib/whatsapp";

export default function WhatsAppCTA({
    phone,
    title,
    category,
    brand,
    code,
    slug,
    productUrl,
    messageTemplate,
    className = "",
}) {
    const message = buildWhatsAppMessage({
        title,
        category,
        brand,
        code,
        slug,
        productUrl,
        messageTemplate,
    });

    const whatsappHref = createWhatsAppHref({
        phone,
        message,
    });

    const resolvedPhone = phone || "";
    const normalizedPhone = normalizePhone(resolvedPhone);

    return (
        <div
            className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}
        >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                WhatsApp Enquiry
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                If you already know your required quantity, size, finish, or
                timeline, please mention it in the message before sending. For
                future product updates, change the consent line in WhatsApp from{" "}
                <strong>No</strong> to <strong>Yes</strong> before sending.
            </p>

            <div className="mt-4 space-y-2">
                {whatsappHref ? (
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-zinc-800"
                    >
                        Inquire on WhatsApp
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="ml-2 h-4 w-4 shrink-0"
                        >
                            <path
                                d="M6.25 13.75L13.75 6.25M8 6.25h5.75V12"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
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
                    Contact number:{" "}
                    {resolvedPhone ||
                        normalizedPhone ||
                        "Please update in Site Settings"}
                </p>
            </div>
        </div>
    );
}
