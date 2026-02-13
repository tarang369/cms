import Link from "next/link";

export default function Layout({ children }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg"
          >
            Acme Catalog
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
            <Link
              href="/categories"
              className="rounded-full px-3 py-1 hover:bg-slate-100 hover:text-slate-900"
            >
              Categories
            </Link>
            <Link
              href="/products"
              className="rounded-full px-3 py-1 hover:bg-slate-100 hover:text-slate-900"
            >
              Products
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:text-sm">
          <span>© {year} Acme Catalog. All rights reserved.</span>
          <span className="text-slate-400">
            Powered by Next.js, Sanity, and Tailwind CSS.
          </span>
        </div>
      </footer>
    </div>
  );
}

