import Link from "next/link";
import { SITE } from "@/lib/types";
import type { CategoryConfig } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";
import CurrentDate from "./CurrentDate";
import Logo from "./Logo";

interface HeaderProps {
  categories: CategoryConfig[];
  activeSlug?: string;
}

export default function Header({ categories, activeSlug }: HeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar — logo + tagline + search + date + theme toggle */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border)] gap-3">
          <Link
            href="/"
            className="flex flex-col min-w-0 text-[var(--foreground)]"
            aria-label={`${SITE.nameEn} — ${SITE.tagline}`}
          >
            <Logo className="text-[var(--foreground)]" height="h-20 sm:h-24" />
            <span className="text-xs sm:text-sm text-[var(--muted)] mt-1 truncate">
              {SITE.tagline}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <CurrentDate />
            <form action="/search" method="get" className="hidden sm:block">
              <input
                type="search"
                name="q"
                placeholder="खबरें खोजें…"
                className="w-44 md:w-64 px-3 py-1.5 text-sm border border-[var(--border-strong)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] placeholder:text-[var(--muted)]"
              />
            </form>
            <ThemeToggle />
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex overflow-x-auto py-2 gap-1 scrollbar-thin">
          <Link
            href="/"
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              !activeSlug
                ? "bg-[var(--brand)] text-[var(--brand-fg)]"
                : "text-[var(--foreground)] hover:bg-[var(--surface-2)]"
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
                  ? "bg-[var(--brand)] text-[var(--brand-fg)]"
                  : "text-[var(--foreground)] hover:bg-[var(--surface-2)]"
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
