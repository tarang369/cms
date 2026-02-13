import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 text-xs font-medium text-slate-500"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href || item.label} className="flex items-center">
              {index > 0 && <span className="mx-1 text-slate-300">/</span>}
              {isLast || !item.href ? (
                <span className="text-slate-700">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-slate-800 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

