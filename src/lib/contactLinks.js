import { normalizePhone } from "@/lib/whatsapp";

function hasAlphabeticCharacters(value) {
  return /[a-z]/i.test(String(value || ""));
}

export function createPhoneHref(phone) {
  if (!phone || hasAlphabeticCharacters(phone)) {
    return null;
  }

  const digitsOnly = normalizePhone(phone);

  if (!digitsOnly) {
    return null;
  }

  return String(phone).trim().startsWith("+")
    ? `tel:+${digitsOnly}`
    : `tel:${digitsOnly}`;
}

export function createEmailHref(email) {
  const trimmedEmail = String(email || "").trim();

  if (!trimmedEmail || !trimmedEmail.includes("@")) {
    return null;
  }

  return `mailto:${trimmedEmail}`;
}

export function createWhatsAppContactHref(phone) {
  const digitsOnly = normalizePhone(phone);

  if (!digitsOnly) {
    return null;
  }

  return `https://wa.me/${digitsOnly}`;
}
