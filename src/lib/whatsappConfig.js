function getEnvValue(key) {
  const value = process.env[key];

  return typeof value === "string" ? value.trim() : "";
}

export function getConfiguredWhatsAppNumber() {
  return getEnvValue("WHATSAPP_DEFAULT_PHONE_NUMBER");
}

export function getConfiguredSiteUrl(siteSettings) {
  return (
    getEnvValue("WHATSAPP_SITE_URL_OVERRIDE") ||
    siteSettings?.siteUrl ||
    ""
  );
}
