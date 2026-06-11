import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { getLatestPosts, getNavCategories, getPostsByCategory } from "@/lib/wp";
import { SITE } from "@/lib/types";
import type { Metadata } from "next";

// Revalidate every 60s — fast pages, fresh-ish content.
export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: SITE.url },
};

export default async function HomePage() {
  const [{ data: latest }, navCategories] = await Promise.all([
    getLatestPosts(1, 14),
    getNavCategories(),
  ]);

  // Pull 4 latest from each active category in parallel.
  const categoryStrips = await Promise.all(
    navCategories.slice(0, 4).map(async (cat) => {
      const { data: posts } = await getPostsByCategory(cat.id, 1, 4);
      return { cat, posts };
    }),
  );

  const [hero, ...rest] = latest;
  const subFeatured = rest.slice(0, 4);
  const moreLatest = rest.slice(4, 10);

  // Sidebar uses the rest of the latest posts (after hero + sub-featured + moreLatest).
  const sidebarLatest = rest.slice(10, 16).length > 0 ? rest.slice(10, 16) : rest;

  return (
    <>
      <Header categories={navCategories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* SEO: visually-hidden H1 (search engines see it, users don't). */}
        <h1 className="sr-only">
          {SITE.name} — ताज़ा खबरें, ब्रेकिंग न्यूज़ हिंदी में
        </h1>

        {/* Hero + sub-featured — sub-featured now in 2x2 grid that fills the right column. */}
        {hero && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="lg:col-span-2">
              <PostCard post={hero} size="hero" showExcerpt priority />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
              {subFeatured.map((p) => (
                <PostCard key={p.id} post={p} size="small" />
              ))}
            </div>
          </section>
        )}

        {/* ताज़ा खबरें — denser 4-col grid */}
        {moreLatest.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold border-l-4 border-[var(--brand)] pl-3 mb-5 text-[var(--foreground)]">
              ताज़ा खबरें
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {moreLatest.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  size="medium"
                  showExcerpt
                />
              ))}
            </div>
          </section>
        )}

        {/* Category strips — 4 latest from each of the top 4 categories */}
        <div className="space-y-10">
          {categoryStrips.map(({ cat, posts }) =>
            posts.length === 0 ? null : (
              <section key={cat.id}>
                <div className="flex items-baseline justify-between border-b-2 border-[var(--border)] pb-2 mb-5">
                  <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span>{cat.hindi}</span>
                  </h2>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium"
                  >
                    और देखें →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {posts.map((p) => (
                    <PostCard
                      key={p.id}
                      post={p}
                      size="medium"
                      showCategory={false}
                    />
                  ))}
                </div>
              </section>
            ),
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
