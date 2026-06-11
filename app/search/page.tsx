import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { getNavCategories, searchPosts } from "@/lib/wp";
import { SITE } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: sp.q ? `“${sp.q}” के लिए खोज — ${SITE.name}` : "खोजें",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = (sp.q || "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const navCategories = await getNavCategories();
  const results = query
    ? await searchPosts(query, page, 12)
    : { data: [], total: 0, totalPages: 0 };

  return (
    <>
      <Header categories={navCategories} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">
            {query ? `“${query}” के लिए परिणाम` : "खबरें खोजें"}
          </h1>
          {query && (
            <p className="text-sm text-zinc-500 mt-1">
              {results.total.toLocaleString("en-IN")} परिणाम मिले
            </p>
          )}
          <form action="/search" method="get" className="mt-4 max-w-xl">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="खबरें खोजें…"
              className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </form>
        </header>

        {query && results.data.length === 0 ? (
          <p className="text-zinc-500 py-12 text-center">
            कोई परिणाम नहीं मिला। दूसरे शब्द आज़माएँ।
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.data.map((p) => (
              <PostCard key={p.id} post={p} size="medium" showExcerpt showCategory />
            ))}
          </div>
        )}

        {results.totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                className="px-4 py-2 text-sm border border-zinc-300 rounded-md hover:bg-zinc-50"
              >
                ← पिछला
              </Link>
            )}
            <span className="text-sm text-zinc-600 px-3">
              पृष्ठ {page} / {results.totalPages}
            </span>
            {page < results.totalPages && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                className="px-4 py-2 text-sm border border-zinc-300 rounded-md hover:bg-zinc-50"
              >
                अगला →
              </Link>
            )}
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
