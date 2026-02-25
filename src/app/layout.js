import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildSeoMetadata, getSiteName } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { getSiteSettingsQuery } from "@/sanity/lib/queries";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const revalidate = 60;

async function fetchSiteSettings() {
  try {
    return await client.fetch(getSiteSettingsQuery);
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const siteSettings = await fetchSiteSettings();
  const siteName = getSiteName(siteSettings);

  const metadata = buildSeoMetadata({
    siteSettings,
    seo: siteSettings?.defaultSeo,
    title: `${siteName} Catalog`,
    description:
      "Premium plywood, laminates, hardware and furniture solutions with WhatsApp-first enquiry.",
    path: "/",
  });

  if (siteSettings?.siteUrl) {
    try {
      metadata.metadataBase = new URL(siteSettings.siteUrl);
    } catch {
      metadata.metadataBase = undefined;
    }
  }

  return metadata;
}

export default async function RootLayout({ children }) {
  const siteSettings = await fetchSiteSettings();

  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <div className="relative min-h-screen bg-zinc-50 text-zinc-900">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#ffffff_0,_#fafafa_40%,_#f4f4f5_100%)]" />
          <Header siteSettings={siteSettings} />
          <main>{children}</main>
          <Footer siteSettings={siteSettings} />
        </div>
      </body>
    </html>
  );
}

