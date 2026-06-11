import Link from "next/link";
import { SITE } from "@/lib/types";
import type { CategoryConfig } from "@/lib/types";

interface HeaderProps {
  categories: CategoryConfig[];
  activeSlug?: string;
}

export default function Header({ categories, activeSlug }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar — logo + tagline */}
        <div className="flex items-center justify-between py-3 border-b border-zinc-100">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-red-600 leading-none">
              {SITE.name}
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5">
              {SITE.tagline}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <form action="/search" method="get" className="hidden sm:block">
              <input
                type="search"
                name="q"
                placeholder="खबरें खोजें…"
                className="w-44 md:w-64 px-3 py-1.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </form>
            <Link
              href="/wp-admin"
              className="text-xs text-zinc-500 hover:text-red-600"
              title="WordPress admin"
            >
              एडमिन
            </Link>
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex overflow-x-auto py-2 gap-1 scrollbar-thin">
          <Link
            href="/"
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              !activeSlug
                ? "bg-red-600 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            होम
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeSlug === c.slug
                  ? "bg-red-600 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.hindi}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
