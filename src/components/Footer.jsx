import Link from "next/link";
import { createWhatsAppHref, normalizePhone } from "@/lib/whatsapp";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ siteSettings }) {
  const companyName =
    siteSettings?.organization?.name || "Neptune Plywood Private Limited";
  const year = new Date().getFullYear();

  const phone =
    siteSettings?.organization?.phone || "+91 00000 00000 (update in CMS)";
  const whatsappPhone =
    siteSettings?.organization?.whatsappNumber || "+91 00000 00000";
  const address =
    siteSettings?.organization?.address ||
    "Address details will be updated soon.";

  const whatsappHref = createWhatsAppHref({
    phone: whatsappPhone,
    title: "your catalog",
    message:
      "Hi, I would like to enquire about Neptune Plywood Private Limited catalogs.",
  });

  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-950 text-zinc-200">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-white">{companyName}</p>
          <p className="max-w-md text-sm leading-relaxed text-zinc-300">
            Premium plywood, laminates, hardware and furniture solutions for
            projects that need reliability, consistency and fast enquiry.
          </p>
          <p className="text-sm text-zinc-300">{address}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Quick Links
          </p>
          <div className="flex flex-col gap-2 text-sm">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-200 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/brands"
              className="text-zinc-200 transition hover:text-white"
            >
              Brands
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Contact
          </p>
          <p className="text-sm text-zinc-200">Phone: {phone}</p>
          <p className="text-sm text-zinc-200">
            WhatsApp: {normalizePhone(whatsappPhone) || "Not set"}
          </p>
          <p className="text-sm text-zinc-200">
            Email: sales@neptuneplywood.com
          </p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              Enquire on WhatsApp
            </a>
          ) : null}
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-xs text-zinc-400 sm:px-6 lg:px-8">
          <p>Copyright {year} {companyName}. All rights reserved.</p>
          <p>Catalog website powered by Next.js and Sanity.</p>
        </div>
      </div>
    </footer>
  );
}

