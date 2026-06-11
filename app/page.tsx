import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { getLatestPosts, getNavCategories, getPostsByCategory } from "@/lib/wp";
import { CATEGORIES, SITE } from "@/lib/types";
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

  return (
    <>
      <Header categories={navCategories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Top banner ad slot */}
        <AdSlot
          slot="homepage-top-banner"
          format="horizontal"
          height={90}
          className="mb-6"
        />

        {/* Hero + sub-featured */}
        {hero && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PostCard post={hero} size="hero" showExcerpt priority />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {subFeatured.map((p) => (
                <PostCard key={p.id} post={p} size="small" />
              ))}
            </div>
          </section>
        )}

        {/* Inline ad */}
        <AdSlot
          slot="homepage-mid"
          format="horizontal"
          height={90}
          className="my-8"
        />

        {/* Latest grid */}
        {moreLatest.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 border-l-4 border-red-600 pl-3 mb-5">
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
                <div className="flex items-baseline justify-between border-b-2 border-zinc-200 pb-2 mb-5">
                  <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span>{cat.hindi}</span>
                  </h2>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
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

        {/* Bottom ad */}
        <AdSlot
          slot="homepage-bottom"
          format="horizontal"
          height={90}
          className="mt-10"
        />
      </main>

      <Footer />
    </>
  );
}
