import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
  getLatestPosts,
  getNavCategories,
  getPostsByCategory,
} from "@/lib/wp";
import { CATEGORIES, SITE } from "@/lib/types";

// Revalidate every 60s.
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "श्रेणी नहीं मिली" };
  return {
    title: `${cat.hindi} — ताज़ा ${cat.name} खबरें`,
    description: `${cat.name} की ताज़ा खबरें, ब्रेकिंग न्यूज़ और अपडेट — ${SITE.name} पर।`,
    alternates: { canonical: `${SITE.url}/category/${cat.slug}` },
    openGraph: {
      title: `${cat.hindi} — ${SITE.name}`,
      description: `${cat.name} की ताज़ा खबरें — ${SITE.name}`,
      url: `${SITE.url}/category/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const [
    { data: posts, total, totalPages },
    navCategories,
    { data: latest },
  ] = await Promise.all([
    getPostsByCategory(cat.id, page, 12),
    getNavCategories(),
    getLatestPosts(1, 6),
  ]);

  return (
    <>
      <Header categories={navCategories} activeSlug={cat.slug} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/" className="hover:text-[var(--brand)]">होम</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--foreground)]">{cat.hindi}</span>
        </nav>

        <header className="border-b-2 border-[var(--brand)] pb-3 mb-6">
          <h1 className="text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
            <span className="text-4xl">{cat.emoji}</span>
            {cat.hindi}
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {cat.name} • {total.toLocaleString("en-IN")} खबरें
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main grid — 3-col on lg, fills the wider column */}
          <div className="lg:col-span-2">
            {posts.length === 0 ? (
              <p className="text-[var(--muted)] py-12 text-center">
                इस श्रेणी में अभी कोई खबर नहीं है।
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} size="medium" showExcerpt />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Link
                    href={`/category/${cat.slug}?page=${page - 1}`}
                    className="px-4 py-2 text-sm border border-[var(--border-strong)] rounded-md hover:bg-[var(--surface-2)] text-[var(--foreground)]"
                  >
                    ← पिछला
                  </Link>
                )}
                <span className="text-sm text-[var(--muted-fg)] px-3">
                  पृष्ठ {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/category/${cat.slug}?page=${page + 1}`}
                    className="px-4 py-2 text-sm border border-[var(--border-strong)] rounded-md hover:bg-[var(--surface-2)] text-[var(--foreground)]"
                  >
                    अगला →
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar latestPosts={latest} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
