import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ siteSettings }) {
  const companyName =
    siteSettings?.organization?.name || "Neptune Plywood Private Limited";
  const logo = siteSettings?.organization?.logo;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 transition hover:opacity-90"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            {logo?.url ? (
              <Image
                src={logo.url}
                alt={logo.alt || companyName}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-700">
                NP
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-zinc-900 sm:text-base">
              {companyName}
            </p>
            <p className="truncate text-xs text-zinc-500">
              Premium catalog solutions
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav className="overflow-x-auto border-t border-zinc-200/70 px-4 py-2 md:hidden">
        <div className="flex min-w-max items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
