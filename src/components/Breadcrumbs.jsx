import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 text-xs font-medium text-zinc-500"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href || item.label} className="flex items-center">
              {index > 0 ? <span className="mx-1 text-zinc-300">/</span> : null}
              {isLast || !item.href ? (
                <span className="text-zinc-900">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="transition hover:text-zinc-900 hover:underline"
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
